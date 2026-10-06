import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  linkedSignal,
  model,
  viewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';
import { BrnSwitch, BrnSwitchThumb } from '@spartan-ng/brain/switch';
import { cn, type ClassValue } from '@tassili/ui/core';
import { cva } from 'class-variance-authority';

export const switchVariants = cva(
  [
    'group relative inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent',
    'bg-input transition-colors duration-base ease-out',
    'data-[state=checked]:bg-primary',
    "after:absolute after:-inset-1 after:content-['']",
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      size: {
        sm: 'h-4 w-7',
        md: 'h-5 w-9',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

export const switchThumbVariants = cva(
  [
    'pointer-events-none block rounded-full bg-background shadow-sm',
    'transition-transform duration-base ease-out',
  ],
  {
    variants: {
      size: {
        // The thumb slides on the x axis; the rtl: variant mirrors it.
        sm: 'size-3 group-data-[state=checked]:translate-x-3 rtl:group-data-[state=checked]:-translate-x-3', // tsl-allow-style: mirrored with rtl:
        md: 'size-4 group-data-[state=checked]:translate-x-4 rtl:group-data-[state=checked]:-translate-x-4', // tsl-allow-style: mirrored with rtl:
      },
    },
    defaultVariants: { size: 'md' },
  },
);

export type TslSwitchSize = 'sm' | 'md';

/**
 * An on/off switch for settings that take effect immediately.
 *
 * ```html
 * <tsl-switch inputId="emails" [formControl]="emails" />
 * <label tslLabel for="emails">Email notifications</label>
 * ```
 *
 * Use a checkbox instead when the choice only applies after a form is submitted.
 */
@Component({
  selector: 'tsl-switch',
  imports: [BrnSwitch, BrnSwitchThumb],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TslSwitch), multi: true },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'contents',
    'data-slot': 'switch',
    '[attr.id]': 'null',
    '[attr.aria-label]': 'null',
    '[attr.aria-labelledby]': 'null',
    '[attr.aria-describedby]': 'null',
  },
  template: `
    <brn-switch
      [id]="inputId()"
      [name]="name()"
      [class]="computedClass()"
      [checked]="checked()"
      [disabled]="disabledState()"
      [required]="required()"
      [aria-label]="ariaLabel()"
      [aria-labelledby]="ariaLabelledby()"
      [aria-describedby]="ariaDescribedby()"
      [forceInvalid]="forceInvalid()"
      (checkedChange)="handleChange($event)"
      (touched)="onTouched?.()"
    >
      <brn-switch-thumb [class]="thumbClass()" />
    </brn-switch>
  `,
})
export class TslSwitch implements ControlValueAccessor {
  /** Id of the focusable control, for `<label for>`. */
  readonly inputId = input<string | null>(null);
  readonly name = input<string | null>(null);
  readonly size = input<TslSwitchSize>('md');
  readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });
  readonly ariaLabelledby = input<string | null>(null, { alias: 'aria-labelledby' });
  readonly ariaDescribedby = input<string | null>(null, { alias: 'aria-describedby' });
  readonly required = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly forceInvalid = input(false, { transform: booleanAttribute });
  /** Checked state; supports `[(checked)]`. */
  readonly checked = model(false);
  /** Extra classes for the track, merged so they can override the defaults. */
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly disabledState = linkedSignal(this.disabled);

  private readonly brn = viewChild.required(BrnSwitch);
  private readonly shownInvalid = computed(
    () => this.forceInvalid() || !!this.brn().controlState?.()?.spartanInvalid,
  );
  protected readonly computedClass = computed(() =>
    cn(
      switchVariants({ size: this.size() }),
      this.shownInvalid() && 'ring-2 ring-destructive',
      this.userClass(),
    ),
  );
  protected readonly thumbClass = computed(() => switchThumbVariants({ size: this.size() }));

  protected onChange?: (value: boolean) => void;
  protected onTouched?: () => void;

  protected handleChange(value: boolean): void {
    if (this.disabledState()) return;
    this.checked.set(value);
    this.onChange?.(value);
  }

  writeValue(value: boolean | null): void {
    this.checked.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledState.set(isDisabled);
  }
}
