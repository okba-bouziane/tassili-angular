import { computed, Directive, input } from '@angular/core';
import { BrnSeparator } from '@spartan-ng/brain/separator';
import { cn, type ClassValue } from '@tassili/ui/core';

/**
 * A thin dividing line.
 *
 * ```html
 * <tsl-separator />
 * <tsl-separator orientation="vertical" class="h-4" />
 * <tsl-separator [decorative]="false" />   announced as a separator
 * ```
 *
 * Decorative by default (hidden from assistive tech); set `decorative` to false when
 * it separates meaningful sections.
 */
@Directive({
  selector: '[tslSeparator],tsl-separator',
  hostDirectives: [{ directive: BrnSeparator, inputs: ['orientation', 'decorative'] }],
  host: { 'data-slot': 'separator', '[class]': 'computedClass()' },
})
export class TslSeparator {
  /** Extra classes, merged so they can override the defaults. */
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly computedClass = computed(() =>
    cn(
      'block shrink-0 bg-border',
      'data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full',
      'data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px data-[orientation=vertical]:self-stretch',
      this.userClass(),
    ),
  );
}
