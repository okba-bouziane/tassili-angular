import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { LucideDynamicIcon, type LucideIconInput } from '@lucide/angular';
import { cn, type ClassValue } from '@tassili/ui/core';
import { cva, type VariantProps } from 'class-variance-authority';

export const iconVariants = cva(
  'inline-flex shrink-0 items-center justify-center [&>svg]:size-full',
  {
    variants: {
      size: {
        xs: 'size-3',
        sm: 'size-3.5',
        md: 'size-4',
        lg: 'size-5',
        xl: 'size-6',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

export type TslIconSize = NonNullable<VariantProps<typeof iconVariants>['size']>;

/**
 * A Lucide icon sized by the Tassili scale.
 *
 * ```ts
 * import { LucideSearch } from '@lucide/angular';
 * ```
 * ```html
 * <tsl-icon [icon]="LucideSearch" />                       decorative (hidden from assistive tech)
 * <tsl-icon [icon]="LucideCircleAlert" label="Error" />   meaningful on its own
 * <tsl-icon [icon]="LucideChevronRight" mirrorInRtl />    flips in right-to-left layouts
 * ```
 *
 * Pass the icon component (tree-shakable) or a name registered with `provideLucideIcons`.
 * Color follows `currentColor`, so set it with text utilities on the icon or its parent.
 */
@Component({
  selector: 'tsl-icon',
  imports: [LucideDynamicIcon],
  template: `
    <svg
      [lucideIcon]="icon()"
      [strokeWidth]="strokeWidth()"
      [title]="label()"
      [attr.role]="label() ? 'img' : null"
      [attr.aria-label]="label() || null"
    ></svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'icon',
    '[class]': 'computedClass()',
    '[attr.aria-hidden]': 'label() ? null : "true"',
  },
})
export class TslIcon {
  /** Lucide icon component, icon data, or a registered icon name. */
  readonly icon = input.required<LucideIconInput>();
  /** Icon size on the Tassili scale: xs 12, sm 14, md 16, lg 20, xl 24 (px). */
  readonly size = input<TslIconSize>('md');
  /** Accessible name. Leave empty for decorative icons next to visible text. */
  readonly label = input<string>('');
  /** Line weight. Tassili uses 1.75 for a lighter, more precise stroke than Lucide's 2. */
  readonly strokeWidth = input<number>(1.75);
  /** Mirror horizontally in RTL, for icons that point in the reading direction. */
  readonly mirrorInRtl = input(false, { transform: booleanAttribute });
  /** Extra classes, merged so they can override the defaults. */
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly computedClass = computed(() =>
    cn(
      iconVariants({ size: this.size() }),
      this.mirrorInRtl() && 'rtl:-scale-x-100',
      this.userClass(),
    ),
  );
}
