import { CdkDropListGroup } from '../cdk';
import { Directive, InjectionToken, Input, OnDestroy } from '@angular/core';

/**
 * Injection token that can be used to reference instances of `CdkDropListGroup`. It serves as
 * alternative token to the actual `CdkDropListGroup` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const TSV_DROP_LIST_GROUP = new InjectionToken<
  TsvDropListGroup<unknown>
>('TsvDropListGroup');

@Directive({
  selector: '[tsvDropListGroup]',
  exportAs: 'tsvDropListGroup',
  providers: [{ provide: TSV_DROP_LIST_GROUP, useExisting: TsvDropListGroup }],
})
export class TsvDropListGroup<T>
  extends CdkDropListGroup<T>
  implements OnDestroy {
  /** Whether starting a dragging sequence from inside this group is disabled. */
  @Input('tsvDropListGroupDisabled')
  public get disabled(): boolean {
    return super.disabled;
  }
  public set disabled(value: boolean) {
    super.disabled = value;
  }
}
