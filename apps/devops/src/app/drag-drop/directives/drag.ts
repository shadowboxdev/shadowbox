import { Directionality } from '@angular/cdk/bidi';
import {
  CdkDrag,
  CDK_DRAG_CONFIG,
  DragAxis,
  DragDropConfig,
  DragStartDelay,
  Point,
} from '../cdk';
import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  ContentChild,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  Self,
  SkipSelf,
  ViewContainerRef,
} from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';
import { TsvDragDrop, TsvDragEnd, TsvDragEnter, TsvDragExit, TsvDragMove, TsvDragRelease, TsvDragStart } from '../drag-events';
import { TSV_DRAG_PARENT } from '../drag-parent';

import { DragRef } from '../drag-ref';
import { DragDrop } from '../providers/drag-drop';
import { TsvDragHandle, TSV_DRAG_HANDLE } from './drag-handle';
import { TsvDragPlaceholder, TSV_DRAG_PLACEHOLDER } from './drag-placeholder';
import { TsvDragPreview, TSV_DRAG_PREVIEW } from './drag-preview';
import { TsvDropList, TSV_DROP_LIST } from './drop-list';

@Directive({
  selector: '[tsvDrag]',
  exportAs: 'tsvDrag',
  host: {
    class: 'tsv-drag',
    '[class.tsv-drag-disabled]': 'disabled',
    '[class.tsv-drag-dragging]': '_dragRef.isDragging()',
  },
  providers: [{ provide: TSV_DRAG_PARENT, useExisting: TsvDrag }],
})
export class TsvDrag<T = any>
  extends CdkDrag<T>
  implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  public _dragRef: DragRef<TsvDrag<T>>;
  /** css class that is applied to the drag preview element */
  @Input('tsvDragPreviewClass')
  public dragPreviewClass: string | null = null;

  /** css class that is applied to the drag placeholder element */
  @Input('tsvDragPlaceholderClass')
  public dragPlaceholderClass: string | null = null;

  /** Animate drag fn Callback */
  @Input('tsvDragAnimate')
  public animateDrag: (
    dragRef: DragRef,
    point: Point,
    pickupPositionInElement: Point
  ) => void;

  /** Arbitrary data to attach to this drag instance. */
  @Input('tsvDragData')
  public data: T;

  /** Locks the position of the dragged element along the specified axis. */
  @Input('tsvDragLockAxis')
  public lockAxis: DragAxis;

  /**
   * Selector that will be used to determine the root draggable element, starting from
   * the `cdkDrag` element and going up the DOM. Passing an alternate root element is useful
   * when trying to enable dragging on an element that you might not have access to.
   */
  @Input('tsvDragRootElement')
  public rootElementSelector: string;

  /**
   * Node or selector that will be used to determine the element to which the draggable's
   * position will be constrained. If a string is passed in, it'll be used as a selector that
   * will be matched starting from the element's parent and going up the DOM until a match
   * has been found.
   */
  @Input('tsvDragBoundary')
  public boundaryElement:
    | string
    | ElementRef<HTMLElement>
    | HTMLElement;

  /**
   * Amount of milliseconds to wait after the user has put their
   * pointer down before starting to drag the element.
   */
  @Input('tsvDragStartDelay')
  public dragStartDelay: DragStartDelay;

  /**
   * Sets the position of a `CdkDrag` that is outside of a drop container.
   * Can be used to restore the element's position for a returning user.
   */
  @Input('tsvDragFreeDragPosition')
  public freeDragPosition: Point;

  /** Whether starting to drag this element is disabled. */
  @Input('tsvDragDisabled')
  public get disabled(): boolean {
    return super.disabled;
  }
  public set disabled(value: boolean) {
    super.disabled = value;
  }

  /**
   * Function that can be used to customize the logic of how the position of the drag item
   * is limited while it's being dragged. Gets called with a point containing the current position
   * of the user's pointer on the page and should return a point describing where the item should
   * be rendered.
   */
  @Input('tsvDragConstrainPosition')
  public constrainPosition?: (
    point: Point,
    dragRef: DragRef
  ) => Point;

  /** Class to be added to the preview element. */
  @Input('tsvDragPreviewClass')
  public previewClass: string | string[];

  /** Emits when the user starts dragging the item. */
  @Output('tsvDragStarted')
  public readonly started = new EventEmitter<TsvDragStart>();

  /** Emits when the user has released a drag item, before any animations have started. */
  @Output('tsvDragReleased')
  public readonly released = new EventEmitter<TsvDragRelease>();

  /** Emits when the user stops dragging an item in the container. */
  @Output('tsvDragEnded')
  public readonly ended = new EventEmitter<TsvDragEnd>();

  /** Emits when the user has moved the item into a new container. */
  @Output('tsvDragEntered')
  public entered = new EventEmitter<TsvDragEnter<any>>();

  /** Emits when the user removes the item its container by dragging it into another container. */
  @Output('tsvDragExited')
  public readonly exited = new EventEmitter<TsvDragExit<any>>();

  /** Emits when the user drops the item inside a container. */
  @Output('tsvDragDropped')
  public readonly dropped = new EventEmitter<TsvDragDrop<any>>();

  /**
   * Emits as the user is dragging the item. Use with caution,
   * because this event will fire for every pixel that the user has dragged.
   */
  @Output('tsvDragMoved')
  public readonly moved: Observable<TsvDragMove<T>> = new Observable(
    (observer: Observer<TsvDragMove<T>>) => {
      const subscription = this._dragRef.moved
        .pipe(
          map((movedEvent) => ({
            source: this,
            pointerPosition: movedEvent.pointerPosition,
            event: movedEvent.event,
            delta: movedEvent.delta,
            distance: movedEvent.distance,
          }))
        )
        .subscribe(observer);

      return () => {
        subscription.unsubscribe();
      };
    }
  );

  /** Elements that can be used to drag the draggable item. */
  @ContentChildren(TSV_DRAG_HANDLE, { descendants: true })
  public _handles: QueryList<TsvDragHandle>;

  /** Element that will be used as a template to create the draggable item's preview. */
  @ContentChild(TSV_DRAG_PREVIEW)
  public _previewTemplate: TsvDragPreview;

  /** Template for placeholder element rendered to show where a draggable would be dropped. */
  @ContentChild(TSV_DRAG_PLACEHOLDER)
  public _placeholderTemplate: TsvDragPlaceholder;

  constructor(
    /** Element that the draggable is attached to. */
    element: ElementRef<HTMLElement>,
    /** Droppable container that the draggable is a part of. */
    @Inject(TSV_DROP_LIST)
    @Optional()
    @SkipSelf()
    dropContainer: TsvDropList,
    /**
     * @deprecated `_document` parameter no longer being used and will be removed.
     * @breaking-change 12.0.0
     */
    @Inject(DOCUMENT) _document: any,
    _ngZone: NgZone,
    _viewContainerRef: ViewContainerRef,
    @Optional() @Inject(CDK_DRAG_CONFIG) config: DragDropConfig,
    @Optional() _dir: Directionality,
    dragDrop: DragDrop,
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
  }

  public ngOnInit(): void {
    this._dragRef.dragPreviewClass = this.dragPreviewClass;
    this._dragRef.dragPlaceholderClass = this.dragPlaceholderClass;
    this._dragRef.animateDrag = this.animateDrag;
  }
}
