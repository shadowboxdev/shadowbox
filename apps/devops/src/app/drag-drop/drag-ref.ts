import { coerceElement } from '@angular/cdk/coercion';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { ElementRef, NgZone } from '@angular/core';
import { DragDropRegistry, DragRef as CdkDragRef, Point } from './cdk';
import { DragRefConfig } from './cdk/drag-ref';
import { toggleVisibility } from './cdk/drag-styling';

import { DropListRef } from './drop-list-ref';

/** Animation frame rate; 60FPS */
const FRAME_RATE: number = 1000 / 60;
/** Customization placeholder class */
const PLACEHOLDER_CLASS: string = 'tsv-drag-placeholder';
/** Customization preview class */
const PREVIEW_CLASS: string = 'tsv-drag-preview';

export class DragRef<T = any> extends CdkDragRef<T> {
  /** NodeJs animation timeout */
  private _animationInterval: any;

  protected _initialContainer: DropListRef<T>;
  protected _dropContainer: DropListRef<T>;

  /** Animation x-axis velocity vector */
  public xVelocity: number = 0;

  /** Animation rotation in radians */
  public rotation: number = 0;

  /** Position of the element while animating */
  public cardPosition: Point = { x: 0, y: 0 };

  /** Animation Function */
  public animateDrag?: (
    dragRef: DragRef,
    point: Point,
    pickupPositionInElement: Point,
    _animationInterval: any
  ) => void;

  /** css class to be added to drag preview when provided */
  public dragPreviewClass: string | null = null;

  /** css class to be added to drag placeholder when provided  */
  public dragPlaceholderClass: string | null = null;

  public _pointerPositionOnPage: Point | null = null;

  constructor(
    element: ElementRef<HTMLElement> | HTMLElement,
    protected _config: DragRefConfig,
    protected _document: Document,
    protected _ngZone: NgZone,
    protected _viewportRuler: ViewportRuler,
    protected _dragDropRegistry: DragDropRegistry<DragRef, DropListRef>
  ) {
    super(
      element,
      _config,
      _document,
      _ngZone,
      _viewportRuler,
      _dragDropRegistry
    );

    this._setSubscriptions();
  }

  public getPreviewElement(): HTMLElement {
    return this._preview;
  }

  public dispose(): void {
    super.dispose();

    if (this.animateDrag) clearInterval(this._animationInterval);
  }

  protected _createPlaceholderElement(): HTMLElement {
    const placeholder = super._createPlaceholderElement();

    placeholder.classList.add(PLACEHOLDER_CLASS);

    if (this.dragPlaceholderClass) {
      placeholder.classList.add(this.dragPlaceholderClass);
    }

    return placeholder;
  }

  protected _createPreviewElement(): HTMLElement {
    const preview = super._createPreviewElement();

    preview.classList.add(PREVIEW_CLASS);

    if (this.dragPreviewClass) {
      preview.classList.add(this.dragPlaceholderClass);
    }

    return preview;
  }

  private _beginAnimating(): void {
    this._animationInterval = setInterval(() => {
      this._ngZone.runOutsideAngular(() => {
        const pointerPosition: Point = this._pointerPositionOnPage;
        const pickupPosition: Point = this._pickupPositionInElement;

        requestAnimationFrame(() =>
          this.animateDrag(
            this,
            pointerPosition,
            pickupPosition,
            this._animationInterval
          )
        );
      });
    }, FRAME_RATE);
  }

  private _onEnterCopy(): void {
    const element = this._rootElement;
    const parent = element.parentNode!;
    const placeholder = this._placeholder;

    toggleVisibility(this._rootElement, false);

    this._document.body.appendChild(parent.replaceChild(placeholder, element));
  }

  private _onExitCopy(): void {
    toggleVisibility(this._rootElement, true);
    this._anchor.parentNode!.insertBefore(this._rootElement, this._anchor);
  }

  private _setSubscriptions(): void {
    this.moved.subscribe(({ event }) => {
      this._pointerPositionOnPage = this._getPointerPositionOnPage(event);
    });

    this.started.subscribe((_) => {
      if (this.animateDrag) this._beginAnimating();
    });

    this.entered.subscribe(({ container }) => {
      const useCopy = this._initialContainer.useCopy;

      if (useCopy && container === this._initialContainer) {
        this._onEnterCopy();
      }
    });

    this.exited.subscribe(({ container }) => {
      const useCopy = this._initialContainer.useCopy;

      if (useCopy) {
        this._onExitCopy();
      }
    });
  }
}
