import { Injectable } from '@angular/core';
import { timer } from 'rxjs';

import { ElementClass } from './element-class';
import { GridStore } from './grid-store.service';
import { GridElement, GridElements } from '../models';
import * as utils from '../utils';

@Injectable({
  providedIn: 'root'
})
export class GridSortService {
  private dragIndex: number;
  private dragElements: GridElements;

  constructor(private readonly _class: ElementClass, private readonly _store: GridStore) {}

  public initSort(group: string): void {
    this.dragIndex = this._store.getFirstSelectItem(group).originalIndex;
    this.dragElements = this._store.getSelectedItems(group);

    console.log(this.dragIndex);
  }

  public sort(dropElement: Element): void {
    const hoverIndex = utils.findIndex(dropElement);
    const el = this.getSibling(dropElement, this.dragIndex, hoverIndex);

    if (this.isDropInSelection(el)) {
      return;
    }
    this.dragElements.forEach((dragElement: GridElement) => {
      const insertedNode = dropElement.parentNode.insertBefore(dragElement.node, el.node);
      this._class.addPlaceHolderClass(insertedNode as Element);
    });
    this.dragIndex = utils.findIndex(this.dragElements[0].node);
  }

  public endSort(): void {
    this.dragElements.forEach((dragElement: GridElement) => {
      this.updateDroppedItem(dragElement.node);
    });
  }

  private getSibling(dropElement: any, dragIndex: number, hoverIndex: number): GridElement | null {
    if (dragIndex < hoverIndex) {
      return { node: dropElement.nextSibling, originalIndex: hoverIndex + 1 };
    }

    return { node: dropElement, originalIndex: hoverIndex };
  }

  private isDropInSelection(dropElement: GridElement): boolean {
    return !!this.dragElements.find(
      (dragElement: GridElement) => dragElement.node === dropElement.node
    );
  }

  private updateDroppedItem(item: Element): void {
    this._class.removePlaceHolderClass(item);
    this._class.addDroppedClass(item);
    this._class.removeSelectedClass(item);
    timer(500).subscribe(() => this._class.removeDroppedClass(item));
  }
}
