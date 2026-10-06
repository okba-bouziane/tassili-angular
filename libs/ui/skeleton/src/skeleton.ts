import { computed, Directive, input } from '@angular/core';
import { cn, type ClassValue } from '@tassili/ui/core';

/**
 * A placeholder shape shown while content loads. Size it with utilities.
 *
 * ```html
 * <div aria-busy="true" aria-label="Loading profile">
 *   <tsl-skeleton class="size-10 rounded-full" />
 *   <tsl-skeleton class="h-4 w-40" />
 * </div>
 * ```
 *
 * Skeletons are hidden from assistive tech: mark the loading region with
 * `aria-busy` and a label instead. The pulse stops under reduced motion.
 */
@Directive({
  selector: '[tslSkeleton],tsl-skeleton',
  host: { 'data-slot': 'skeleton', 'aria-hidden': 'true', '[class]': 'computedClass()' },
})
export class TslSkeleton {
  /** Extra classes, merged so they can override the defaults. */
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('block animate-pulse rounded-md bg-muted', this.userClass()),
  );
}
