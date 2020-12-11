import { Injectable } from '@angular/core';

import { GridElement, GridElements } from '../models';

// TODO add interfaces for classes
export interface GridState {
  items: any[];
  classes: any;
  selectedItems: GridElements;
}

@Injectable({
  providedIn: 'root'
})
export class GridStore {
  private state = new Map<string, GridState>();

  public initState(group: string, items: any[] = [], classes: any = {}): void {
    this.state.set(group, { items: [...items], classes, selectedItems: [] });
  }

  public addSelectedItem(group: string, dragElement: GridElement): void {
    this.state.get(group).selectedItems.push(dragElement);
  }

  public removeSelectedItem(group: string, item: Element): void {
    const updatedItems = this.state
      .get(group)
      .selectedItems.filter((dragElement: GridElement) => dragElement.node !== item);
    this.setSelectedItems(group, updatedItems);
  }

  public setItems(group: string, items: any): void {
    this.state.get(group).items = [...items];
  }

  public getItems(group: string): any[] {
    return this.state.get(group).items;
  }

  public hasItems(group: string): boolean {
    return this.getItems(group).length > 0;
  }

  public hasGroup(group: string): boolean {
    return this.state.has(group);
  }

  public getSelectedItems(group: string): GridElement[] {
    return this.state.get(group).selectedItems;
  }

  public setSelectedItems(group: string, selectedItems: any[]): void {
    this.state.get(group).selectedItems = [...selectedItems];
  }

  public getFirstSelectItem(group: string): GridElement {
    return this.state.get(group).selectedItems[0];
  }

  public hasSelectedItems(group: string): boolean {
    return this.getSelectedItems(group).length > 0;
  }

  public resetSelectedItems(group: string): void {
    this.setSelectedItems(group, []);
  }

  public getClasses(group: string): any[] {
    return this.state.get(group).classes;
  }
}
