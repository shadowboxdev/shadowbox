import { toggleNativeDragInteractions } from './cdk/drag-styling';
import { DragRef } from './drag-ref';

export class GridItemRef<T = any> extends DragRef<T> {
  public get anchor() {
    return this._anchor;
  }

  public get initialContainer() {
    return this._initialContainer || this._dropContainer;
  }
}
