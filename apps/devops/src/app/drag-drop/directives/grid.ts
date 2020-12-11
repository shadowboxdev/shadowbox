import { Directionality } from '@angular/cdk/bidi';
import { CDK_DRAG_CONFIG, DragDropConfig } from '../cdk';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  HostListener,
  Inject,
  InjectionToken,
  OnChanges,
  OnInit,
  Optional,
  SimpleChanges,
  SkipSelf,
} from '@angular/core';
import { DragDrop, DragDropGrid } from '../providers/drag-drop';
import { TsvDropList, TSV_DROP_LIST } from './drop-list';
import { TsvDropListGroup, TSV_DROP_LIST_GROUP } from './drop-list-group';
import { GridSortService } from '../providers/sort';
import { GridStore } from '../providers/grid-store.service';

export const TSV_GRID = new InjectionToken<TsvGrid>('TSV_GRID');

@Directive({
  selector: '[tsvGrid], tsv-grid',
  exportAs: 'tsvGrid',
  providers: [
    // Prevent child drop lists from picking up the same group as their parent.
    { provide: TSV_DROP_LIST_GROUP, useValue: undefined },
    { provide: TSV_GRID, useExisting: TsvGrid },
  ],
})
export class TsvGrid<T = any>
  extends TsvDropList<T>
  implements OnInit, OnChanges {
  public gridGroup: string = 'defaultGroup';

  constructor(
    private readonly _sort: GridSortService,
    private readonly _store: GridStore,
    /** Element that the drop list is attached to. */
    element: ElementRef<HTMLElement>,
    dragDrop: DragDropGrid,
    _changeDetectorRef: ChangeDetectorRef,
    _scrollDispatcher: ScrollDispatcher,
    @Optional() _dir?: Directionality,
    @Optional()
    @Inject(TSV_DROP_LIST_GROUP)
    @SkipSelf()
    _group?: TsvDropListGroup<TsvDropList>,
    @Optional() @Inject(CDK_DRAG_CONFIG) config?: DragDropConfig
  ) {
    super(
      element,
      dragDrop,
      _changeDetectorRef,
      _scrollDispatcher,
      _dir,
      _group,
      config
    );
  }

  public ngOnInit(): void {
    // this._dragDropRegistry.dragStart.subscribe(() => {
    //   this.onDragStart();
    // });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const dataChanges = changes.data;
    const gridItems = dataChanges.currentValue ? dataChanges.currentValue : [];

    if (!this._store.hasGroup(this.gridGroup)) {
      this._store.initState(this.gridGroup, gridItems);

      return;
    }
    this._store.setItems(this.gridGroup, gridItems);
  }

  public onDragStart(): void {
    // this._sort.initSort(this.gridGroup);
  }

  @HostListener('drop', ['$event'])
  public _dragoverhanlder(event): void {
    console.log('event');
  }
}
