import { computed, Directive, input } from '@angular/core';
import { cn, type ClassValue } from '@tassili/ui/core';
import { cva, type VariantProps } from 'class-variance-authority';

export const badgeVariants = cva(
  [
    'inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap',
    'rounded-sm border border-transparent font-medium',
    'transition-colors duration-fast ease-out focus-ring',
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3",
  ],
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground [a&]:hover:bg-primary-hover',
        secondary: 'bg-secondary text-secondary-foreground [a&]:hover:bg-secondary-hover',
        outline: 'border-input text-foreground [a&]:hover:bg-accent',
        brand: 'bg-brand text-brand-foreground',
        success: 'bg-success text-success-foreground',
        warning: 'bg-warning text-warning-foreground',
        info: 'bg-info text-info-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
      },
      size: {
        sm: 'h-5 px-1.5 text-xs',
        md: 'h-6 px-2 text-xs',
      },
    },
    defaultVariants: { variant: 'secondary', size: 'md' },
  },
);

export type TslBadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>;
export type TslBadgeSize = NonNullable<VariantProps<typeof badgeVariants>['size']>;

/**
 * A short status or count label.
 *
 * ```html
 * <span tslBadge>Draft</span>
 * <span tslBadge variant="success">Paid</span>
 * <a tslBadge variant="outline" href="/tags/angular">Angular</a>
 * ```
 *
 * Status colors are solid tokens with verified contrast. Don't rely on color alone:
 * the text must say the status.
 */
@Directive({
  selector: '[tslBadge]',
  exportAs: 'tslBadge',
  host: { 'data-slot': 'badge', '[class]': 'computedClass()' },
})
export class TslBadge {
  readonly variant = input<TslBadgeVariant>('secondary');
  readonly size = input<TslBadgeSize>('md');
  /** Extra classes, merged so they can override the defaults. */
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly computedClass = computed(() =>
    cn(badgeVariants({ variant: this.variant(), size: this.size() }), this.userClass()),
  );
}
