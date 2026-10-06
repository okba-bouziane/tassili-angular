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
import { LucideCheck, LucideMinus } from '@lucide/angular';
import { BrnCheckbox } from '@spartan-ng/brain/checkbox';
import { cn, type ClassValue } from '@tassili/ui/core';
import { TslIcon } from '@tassili/ui/icon';

export const checkboxBase = [
  'relative inline-flex size-4 shrink-0 cursor-pointer items-center justify-center',
  'rounded-sm border border-input bg-background text-primary-foreground shadow-xs',
  'transition-[background-color,border-color] duration-fast ease-out',
  // Extends the hit area to 24px (WCAG 2.2 target size) without changing the visual size.
  "after:absolute after:-inset-1 after:content-['']",
  'data-[state=checked]:border-primary data-[state=checked]:bg-primary',
  'data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary',
  'disabled:cursor-not-allowed disabled:opacity-50',
];

/**
 * A checkbox with checked, unchecked and indeterminate states.
 *
 * ```html
 * <tsl-checkbox inputId="terms" [formControl]="terms" />
 * <label tslLabel for="terms">Accept the terms</label>
 * ```
 *
 * Works with reactive, template-driven and signal forms, or standalone with `[(checked)]`.
 */
@Component({
  selector: 'tsl-checkbox',
  imports: [BrnCheckbox, TslIcon],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TslCheckbox), multi: true },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'contents',
    'data-slot': 'checkbox',
    '[attr.id]': 'null',
    '[attr.aria-label]': 'null',
    '[attr.aria-labelledby]': 'null',
    '[attr.aria-describedby]': 'null',
  },
  template: `
    <brn-checkbox
      [id]="inputId()"
      [name]="name()"
      [class]="computedClass()"
      [checked]="checked()"
      [(indeterminate)]="indeterminate"
      [disabled]="disabledState()"
      [required]="required()"
      [aria-label]="ariaLabel()"
      [aria-labelledby]="ariaLabelledby()"
      [aria-describedby]="ariaDescribedby()"
      [forceInvalid]="forceInvalid()"
      (checkedChange)="handleChange($event)"
      (touched)="onTouched?.()"
    >
      @if (indeterminate()) {
        <tsl-icon [icon]="minusIcon" size="xs" [strokeWidth]="3" />
      } @else if (checked()) {
        <tsl-icon [icon]="checkIcon" size="xs" [strokeWidth]="3" />
      }
    </brn-checkbox>
  `,
})
export class TslCheckbox implements ControlValueAccessor {
  protected readonly checkIcon = LucideCheck;
  protected readonly minusIcon = LucideMinus;

  /** Id of the focusable control, for `<label for>`. */
  readonly inputId = input<string | null>(null);
  readonly name = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });
  readonly ariaLabelledby = input<string | null>(null, { alias: 'aria-labelledby' });
  readonly ariaDescribedby = input<string | null>(null, { alias: 'aria-describedby' });
  readonly required = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly forceInvalid = input(false, { transform: booleanAttribute });
  /** Mixed state, e.g. a "select all" box when only some rows are selected. */
  readonly indeterminate = model(false);
  /** Checked state; supports `[(checked)]`. */
  readonly checked = model(false);
  /** Extra classes for the box, merged so they can override the defaults. */
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly disabledState = linkedSignal(this.disabled);

  private readonly brn = viewChild.required(BrnCheckbox);
  private readonly shownInvalid = computed(
    () => this.forceInvalid() || !!this.brn().spartanInvalid(),
  );
  protected readonly computedClass = computed(() =>
    cn(checkboxBase, this.shownInvalid() && 'border-destructive', this.userClass()),
  );

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
