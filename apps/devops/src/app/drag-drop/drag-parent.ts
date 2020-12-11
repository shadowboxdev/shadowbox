import { InjectionToken } from '@angular/core';

/**
 * Injection token that can be used for a `CdkDrag` to provide itself as a parent to the
 * drag-specific child directive (`CdkDragHandle`, `CdkDragPreview` etc.). Used primarily
 * to avoid circular imports.
 * @docs-private
 */
export const TSV_DRAG_PARENT = new InjectionToken<{}>('TSV_DRAG_PARENT');
