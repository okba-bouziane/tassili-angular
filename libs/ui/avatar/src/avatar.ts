import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  input,
} from '@angular/core';
import { BrnAvatar, BrnAvatarFallback, BrnAvatarImage } from '@spartan-ng/brain/avatar';
import { cn, type ClassValue } from '@tassili/ui/core';
import { cva, type VariantProps } from 'class-variance-authority';

export const avatarVariants = cva(
  'relative flex shrink-0 items-center justify-center overflow-hidden bg-secondary font-medium text-secondary-foreground select-none',
  {
    variants: {
      size: {
        xs: 'size-6 text-xs',
        sm: 'size-8 text-xs',
        md: 'size-10 text-sm',
        lg: 'size-12 text-base',
        xl: 'size-16 text-lg',
      },
      shape: {
        circle: 'rounded-full',
        square: 'rounded-md',
      },
    },
    defaultVariants: { size: 'md', shape: 'circle' },
  },
);

export type TslAvatarSize = NonNullable<VariantProps<typeof avatarVariants>['size']>;
export type TslAvatarShape = NonNullable<VariantProps<typeof avatarVariants>['shape']>;

/** First and last initials of a name: "Okba Bouziane" → "OB". */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  const first = parts[0].charAt(0);
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
  return (first + last).toLocaleUpperCase();
}

/**
 * A person's picture, falling back to their initials while loading or on error.
 *
 * ```html
 * <tsl-avatar name="Okba Bouziane" src="/okba.jpg" />
 * <tsl-avatar name="Okba Bouziane" decorative />   next to the visible name
 * ```
 *
 * Exposed to assistive tech as one image named after the person (or hidden when
 * `decorative`), so initials are never read letter by letter.
 */
@Component({
  selector: 'tsl-avatar',
  imports: [BrnAvatar, BrnAvatarImage, BrnAvatarFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'avatar',
    class: 'inline-flex',
    '[attr.role]': 'decorative() ? null : "img"',
    '[attr.aria-label]': 'decorative() ? null : name()',
    '[attr.aria-hidden]': 'decorative() ? "true" : null',
  },
  template: `
    <brn-avatar [class]="computedClass()">
      @if (src()) {
        <img brnAvatarImage alt="" class="size-full object-cover" [src]="src()" />
      }
      <span brnAvatarFallback aria-hidden="true">{{ initials() }}</span>
    </brn-avatar>
  `,
})
export class TslAvatar {
  /** The person's name: used for the accessible name and the initials. */
  readonly name = input.required<string>();
  /** Image URL. Initials show until it loads, or if it fails. */
  readonly src = input<string | null | undefined>(null);
  readonly size = input<TslAvatarSize>('md');
  readonly shape = input<TslAvatarShape>('circle');
  /** Hide from assistive tech when the name is already visible next to the avatar. */
  readonly decorative = input(false, { transform: booleanAttribute });
  /** Extra classes, merged so they can override the defaults. */
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly initials = computed(() => initialsOf(this.name()));
  protected readonly computedClass = computed(() =>
    cn(avatarVariants({ size: this.size(), shape: this.shape() }), this.userClass()),
  );
}

/** Overlapping row of avatars. */
@Directive({
  selector: '[tslAvatarGroup],tsl-avatar-group',
  host: {
    'data-slot': 'avatar-group',
    class:
      'flex items-center -space-x-2 *:data-[slot=avatar]:*:ring-2 *:data-[slot=avatar]:*:ring-background',
  },
})
export class TslAvatarGroup {}
