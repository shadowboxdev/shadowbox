import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  CdkDropList,
  CDK_DRAG_CONFIG,
  DragAxis,
  DragDropConfig,
  DropListOrientation,
} from '../cdk';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  InjectionToken,
  Input,
  OnDestroy,
  Optional,
  Output,
  SkipSelf,
} from '@angular/core';
import { TsvDragDrop, TsvDragEnter, TsvDragExit, TsvDragSortEvent } from '../drag-events';
import { DropListRef } from '../drop-list-ref';
import { DragDrop } from '../providers/drag-drop';
import { TsvDrag } from './drag';
import { TsvDropListGroup, TSV_DROP_LIST_GROUP } from './drop-list-group';

/** Counter used to generate unique ids for drop zones. */
let _uniqueIdCounter = 0;

export const TSV_DROP_LIST = new InjectionToken<TsvDropList>('TsvDropList');

@Directive({
  selector: '[tsvDropList], tsv-drop-list',
  exportAs: 'tsvDropList',
  providers: [
    // Prevent child drop lists from picking up the same group as their parent.
    { provide: TSV_DROP_LIST_GROUP, useValue: undefined },
    { provide: TSV_DROP_LIST, useExisting: TsvDropList },
  ],
  host: {
    class: 'tsv-drop-list',
    '[attr.id]': 'id',
    '[class.tsv-drop-list-disabled]': 'disabled',
    '[class.tsv-drop-list-dragging]': '_dropListRef.isDragging()',
    '[class.tsv-drop-list-receiving]': '_dropListRef.isReceiving()',
  },
})
export class TsvDropList<T = any> extends CdkDropList implements OnDestroy {
  private _parentDropList: TsvDropList<T>;
  private _useCopy = false;

  @Input('tsvParentDropList')
  public get parentDropList(): TsvDropList<T> {
    return this._parentDropList;
  }
  public set parentDropList(dropList: TsvDropList<T>) {
    this._parentDropList = dropList;
  }

  @Input('useCopy')
  public get useCopy(): boolean {
    return this._useCopy;
  }
  public set useCopy(value: boolean) {
    this._useCopy = coerceBooleanProperty(value);
  }

  /**
   * Other draggable containers that this container is connected to and into which the
   * container's items can be transferred. Can either be references to other drop containers,
   * or their unique IDs.
   */
  @Input('tsvDropListConnectedTo')
  public connectedTo: (TsvDropList | string)[] | TsvDropList | string = [];

  /** Arbitrary data to attach to this container. */
  @Input('tsvDropListData')
  public data: T;

  /** Direction in which the list is oriented. */
  @Input('tsvDropListOrientation')
  public orientation: DropListOrientation;

  /**
   * Unique ID for the drop zone. Can be used as a reference
   * in the `connectedTo` of another `CdkDropList`.
   */
  @Input()
  public id: string = `tsv-drop-list-${_uniqueIdCounter++}`;

  /** Locks the position of the draggable elements inside the container along the specified axis. */
  @Input('tsvDropListLockAxis')
  public lockAxis: DragAxis;

  /** Whether starting a dragging sequence from this container is disabled. */
  @Input('tsvDropListDisabled')
  public get disabled(): boolean {
    return super.disabled;
  }
  public set disabled(value: boolean) {
    super.disabled = value;
  }

  /** Whether sorting within this drop list is disabled. */
  @Input('tsvDropListSortingDisabled')
  public readonly sortingDisabled: boolean;

  /**
   * Function that is used to determine whether an item
   * is allowed to be moved into a drop container.
   */
  @Input('tsvDropListEnterPredicate')
  public readonly enterPredicate: (
    drag: TsvDrag,
    drop: TsvDropList
  ) => boolean = () => true;

  /** Functions that is used to determine whether an item can be sorted into a particular index. */
  @Input('tsvDropListSortPredicate')
  public readonly sortPredicate: (
    index: number,
    drag: TsvDrag,
    drop: TsvDropList
  ) => boolean = () => true;

  /** Whether to auto-scroll the view when the user moves their pointer close to the edges. */
  @Input('tsvDropListAutoScrollDisabled')
  public readonly autoScrollDisabled: boolean;

  /** Emits when the user drops an item inside the container. */
  @Output('tsvDropListDropped')
  public readonly dropped = new EventEmitter<TsvDragDrop<T, any>>();

  /**
   * Emits when the user has moved a new drag item into this container.
   */
  @Output('tsvDropListEntered')
  public readonly entered = new EventEmitter<TsvDragEnter<T>>();

  /**
   * Emits when the user removes an item from the container
   * by dragging it into another container.
   */
  @Output('tsvDropListExited')
  public readonly exited = new EventEmitter<TsvDragExit<T>>();

  /** Emits as the user is swapping items while actively dragging. */
  @Output('tsvDropListSorted')
  public readonly sorted = new EventEmitter<TsvDragSortEvent<T>>();

  /** Reference to the underlying drop list instance. */
  public _dropListRef: DropListRef<TsvDropList<T>>;

  constructor(
    /** Element that the drop list is attached to. */
    element: ElementRef<HTMLElement>,
    dragDrop: DragDrop,
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
}
