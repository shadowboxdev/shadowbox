
import { coerceCssPixelValue } from '@angular/cdk/coercion';
import { Point } from '@angular/cdk/drag-drop';
import { map, append, sortBy, path, compose, curryN, findIndex as rFindIndex, reduce, head, forEach, addIndex, flatten, groupWith, pathEq, last } from 'ramda';
import { floor, toArray } from 'ramda-adjunct';
import { moveItemInArray } from './cdk';

import { adjustClientRect, getMutableClientRect, isPointerNearClientRect } from './cdk/client-rect';
import { DropListRef } from './drop-list-ref';
import { GridItemRef } from './grid-item-ref';
import * as utils from './utils';
/**
 * Proximity, as a ratio to width/height, at which a
 * dragged item will affect the drop container.
 */
const DROP_PROXIMITY_THRESHOLD = 0.05;

/**
 * Entry in the position cache for draggable items.
 * @docs-private
 */
interface CachedGridItemPosition {
  /** Instance of the drag item. */
  drag: GridItemRef;
  /** Dimensions of the item. */
  clientRect: ClientRect;
  /** Amount by which the item has been moved since dragging started. */
  offset: number;

  gridOffset?: Point;
  /** The row offset for the grid item  */
  rowOffset?: number;
}

const forEachIndexed = addIndex(forEach);
const getLeftPos = path<number>(['clientRef', 'left']);
const sortByLeft = sortBy(getLeftPos)
const addItemToGrid = curryN(2, (item: CachedGridItemPosition, row: CachedGridItemPosition[]) => compose(
  sortByLeft,
  append(item)
)(row)
);
// const findRowOffset = curryN(2, (top: number, cacheKeys: IterableIterator<number>) => compose(
//   max(0),
//   rFindIndex(equals(top)),
//   toArray
// )(cacheKeys)
// );

export class GridRef<T = any> extends DropListRef<T> {
  private readonly _grid = new Map<number, CachedGridItemPosition[]>();
  public dragIndex: number = 0;

  protected _initialContainer: GridRef<T>;
  protected _dropContainer: GridRef<T>;

  /** Cache of the dimensions of all the items inside the container. */
  protected _itemPositions: CachedGridItemPosition[] = [];

  protected _previousSwap = { drag: null as GridItemRef | null, delta: { x: 0, y: 0 }, overlaps: false };


  /**
 * Draggable items that are currently active inside the container. Includes the items
 * from `_draggables`, as well as any items that have been dragged in, but haven't
 * been dropped yet.
 */
  protected _activeDraggables: GridItemRef[];

  /** Caches the current items in the list and their positions. */
  protected _cacheItems(): void {
    super._cacheItems();

    const grid = this._grid
    const siblings = this._itemPositions;

    map((item: CachedGridItemPosition) => {
      const { clientRect } = item;
      const { top } = clientRect;
      const hasRow = grid.has(top);


      item = { ...item, gridOffset: { x: 0, y: 0 }, rowOffset: 0 };

      if (!hasRow) {
        let rowOffset: number = 0;

        grid.forEach((_, k) => {
          if (k < top) rowOffset += grid.get(k).length;
        })

        item = { ...item, rowOffset };

        grid.set(top, [item]);

      } else {
        let row = grid.get(top);
        const rowOffset = last(row).rowOffset + 1;

        item = { ...item, rowOffset };

        row = addItemToGrid(item, row);

        grid.set(top, row);

      }

      this._updateItemPositionCache(item);


    }, siblings);
  }

  protected _cacheItemPositions(): void {
    const itemPositions = map(drag => {
      const elementToMeasure = drag.getVisibleElement();

      return { drag, offset: 0, clientRect: getMutableClientRect(elementToMeasure) };
    }, this._activeDraggables)

    this._itemPositions = flatten(groupWith(pathEq(['clientRect', 'top']), itemPositions));
  }

  /**
 * Figures out the index of an item in the container.
 * @param item Item whose index should be determined.
 */
  public getItemIndex(item: GridItemRef): number {
    if (!this._isDragging) return this._draggables.indexOf(item);

    return rFindIndex(currentItem => currentItem.drag === item, this._itemPositions);
  }

  /**
   * Sorts an item inside the container based on its position.
   * @param item Item to be sorted.
   * @param pointerX Position of the item along the X axis.
   * @param pointerY Position of the item along the Y axis.
   * @param pointerDelta Direction in which the pointer is moving along each axis.
   */
  public _sortItem(
    item: GridItemRef,
    pointerX: number,
    pointerY: number,
    pointerDelta: Point
  ): void {
    const insideClientRect = isPointerNearClientRect(this._clientRect, DROP_PROXIMITY_THRESHOLD, pointerX, pointerY);
    // Don't sort the item if sorting is disabled or it's out of range.
    if (this.sortingDisabled || !insideClientRect) return;

    const siblings = this._itemPositions;

    const newIndex = this._getItemIndexFromPointerPosition(item, pointerX, pointerY, pointerDelta);

    if (newIndex === -1 && siblings.length > 0) return;

    const currentIndex = this._getGridItemCurrentIndex(item);

    if (newIndex === currentIndex) return;

    const siblingAtNewPosition = siblings[newIndex];

    const currentPosition = siblings[currentIndex].clientRect;
    const newPosition = siblingAtNewPosition.clientRect;
    const delta = currentIndex > newIndex ? 1 : -1;

    // How many pixels the item's placeholder should be offset.
    const itemOffset = this._getItemOffsetPx(currentPosition, newPosition, delta);

    // How many pixels all the other items should be offset.
    const siblingOffset = this._getSiblingOffsetPx(currentIndex, siblings, delta);

    // Save the previous order of the items before moving the item to its new index.
    // We use this to check whether an item has been moved as a result of the sorting.
    const oldOrder = siblings.slice();

    // Shuffle the array in place.
    moveItemInArray(siblings, currentIndex, newIndex);

    this.sorted.next({
      previousIndex: currentIndex,
      currentIndex: newIndex,
      container: this,
      item
    });

    forEachIndexed((sibling: CachedGridItemPosition, index: number) => {
      // Don't do anything if the position hasn't changed.
      if (oldOrder[index] === sibling) return;



      const isDraggedItem = sibling.drag === item;
      const offset = isDraggedItem ? itemOffset : siblingOffset;
      const elementToOffset = isDraggedItem ? item.getPlaceholderElement() :
        sibling.drag.getRootElement();


      // Update the offset to reflect the new position.

      // console.log(offset, isDraggedItem);
      // sibling.gridOffset.x += offset.x;
      // sibling.gridOffset.y += offset.y;
      sibling.offset += offset;

      // Round the transforms since some browsers will
      // blur the elements, for sub-pixel transforms.
      const offsetXPx = coerceCssPixelValue(Math.round(sibling.offset));
      // const offsetYPx = coerceCssPixelValue(Math.round(sibling.gridOffset.y));

      // console.log(offsetXPx, offsetYPx);
      elementToOffset.style.transform = `translate3d(${offsetXPx}, 0, 0)`;
      adjustClientRect(sibling.clientRect, 0, offset);



    }, siblings);

  }
  // public _sortItem(
  //   item: GridItemRef,
  //   pointerX: number,
  //   pointerY: number,
  //   pointerDelta: Point
  // ): void {
  //   const insideClientRect = isPointerNearClientRect(this._clientRect, DROP_PROXIMITY_THRESHOLD, pointerX, pointerY);
  //   // Don't sort the item if sorting is disabled or it's out of range.
  //   if (this.sortingDisabled || !insideClientRect) return;

  //   const siblings = this._itemPositions;

  //   const newIndex = this._getItemIndexFromPointerPosition(item, pointerX, pointerY, pointerDelta);


  //   if (newIndex === -1 && siblings.length > 0) return;

  //   const currentIndex = this._getGridItemCurrentIndex(item);

  //   console.log('currentIndex :', currentIndex)
  //   console.log('newIndex :', newIndex);

  //   const siblingAtNewPosition = siblings[newIndex];
  //   const currentPosition = siblings[currentIndex].clientRect;
  //   const newPosition = siblingAtNewPosition.clientRect;
  //   const delta = currentIndex > newIndex ? 1 : -1;

  //   // How many pixels the item's placeholder should be offset.
  //   const itemOffset = this._getItemOffset(currentPosition, newPosition, delta, pointerDelta);

  //   // How many pixels all the other items should be offset.
  //   const siblingOffset = this._getSiblingOffset(currentIndex, pointerY, delta, pointerDelta);

  //   // Save the previous order of the items before moving the item to its new index.
  //   // We use this to check whether an item has been moved as a result of the sorting.
  //   const oldOrder = siblings.slice();

  //   // Shuffle the array in place.
  //   moveItemInArray(siblings, currentIndex, newIndex);

  //   this.sorted.next({
  //     previousIndex: currentIndex,
  //     currentIndex: newIndex,
  //     container: this,
  //     item
  //   });

  //   this.sort(item.getVisibleElement(), currentIndex, newIndex);

  //   // forEachIndexed((sibling: CachedGridItemPosition, index: number) => {
  //   //   // Don't do anything if the position hasn't changed.
  //   //   if (oldOrder[index] === sibling) return;



  //   //   const isDraggedItem = sibling.drag === item;
  //   //   const offset = isDraggedItem ? itemOffset : siblingOffset;
  //   //   const elementToOffset = isDraggedItem ? item.getPlaceholderElement() :
  //   //     sibling.drag.getRootElement();


  //   //   // Update the offset to reflect the new position.

  //   //   // console.log(offset, isDraggedItem);
  //   //   sibling.gridOffset.x += offset.x;
  //   //   sibling.gridOffset.y += offset.y;

  //   //   // Round the transforms since some browsers will
  //   //   // blur the elements, for sub-pixel transforms.
  //   //   const offsetXPx = coerceCssPixelValue(Math.round(offset.x));
  //   //   const offsetYPx = coerceCssPixelValue(Math.round(offset.y));

  //   //   elementToOffset.style.transform = `translate3d(${offsetXPx}, ${offsetYPx}, 0)`;
  //   //   adjustClientRect(sibling.clientRect, offset.y, offset.x);



  //   // }, siblings);

  //   // Note that it's important that we do this after the client rects have been adjusted.
  //   // this._previousSwap.overlaps = isInsideClientRect(newPosition, pointerX, pointerY);
  //   // this._previousSwap.drag = siblingAtNewPosition.drag;
  //   // this._previousSwap.delta = pointerDelta;

  // }

  public sort(dragElement: HTMLElement, currentIndex: number, newIndex: number): void {
    console.log(currentIndex);
    const hoverIndex = utils.findIndex(dragElement);
    const el = this.getSibling(dragElement, currentIndex, hoverIndex);


    this._activeDraggables.forEach(drag => {
      const insertedNode = dragElement.parentNode.insertBefore(drag.getVisibleElement(), el.node);
      // this._class.addPlaceHolderClass(insertedNode as Element);
    });
    this.dragIndex = utils.findIndex(this._activeDraggables[0].getVisibleElement());
  }

  private getSibling(dropElement: any, dragIndex: number, hoverIndex: number): any | null {

    if (dragIndex < hoverIndex) {
      return { node: dropElement.nextSibling, originalIndex: hoverIndex + 1 };
    }

    return { node: dropElement, originalIndex: hoverIndex };
  }

  /**
  * Gets the index of an item in the drop container, based on the position of the user's pointer.
  * @param item Item that is being sorted.
  * @param pointerX Position of the user's pointer along the X axis.
  * @param pointerY Position of the user's pointer along the Y axis.
  * @param delta Direction in which the user is moving their pointer.
  */
  // protected _getItemIndexFromPointerPosition(item: GridItemRef, pointerX: number, pointerY: number,
  //   delta?: { x: number, y: number }): number {
  //   const element = document.elementFromPoint(pointerX, pointerY);

  //   function __findIndex(element: Element): number {
  //     const allElements = element.parentElement.children;

  //     return Array.prototype.indexOf.call(allElements, element);
  //   }
  //   console.log(__findIndex(element));

  //   return __findIndex(element);
  // console.log();

  // const itemPositions: CachedGridItemPosition[] = this._getCachedGridItemPositions(pointerY);



  // let _rowOffset: number = 0;

  // let index = findIndex(itemPositions, ({ drag, clientRect, rowOffset }, _, array) => {
  //   if (drag === item) {
  //     // If there's only one item left in the container, it must be
  //     // the dragged item itself so we use it as a reference.
  //     return array.length < 2;
  //   }

  //   if (delta) {
  //     const direction = delta;

  //     // If the user is still hovering over the same item as last time, their cursor hasn't left
  //     // the item after we made the swap, and they didn't change the direction in which they're
  //     // dragging, we don't consider it a direction swap.
  //     if (drag === this._previousSwap.drag && this._previousSwap.overlaps &&
  //       direction.x === this._previousSwap.delta.x && direction.y === this._previousSwap.delta.y) {
  //       return false;
  //     }
  //   }

  //   _rowOffset = rowOffset;

  //   return pointerX >= Math.floor(clientRect.left) && pointerX < Math.floor(clientRect.right) &&
  //     pointerY >= Math.floor(clientRect.top) && pointerY < Math.floor(clientRect.bottom);
  // });

  // return (index === -1 || !this.sortPredicate(index, item, this)) ? -1 : _rowOffset;
  // }

  protected _reset(): void {
    super._reset();

    this._previousSwap.delta = { x: 0, y: 0 };
    this._grid.clear();
  }

  /**
 * Gets the offset in pixels by which the item that is being dragged should be moved.
 * @param currentPosition Current position of the item.
 * @param newPosition Position of the item where the current item should be moved.
 * @param delta Direction in which the user is moving.
 */
  protected _getItemOffsetPxls(currentPosition: ClientRect, newPosition: ClientRect, delta: 1 | -1, isHorizontal: boolean) {
    let itemOffset = isHorizontal ? newPosition.left - currentPosition.left :
      newPosition.top - currentPosition.top;

    // Account for differences in the item width/height.
    // console.log(delta)
    if (delta === -1) {
      itemOffset += isHorizontal ? newPosition.width - currentPosition.width :
        newPosition.height - currentPosition.height;
    }

    return itemOffset;
  }

  /**
   * Gets the offset in pixels by which the item that is being dragged should be moved.
   * @param currentPosition Current position of the item.
   * @param newPosition Position of the item where the current item should be moved.
   * @param delta Direction in which the user is moving.
   */
  private _getItemOffset(currentPosition: ClientRect, newPosition: ClientRect, delta: 1 | -1, pointerDelta: Point): Point {


    let itemXOffset: number = 0;
    let itemYOffset: number = 0;



    itemXOffset = newPosition.left - currentPosition.left;//this._getItemOffsetPxls(currentPosition, newPosition, delta as any, false);
    itemYOffset = newPosition.top - currentPosition.top; //this._getItemOffsetPxls(currentPosition, newPosition, delta as any, true);

    if (delta === -1) {
      if (pointerDelta.x === 1) {
        itemXOffset += newPosition.width - currentPosition.width;
      }
    }
    if (delta === -1) {
      if (pointerDelta.y === 1) {
        itemYOffset += newPosition.height - currentPosition.height;
      }



    }

    console.log({ x: itemXOffset, y: itemYOffset });

    return { x: itemXOffset, y: itemYOffset };
  }


  /**
   * Gets the offset in pixels by which the items that aren't being dragged should be moved.
   * @param currentIndex Index of the item currently being dragged.
   * @param siblings All of the items in the list.
   * @param delta Direction in which the user is moving.
   */
  private _getSiblingOffset(currentIndex: number, newIndex: number, delta: number): Point {

    const siblings = this._itemPositions;

    const isHorizontal = true;
    const currentPosition = siblings[currentIndex].clientRect;
    const newPosition = siblings[newIndex].clientRect;

    // console.log(pointerDelta);


    const immediateSibling = siblings[newIndex];
    let siblingXOffset = newPosition['width'] * delta;
    let siblingYOffset = newPosition['height'] * delta;
    // console.log(immediateSibling);

    if (immediateSibling) {
      const start = isHorizontal ? 'left' : 'top';
      const end = isHorizontal ? 'right' : 'bottom';

      // Get the spacing between the start of the current item and the end of the one immediately
      // after it in the direction in which the user is dragging, or vice versa. We add it to the
      // offset in order to push the element to where it will be when it's inline and is influenced
      // by the `margin` of its siblings.
      if (delta === -1) {
        siblingXOffset -= immediateSibling.clientRect['left'] - currentPosition['right'];
        siblingYOffset -= immediateSibling.clientRect['top'] - currentPosition['bottom'];
      } else {
        siblingXOffset += currentPosition['left'] - immediateSibling.clientRect['right'];
        siblingYOffset += currentPosition['top'] - immediateSibling.clientRect['bottom'];
      }
    }

    return { x: siblingXOffset, y: siblingYOffset };
  }

  private _updateItemPositionCache(item: CachedGridItemPosition) {

    const index = rFindIndex(currentItem => currentItem.drag === item.drag, this._itemPositions);

    this._itemPositions[index] = item;
  }

  private _getGridItemCurrentIndex(item: GridItemRef): number {
    const index = rFindIndex(currentItem => currentItem.drag === item, this._itemPositions);

    // console.log('_getGridItemCurrentIndex', index);

    // console.log(this._itemPositions[index]);

    return index
  }

  /** get the current siblings based on the current y pointer position */
  private _getCachedGridItemPositions(pointerY: number): CachedGridItemPosition[] {

    const grid = this._grid;
    const rowIndexes = toArray(this._grid.keys());

    return reduce((acc, rowIndex) => {
      const rowItemPositions = grid.get(rowIndex)
      const { clientRect } = head(rowItemPositions);
      const { top, bottom } = clientRect;

      if (pointerY >= floor(top) && pointerY < floor(bottom)) {
        acc = rowItemPositions;
      }

      return acc;

    }, [], rowIndexes);
  }
}

/**
 * Finds the index of an item that matches a predicate function. Used as an equivalent
 * of `Array.prototype.findIndex` which isn't part of the standard Google typings.
 * @param array Array in which to look for matches.
 * @param predicate Function used to determine whether an item is a match.
 */
function findIndex<T>(array: T[], predicate: (value: T, index: number, obj: T[]) => boolean): number {

  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i], i, array)) {
      return i;
    }
  }

  return -1;
}
