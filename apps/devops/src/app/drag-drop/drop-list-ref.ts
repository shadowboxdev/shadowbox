import { DropListRef as CdkDropListRef } from './cdk';

export class DropListRef<T = any> extends CdkDropListRef<T> {
  public useCopy: boolean = true;
}
