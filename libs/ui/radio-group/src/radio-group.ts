import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  inject,
  input,
} from '@angular/core';
import { BrnRadio, BrnRadioGroup } from '@spartan-ng/brain/radio-group';
import { cn, type ClassValue } from '@tassili/ui/core';

/**
 * A group of mutually exclusive options. Arrow keys move between options.
 *
 * ```html
 * <div tslRadioGroup aria-label="Plan" [formControl]="plan">
 *   <tsl-radio value="free">Free</tsl-radio>
 *   <tsl-radio value="pro">Pro</tsl-radio>
 * </div>
 * ```
 *
 * Works with reactive, template-driven and signal forms, or standalone with `[(value)]`.
 */
@Directive({
  selector: '[tslRadioGroup]',
  exportAs: 'tslRadioGroup',
  hostDirectives: [
    {
      directive: BrnRadioGroup,
      inputs: ['name', 'value', 'disabled', 'required'],
      outputs: ['valueChange'],
    },
  ],
  host: {
    role: 'radiogroup',
    'data-slot': 'radio-group',
    '[class]': 'computedClass()',
  },
})
export class TslRadioGroup {
  /** Extra classes, merged so they can override the defaults. */
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() => cn('grid gap-3', this.userClass()));
}

/** One option in a `tslRadioGroup`. Its content is the option's label. */
@Component({
  selector: 'tsl-radio',
  imports: [BrnRadio],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'contents',
    'data-slot': 'radio',
    '[attr.aria-label]': 'null',
    '[attr.aria-describedby]': 'null',
  },
  template: `
    <label [class]="computedClass()">
      <brn-radio
        class="group/radio inline-flex"
        [value]="value()"
        [disabled]="disabled()"
        [required]="required()"
        [aria-label]="ariaLabel()"
        [aria-describedby]="ariaDescribedby()"
      >
        <span indicator [class]="indicatorClass()">
          <span
            class="size-1.5 rounded-full bg-primary-foreground opacity-0 transition-opacity duration-fast group-data-[checked=true]/radio:opacity-100"
          ></span>
        </span>
      </brn-radio>
      <span class="min-w-0"><ng-content /></span>
    </label>
  `,
})
export class TslRadio<T = unknown> {
  private readonly group = inject(BrnRadioGroup, { optional: true });

  /** The value selected when this option is chosen. */
  readonly value = input.required<T>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string | undefined>(undefined, { alias: 'aria-label' });
  readonly ariaDescribedby = input<string | undefined>(undefined, { alias: 'aria-describedby' });
  /** Extra classes for the option row, merged so they can override the defaults. */
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private readonly groupInvalid = computed(() => !!this.group?.controlState?.()?.spartanInvalid);
  private readonly isDisabled = computed(() => this.disabled() || !!this.group?.disabledState());

  protected readonly computedClass = computed(() =>
    cn(
      'inline-flex cursor-pointer items-center gap-2.5 text-sm text-foreground select-none',
      this.isDisabled() && 'cursor-not-allowed opacity-50',
      this.userClass(),
    ),
  );

  protected readonly indicatorClass = computed(() =>
    cn(
      'relative flex size-4 shrink-0 items-center justify-center rounded-full border border-input bg-background shadow-xs',
      'transition-[background-color,border-color] duration-fast ease-out',
      "after:absolute after:-inset-1 after:content-['']",
      'group-data-[checked=true]/radio:border-primary group-data-[checked=true]/radio:bg-primary',
      'group-has-[:focus-visible]/radio:outline-2 group-has-[:focus-visible]/radio:outline-offset-2 group-has-[:focus-visible]/radio:outline-ring',
      this.groupInvalid() && 'border-destructive',
    ),
  );
}
