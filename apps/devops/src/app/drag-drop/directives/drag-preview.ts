import { CdkDragPreview } from '../cdk';
import { Directive, HostBinding, InjectionToken } from '@angular/core';

/**
 * Injection token that can be used to reference instances of `CdkDragPreview`. It serves as
 * alternative token to the actual `CdkDragPreview` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const TSV_DRAG_PREVIEW = new InjectionToken<CdkDragPreview>(
  'TsvDragPreview'
);

@Directive({
  selector: 'ng-template[tsvDragPreview]',
  providers: [{ provide: TSV_DRAG_PREVIEW, useExisting: TsvDragPreview }],
})
export class TsvDragPreview<T = any> extends CdkDragPreview<T> {
  @HostBinding('class.tsv-drag-preview')
  public cssClass: boolean = true;
}
