import { Injectable, Inject, NgZone, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ViewportRuler } from '@angular/cdk/scrolling';
import {
  DragDrop as CdkDragDrop,
  DragDropRegistry,
  DragRefConfig,
} from '../cdk';

import { DragRef } from '../drag-ref';
import { DropListRef } from '../drop-list-ref';
import { GridRef } from '../grid-ref';
import { GridItemRef } from '../grid-item-ref';

/** Default configuration to be used when creating a `DragRef`. */
const DEFAULT_CONFIG = {
  dragStartThreshold: 5,
  pointerDirectionChangeThreshold: 5,
};

/**
 * Service that allows for drag-and-drop functionality to be attached to DOM elements.
 */
@Injectable({ providedIn: 'root' })
export class DragDrop extends CdkDragDrop {
  constructor(
    @Inject(DOCUMENT) readonly _doc: any,
     readonly __ngZone: NgZone,
     readonly _ruler: ViewportRuler,
     readonly _registry: DragDropRegistry<DragRef, DropListRef>
  ) {
    super(_doc, __ngZone, _ruler, _registry);
  }

  /**
   * Turns an element into a draggable item.
   * @param element Element to which to attach the dragging functionality.
   * @param config Object used to configure the dragging behavior.
   */
  public createDrag<T = any>(
    element: ElementRef<HTMLElement> | HTMLElement,
    config: DragRefConfig = DEFAULT_CONFIG
  ): DragRef<T> {
    console.log('createDrag');
    return new DragRef<T>(
      element,
      config,
      this._doc,
      this.__ngZone,
      this._ruler,
      this._registry
    );
  }

  /**
   * Turns an element into a drop list.
   * @param element Element to which to attach the drop list functionality.
   */
  public createDropList<T = any>(
    element: ElementRef<HTMLElement> | HTMLElement
  ): DropListRef<T> {
    console.log('createDropList');

    return new DropListRef<T>(
      element,
      this._registry,
      this._doc,
      this.__ngZone,
      this._ruler
    );
  }
}

@Injectable({ providedIn: 'root' })
export class DragDropGrid extends CdkDragDrop {
  constructor(
    @Inject(DOCUMENT) readonly _doc: any,
     readonly __ngZone: NgZone,
     readonly _ruler: ViewportRuler,
     readonly _registry: DragDropRegistry<DragRef, DropListRef>
  ) {
    super(_doc, __ngZone, _ruler, _registry);
  }

  /**
   * Turns an element into a draggable item.
   * @param element Element to which to attach the dragging functionality.
   * @param config Object used to configure the dragging behavior.
   */
  public createDrag<T = any>(
    element: ElementRef<HTMLElement> | HTMLElement,
    config: DragRefConfig = DEFAULT_CONFIG
  ): DragRef<T> {
    return new GridItemRef<T>(
      element,
      config,
      this._doc,
      this.__ngZone,
      this._ruler,
      this._registry
    );
  }

  /**
   * Turns an element into a drop list.
   * @param element Element to which to attach the drop list functionality.
   */
  public createDropList<T = any>(
    element: ElementRef<HTMLElement> | HTMLElement
  ): DropListRef<T> {
    return new GridRef<T>(
      element,
      this._registry,
      this._doc,
      this.__ngZone,
      this._ruler
    );
  }
}
