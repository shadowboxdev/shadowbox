import { Directionality } from '@angular/cdk/bidi';
import { CDK_DRAG_CONFIG, DragDropConfig } from '../cdk';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  HostListener,
  Inject,
  NgZone,
  OnChanges,
  Optional,
  Self,
  SimpleChanges,
  SkipSelf,
  ViewContainerRef,
} from '@angular/core';
import { TSV_DRAG_PARENT } from '../drag-parent';
import { DragDrop, DragDropGrid } from '../providers/drag-drop';
import { TsvDrag } from './drag';
import { TsvDragHandle, TSV_DRAG_HANDLE } from './drag-handle';
import { TsvDropList, TSV_DROP_LIST } from './drop-list';
import { DragRef } from '../drag-ref';
import { GridSortService } from '../providers/sort';
import { GridStore } from '../providers/grid-store.service';
import { SelectionService } from '../providers/selection.service';
import { coerceElement } from '@angular/cdk/coercion';
import { TsvGrid, TSV_GRID } from './grid';
import { GridItemRef } from '../grid-item-ref';

@Directive({
  selector: '[tsvGridItem]',
  exportAs: 'tsvGridItem',
  // eslint-disable-next-line no-use-before-define
  providers: [{ provide: TSV_DRAG_PARENT, useExisting: TsvGridItem }],
})
export class TsvGridItem<T = any> extends TsvDrag<T> {
  public gridGroup: string = 'defaultGroup';
  public _dragRef: GridItemRef<TsvGridItem<T>>;

  constructor(
    private readonly _sort: GridSortService,
    private readonly _selection: SelectionService,
    /** Element that the draggable is attached to. */
    element: ElementRef<HTMLElement>,
    /** Droppable container that the draggable is a part of. */
    @Inject(TSV_GRID)
    @Optional()
    @SkipSelf()
    dropContainer: TsvGrid,
    /**
     * @deprecated `_document` parameter no longer being used and will be removed.
     * @breaking-change 12.0.0
     */
    @Inject(DOCUMENT) _document: any,
    _ngZone: NgZone,
    _viewContainerRef: ViewContainerRef,
    @Optional() @Inject(CDK_DRAG_CONFIG) config: DragDropConfig,
    @Optional() _dir: Directionality,
    dragDrop: DragDropGrid,
    _changeDetectorRef: ChangeDetectorRef,
    @Optional()
    @Self()
    @Inject(TSV_DRAG_HANDLE)
    _selfHandle?: TsvDragHandle
  ) {
    super(
      element,
      dropContainer,
      _document,
      _ngZone,
      _viewContainerRef,
      config,
      _dir,
      dragDrop,
      _changeDetectorRef,
      _selfHandle
    );

    this._setSubscriptions();
  }

  private _setSubscriptions() {
    this.started.subscribe((event) => {
      this._selection.selectElementIfNoSelection(
        this.gridGroup,
        // coerceElement(this._dragRef.initialContainer.element)
        this.getPlaceholderElement()
      );
      this._sort.initSort(this.gridGroup);
    });
  }
}
