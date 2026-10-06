import { computed, inject, type Signal } from '@angular/core';
import { BrnFieldControl } from '@spartan-ng/brain/field';

/**
 * Whether a form control should currently *show* as invalid: it is invalid and the
 * user has interacted with it (touched or submitted), or `forceInvalid` is set.
 * Used for both the error styling and `aria-invalid`, so screen readers are not told
 * a field is invalid before the user has had a chance to fill it in.
 */
export function injectShownInvalid(forceInvalid: Signal<boolean>): Signal<boolean> {
  const fieldControl = inject(BrnFieldControl, { optional: true });
  return computed(() => forceInvalid() || !!fieldControl?.spartanInvalid());
}
