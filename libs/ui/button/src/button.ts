import { computed, Directive, HOST_TAG_NAME, inject, input } from '@angular/core';
import { BrnButton } from '@spartan-ng/brain/button';
import { cn, type ClassValue } from '@tassili/ui/core';
import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  [
    'relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap select-none',
    'rounded-md text-sm font-medium',
    'transition-[color,background-color,border-color,box-shadow,transform] duration-fast ease-out',
    'focus-ring active:translate-y-px',
    'disabled:pointer-events-none disabled:opacity-50',
    'data-disabled:pointer-events-none data-disabled:opacity-50',
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground shadow-xs hover:bg-primary-hover inset-ring inset-ring-primary-foreground/10',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-hover',
        outline:
          'border border-input bg-background text-foreground shadow-xs hover:bg-accent hover:text-accent-foreground',
        ghost: 'text-foreground hover:bg-accent hover:text-accent-foreground',
        destructive:
          'bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive-hover',
        link: 'text-primary underline-offset-4 hover:underline active:translate-y-0',
      },
      size: {
        sm: 'h-control-sm gap-1.5 px-3',
        md: 'h-control-md px-4',
        lg: 'h-control-lg px-5 text-base',
        'icon-sm': 'size-control-sm',
        icon: 'size-control-md',
        'icon-lg': 'size-control-lg',
      },
    },
    compoundVariants: [{ variant: 'link', class: 'h-auto px-0' }],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
export type TslButtonVariant = NonNullable<ButtonVariants['variant']>;
export type TslButtonSize = NonNullable<ButtonVariants['size']>;

/**
 * Styles a native `<button>` or `<a>` as a Tassili button.
 *
 * ```html
 * <button tslButton>Save changes</button>
 * <button tslButton variant="outline" size="sm">Cancel</button>
 * <a tslButton variant="link" href="/docs">Read the docs</a>
 * <button tslButton size="icon" aria-label="Close"><tsl-icon name="x" /></button>
 * ```
 *
 * `disabled` works on both elements: buttons get the native attribute, links get
 * `aria-disabled`, leave the tab order and ignore clicks.
 */
@Directive({
  selector: 'button[tslButton], a[tslButton]',
  exportAs: 'tslButton',
  hostDirectives: [{ directive: BrnButton, inputs: ['disabled'] }],
  host: {
    'data-slot': 'button',
    '[class]': 'computedClass()',
    '[attr.aria-disabled]': 'isAnchor && brn.disabled() ? "true" : null',
    '[attr.type]': 'isAnchor ? null : (type() ?? "button")',
  },
})
export class TslButton {
  protected readonly brn = inject(BrnButton);
  protected readonly isAnchor = inject(HOST_TAG_NAME) === 'a';

  /** Visual style. Use one `primary` button per view. */
  readonly variant = input<TslButtonVariant>('primary');
  /** Control height and padding; `icon*` sizes are square for icon-only buttons. */
  readonly size = input<TslButtonSize>('md');
  /** Native button type. Defaults to `button` so buttons never submit forms by accident. */
  readonly type = input<'button' | 'submit' | 'reset' | undefined>(undefined);
  /** Extra classes, merged so they can override the defaults. */
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly computedClass = computed(() =>
    cn(buttonVariants({ variant: this.variant(), size: this.size() }), this.userClass()),
  );
}
