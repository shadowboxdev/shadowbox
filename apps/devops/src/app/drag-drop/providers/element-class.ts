import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ElementClass {
  private SELECTED_DEFAULT_CLASS: string = 'tsv-grid-selected';
  private PLACEHOLDER_DEFAULT_CLASS: string = 'tsv-grid-placeholder';
  private DROPPED_DEFAULT_CLASS: string = 'tsv-grid-dropped';

  public addPlaceHolderClass(element: Element): void {
    element.classList.add(this.PLACEHOLDER_DEFAULT_CLASS);
  }

  public removePlaceHolderClass(element: Element): void {
    element.classList.remove(this.PLACEHOLDER_DEFAULT_CLASS);
  }

  public addDroppedClass(element: Element): void {
    element.classList.add(this.DROPPED_DEFAULT_CLASS);
  }

  public removeDroppedClass(element: Element): void {
    element.classList.remove(this.DROPPED_DEFAULT_CLASS);
  }

  public addSelectedClass(element: Element): void {
    element.classList.add(this.SELECTED_DEFAULT_CLASS);
  }

  public removeSelectedClass(element: Element): void {
    element.classList.remove(this.SELECTED_DEFAULT_CLASS);
  }
}
