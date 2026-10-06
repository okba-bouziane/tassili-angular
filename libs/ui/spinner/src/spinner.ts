import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { cn, type ClassValue } from '@tassili/ui/core';
import { cva, type VariantProps } from 'class-variance-authority';

export const spinnerVariants = cva('inline-block shrink-0 animate-spin text-current', {
  variants: {
    size: {
      sm: 'size-3.5',
      md: 'size-4',
      lg: 'size-6',
      xl: 'size-8',
    },
  },
  defaultVariants: { size: 'md' },
});

export type TslSpinnerSize = NonNullable<VariantProps<typeof spinnerVariants>['size']>;

/**
 * An indeterminate loading indicator.
 *
 * ```html
 * <tsl-spinner />                                   announces "Loading"
 * <tsl-spinner label="Saving changes" />
 * <button tslButton disabled><tsl-spinner decorative />Saving…</button>
 * ```
 *
 * Under reduced motion the arc stops rotating but stays visible.
 */
@Component({
  selector: 'tsl-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'spinner',
    class: 'inline-flex',
    '[attr.role]': 'decorative() ? null : "status"',
    '[attr.aria-label]': 'decorative() ? null : label()',
    '[attr.aria-hidden]': 'decorative() ? "true" : null',
  },
  template: `
    <svg [class]="computedClass()" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.5" class="opacity-20" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
      />
    </svg>
  `,
})
export class TslSpinner {
  readonly size = input<TslSpinnerSize>('md');
  /** Text announced to assistive tech. */
  readonly label = input('Loading');
  /** Hide from assistive tech when nearby text already says what is happening. */
  readonly decorative = input(false, { transform: booleanAttribute });
  /** Extra classes, merged so they can override the defaults. */
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly computedClass = computed(() =>
    cn(spinnerVariants({ size: this.size() }), this.userClass()),
  );
}
