import { DragDropRegistry as CdkDragDropRegistry } from '../cdk';
import { Injectable, OnDestroy } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DragDropRegistry<I, C>
  extends CdkDragDropRegistry<I, C>
  implements OnDestroy {}
