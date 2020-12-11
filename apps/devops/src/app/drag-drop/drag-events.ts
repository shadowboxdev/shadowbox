import {
  CdkDragDrop,
  CdkDragEnd,
  CdkDragEnter,
  CdkDragExit,
  CdkDragMove,
  CdkDragRelease,
  CdkDragSortEvent,
  CdkDragStart,
  Point,
} from './cdk';

import { TsvDrag } from './directives/drag';
import { TsvDropList } from './directives/drop-list';

/** Event emitted when the user starts dragging a draggable. */
export interface TsvDragStart<T = any> extends CdkDragStart<T> {
  source: TsvDrag<T>;
}

/** Event emitted when the user releases an item, before any animations have started. */
export interface TsvDragRelease<T = any> extends CdkDragRelease<T> {
  source: TsvDrag<T>;
}

/** Event emitted when the user stops dragging a draggable. */
export interface TsvDragEnd<T = any> extends CdkDragEnd<T> {
  /** Draggable that emitted the event. */
  source: TsvDrag<T>;
  /** Distance in pixels that the user has dragged since the drag sequence started. */
  distance: Point;
}

/** Event emitted when the user moves an item into a new drop container. */
export interface TsvDragEnter<T = any, I = T> extends CdkDragEnter<T, I> {
  /** Container into which the user has moved the item. */
  container: TsvDropList<T>;
  /** Item that was moved into the container. */
  item: TsvDrag<I>;
}

/**
 * Event emitted when the user removes an item from a
 * drop container by moving it into another one.
 */
export interface TsvDragExit<T = any, I = T> extends CdkDragExit<T, I> {
  /** Container from which the user has a removed an item. */
  container: TsvDropList<T>;
  /** Item that was removed from the container. */
  item: TsvDrag<I>;
}

/** Event emitted when the user drops a draggable item inside a drop container. */
export interface TsvDragDrop<T, O = T> extends CdkDragDrop<T, O> {
  item: TsvDrag;
  /** Container in which the item was dropped. */
  container: TsvDropList<T>;
  /** Container from which the item was picked up. Can be the same as the `container`. */
  previousContainer: TsvDropList<O>;
}

/** Event emitted as the user is dragging a draggable item. */
export interface TsvDragMove<T = any> extends CdkDragMove<T> {
  /** Item that is being dragged. */
  source: TsvDrag<T>;
  /** Native event that is causing the dragging. */
  event: MouseEvent | TouchEvent;
}

/** Event emitted when the user swaps the position of two drag items. */
export interface TsvDragSortEvent<T = any, I = T>
  extends CdkDragSortEvent<T, I> {
  /** Container that the item belongs to. */
  container: TsvDropList<T>;
  /** Item that is being sorted. */
  item: TsvDrag<I>;
}
