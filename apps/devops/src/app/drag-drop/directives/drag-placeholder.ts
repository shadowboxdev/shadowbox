import { CdkDragPlaceholder } from '../cdk';
import { Directive, HostBinding, InjectionToken } from '@angular/core';

/**
 * Injection token that can be used to reference instances of `CdkDragPlaceholder`. It serves as
 * alternative token to the actual `CdkDragPlaceholder` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const TSV_DRAG_PLACEHOLDER = new InjectionToken<TsvDragPlaceholder>(
  'TsvDragPlaceholder'
);

/**
 * Element that will be used as a template for the placeholder of a CdkDrag when
 * it is being dragged. The placeholder is displayed in place of the element being dragged.
 */
@Directive({
  selector: 'ng-template[tsvDragPlaceholder]',
  providers: [
    { provide: TSV_DRAG_PLACEHOLDER, useExisting: TsvDragPlaceholder },
  ],
})
export class TsvDragPlaceholder<T = any> extends CdkDragPlaceholder<T> {
  @HostBinding('class.tsv-drag-placeholder')
  public cssClass: boolean = true;
}
