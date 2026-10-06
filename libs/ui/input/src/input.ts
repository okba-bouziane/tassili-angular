import { computed, Directive, inject, input } from '@angular/core';
import { BrnInput } from '@spartan-ng/brain/input';
import { cn, injectShownInvalid, type ClassValue } from '@tassili/ui/core';
import { cva, type VariantProps } from 'class-variance-authority';

/** Shared look of text-entry controls (input, textarea, select trigger). */
export const fieldControlBase = [
  'w-full min-w-0 rounded-md border border-input bg-background text-foreground shadow-xs',
  'transition-[border-color,box-shadow] duration-fast ease-out',
  'placeholder:text-muted-foreground',
  'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25 focus-visible:outline-none',
  'disabled:cursor-not-allowed disabled:opacity-50',
  'data-[shown-invalid=true]:border-destructive data-[shown-invalid=true]:focus-visible:ring-destructive/25',
];

export const inputVariants = cva(
  [
    ...fieldControlBase,
    'flex px-3 read-only:bg-muted',
    'file:me-3 file:inline-flex file:h-full file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
  ],
  {
    variants: {
      size: {
        sm: 'h-control-sm text-sm',
        md: 'h-control-md text-sm',
        lg: 'h-control-lg px-4 text-base',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

export type TslInputSize = NonNullable<VariantProps<typeof inputVariants>['size']>;

/**
 * Styles a native `<input>` and connects it to Tassili form fields.
 *
 * ```html
 * <input tslInput type="email" placeholder="name@company.com" [formControl]="email" />
 * ```
 *
 * Works with reactive, template-driven and signal forms. The error style and
 * `aria-invalid` appear once the control is invalid and touched (or the form submitted).
 */
@Directive({
  selector: 'input[tslInput]',
  exportAs: 'tslInput',
  hostDirectives: [{ directive: BrnInput, inputs: ['id', 'forceInvalid'] }],
  host: {
    'data-slot': 'input',
    '[class]': 'computedClass()',
    '[attr.aria-invalid]': 'shownInvalid() ? "true" : null',
    '[attr.data-shown-invalid]': 'shownInvalid() ? "true" : null',
  },
})
export class TslInput {
  private readonly brn = inject(BrnInput);

  /** Control height and text size. */
  readonly size = input<TslInputSize>('md');
  /** Extra classes, merged so they can override the defaults. */
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly shownInvalid = injectShownInvalid(this.brn.forceInvalid);
  protected readonly computedClass = computed(() =>
    cn(inputVariants({ size: this.size() }), this.userClass()),
  );
}
