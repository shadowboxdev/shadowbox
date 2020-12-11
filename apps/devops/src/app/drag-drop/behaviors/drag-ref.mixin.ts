import { Point, DragRef } from '@angular/cdk/drag-drop';
import { NgZone } from '@angular/core';
import { forEach } from 'ramda';

// eslint-disable-next-line @typescript-eslint/no-type-alias
type Constructor<T> = new (...args: any[]) => T;

/** Interface to implement when applying the disabled mixin */
export interface IDragRef<T = any> extends DragRef<T> {}

/** Mixin to augment a component or directive with a `disabled` property. */
export function mixinAnimateDrag<T extends Constructor<{}>>(
  base: T
): Constructor<IDragRef> {
  forEach(
    (name) => (DragRef.prototype[name] = base.prototype[name]),
    Object.getOwnPropertyNames(base.prototype)
  );

  return class extends DragRef<T> {};
}
