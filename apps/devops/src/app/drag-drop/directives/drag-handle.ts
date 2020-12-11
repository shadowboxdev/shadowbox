import {
  Directive,
  ElementRef,
  Inject,
  InjectionToken,
  Input,
  OnDestroy,
  Optional,
  SkipSelf,
} from '@angular/core';
import { CdkDragHandle } from '../cdk';
import { TSV_DRAG_PARENT } from '../drag-parent';
import { Subject } from 'rxjs';

/**
 * Injection token that can be used to reference instances of `CdkDragHandle`. It serves as
 * alternative token to the actual `CdkDragHandle` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const TSV_DRAG_HANDLE = new InjectionToken<TsvDragHandle>(
  'TsvDragHandle'
);

@Directive({
  selector: '[tsvDragHandle]',
  host: {
    class: 'tsv-drag-handle',
  },
  providers: [{ provide: TSV_DRAG_HANDLE, useExisting: TsvDragHandle }],
})
export class TsvDragHandle extends CdkDragHandle implements OnDestroy {
  public _stateChanges = new Subject<TsvDragHandle>();
  /** Whether starting to drag through this handle is disabled. */
  @Input('tsvDragHandleDisabled')
  public get disabled(): boolean {
    return super.disabled;
  }
  public set disabled(value: boolean) {
    super.disabled = value;
  }

  constructor(
    element: ElementRef<HTMLElement>,
    @Inject(TSV_DRAG_PARENT) @Optional() @SkipSelf() parentDrag?: any
  ) {
    super(element, parentDrag);
  }
}
