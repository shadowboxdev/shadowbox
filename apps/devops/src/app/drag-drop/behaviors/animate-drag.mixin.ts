import { Point } from '../cdk';
import { NgZone } from '@angular/core';

import { DragRef } from '../drag-ref';


// eslint-disable-next-line @typescript-eslint/no-type-alias
type Constructor<T> = new (...args: any[]) => T;

/** Interface to implement when applying the disabled mixin */
export interface IDragAnimate {
  _ngZone: NgZone;
  dragAnimate(
    ref: DragRef,
    { x, y }: Point,
    pickupPositionInElement: Point,
    _animationInterval: any
  ): void;
}

/** Mixin to augment a component or directive with a `disabled` property. */
export function mixinAnimateDrag<T extends Constructor<{}>>(
  base: T
): Constructor<IDragAnimate> & T {
  return class extends base {
    public _ngZone: NgZone;

    constructor(...args: any[]) {
      super(...args);
    }

    /**
     * Handle animating the dragging item.
     * this needs to use arrow notation to keep
     * the fn's scope to TreeviewComponent's
     * lexical environment. This is due to required
     * class properties defined in the AnimateDrag
     * interface.
     */
    public dragAnimate = (
      ref: DragRef,
      { x, y }: Point,
      pickupPositionInElement: Point,
      _animationInterval: any
    ): void => {
      if (!ref.isDragging()) {
        clearInterval(_animationInterval);

        return;
      }

      // curved like the uncial sigma, i.e. a sigmoid curve
      const sigmoid = (xPos: number) => {
        return xPos / (1 + Math.abs(xPos));
      };

      // Velocity: speed with a sign where the sign tells us the direction of motion
      // (final position — initial position)/(final time — initial time)
      ref.xVelocity = x - ref.cardPosition.x;
      ref.cardPosition = { x, y };
      ref.rotation = ref.rotation * 0.9 + sigmoid(ref.xVelocity) * 1.5;

      if (Math.abs(ref.rotation) < 0.01) {
        ref.rotation = 0;
      }

      this._ngZone.runOutsideAngular(() => {


        const transform = getTransformWithRotation(
          ref.cardPosition.x - pickupPositionInElement.x,
          ref.cardPosition.y - pickupPositionInElement.y,
          ref.rotation
        );

        ref.getPreviewElement().style.transform = transform;
      });
    };
  };
}

function getTransformWithRotation(
  x: number,
  y: number,
  rotation: number
): string {
  // Round the transforms since some browsers will
  // blur the elements for sub-pixel transforms.
  return `translate3d(${Math.round(x)}px, ${Math.round(
    y
  )}px, 0) rotate(${Math.round(rotation)}deg)`;
}
