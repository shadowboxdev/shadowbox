import { NgModule, Type } from '@angular/core';

import { DragDropModule } from './cdk';
import { CdkScrollableModule } from '@angular/cdk/scrolling';

import { TsvGrid } from './directives/grid';
import { TsvGridItem } from './directives/grid-item';
import { TsvDropList } from './directives/drop-list';
import { TsvDrag } from './directives/drag';
import { TsvDragHandle } from './directives/drag-handle';
import { TsvDragPlaceholder } from './directives/drag-placeholder';
import { TsvDragPreview } from './directives/drag-preview';
import { TsvDropListGroup } from './directives/drop-list-group';

const MAT_IMPORTS: Type<unknown>[] = [DragDropModule, CdkScrollableModule];

const DRAG_DROP: Type<any>[] = [
  TsvDrag,
  TsvDragHandle,
  TsvDragPlaceholder,
  TsvDragPreview,
  TsvDropList,
  TsvGrid,
  TsvGridItem,
  TsvDropListGroup,
];

@NgModule({
  declarations: [...DRAG_DROP],
  imports: [...MAT_IMPORTS],
  exports: [...DRAG_DROP, CdkScrollableModule],
  providers: [],
})
export class TsvDragDropModule {}
