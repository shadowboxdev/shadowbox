import { Injectable } from '@angular/core';
import { fromEvent, merge, NEVER, Observable, Subject } from 'rxjs';
import { filter, mapTo, switchMap, withLatestFrom } from 'rxjs/operators';
import { findIndex } from '../utils';
import { ElementClass } from './element-class';
import { GridStore } from './grid-store.service';

enum ChangeAction {
  ADD,
  REMOVE,
}

interface SelectionChange {
  key: string;
  item: Element;
  action: ChangeAction;
}

@Injectable({
  providedIn: 'root',
})
export class SelectionService {
  private COMMAND_KEY = 'Meta';
  private CONTROL_KEY = 'Control';

  private selectionChange$ = new Subject<SelectionChange>();

  constructor(
    private _class: ElementClass,
    private _store: GridStore
  ) {
    const selectionKeyPressed$ = this.selectionKeyPressed();
    this.selectionChange$
      .pipe(withLatestFrom(selectionKeyPressed$))
      .subscribe(([selectionChange, selectionKeyPressed]) => {
        selectionKeyPressed
          ? this.handleSelectionChange(selectionChange)
          : this.resetSelectedItems(selectionChange.key);
      });
  }

  private resetSelectedItems(group: string): void {
    this._store
      .getSelectedItems(group)
      .forEach((item) => this._class.removeSelectedClass(item.node));
    this._store.resetSelectedItems(group);
  }

  private handleSelectionChange(selectionChange: SelectionChange): void {
    if (selectionChange.action === ChangeAction.ADD) {
      this._class.addSelectedClass(selectionChange.item);
      this._store.addSelectedItem(selectionChange.key, {
        node: selectionChange.item,
        originalIndex: findIndex(selectionChange.item),
      });
    }
    if (selectionChange.action === ChangeAction.REMOVE) {
      this._class.removeSelectedClass(selectionChange.item);
      this._store.removeSelectedItem(
        selectionChange.key,
        selectionChange.item
      );
    }
  }

  private selectionKeyPressed(): Observable<boolean> {
    const selectionKeyPressed = fromEvent(window, 'keydown').pipe(
      filter(
        (keyboardEvent: KeyboardEvent) =>
          keyboardEvent.key === this.COMMAND_KEY ||
          keyboardEvent.key === this.CONTROL_KEY
      ),
      mapTo(true)
    );
    const keyup = fromEvent(window, 'keyup').pipe(mapTo(false));
    return merge(selectionKeyPressed, keyup);
  }

  public selectElementIfNoSelection(
    group: string,
    dragedElement: Element
  ): void {
    if (this._store.hasSelectedItems(group)) {
      return;
    }
    this._store.addSelectedItem(group, {
      node: dragedElement,
      originalIndex: findIndex(dragedElement),
    });
  }

  public updateSelectedDragItem(
    key: string,
    item: Element,
    selected: boolean
  ): void {
    this.selectionChange$.next({
      key,
      item,
      action: selected ? ChangeAction.ADD : ChangeAction.REMOVE,
    });
  }
}
