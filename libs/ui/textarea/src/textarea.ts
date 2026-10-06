import { booleanAttribute, computed, Directive, inject, input } from '@angular/core';
import { BrnTextarea } from '@spartan-ng/brain/textarea';
import { cn, injectShownInvalid, type ClassValue } from '@tassili/ui/core';
import { fieldControlBase } from '@tassili/ui/input';
import { cva } from 'class-variance-authority';

export const textareaVariants = cva([...fieldControlBase, 'flex min-h-20 px-3 py-2 text-sm'], {
  variants: {
    autoResize: {
      true: 'field-sizing-content resize-none',
      false: 'resize-y',
    },
  },
  defaultVariants: { autoResize: false },
});

/**
 * Styles a native `<textarea>` and connects it to Tassili form fields.
 *
 * ```html
 * <textarea tslTextarea rows="4" [formControl]="bio"></textarea>
 * <textarea tslTextarea autoResize></textarea>
 * ```
 *
 * `autoResize` grows the textarea with its content where the browser supports
 * `field-sizing: content`; elsewhere it keeps its `rows` height.
 */
@Directive({
  selector: 'textarea[tslTextarea]',
  exportAs: 'tslTextarea',
  hostDirectives: [{ directive: BrnTextarea, inputs: ['id', 'forceInvalid'] }],
  host: {
    'data-slot': 'textarea',
    '[class]': 'computedClass()',
    '[attr.aria-invalid]': 'shownInvalid() ? "true" : null',
    '[attr.data-shown-invalid]': 'shownInvalid() ? "true" : null',
  },
})
export class TslTextarea {
  private readonly brn = inject(BrnTextarea);

  /** Grow with the content instead of showing a resize handle. */
  readonly autoResize = input(false, { transform: booleanAttribute });
  /** Extra classes, merged so they can override the defaults. */
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly shownInvalid = injectShownInvalid(this.brn.forceInvalid);
  protected readonly computedClass = computed(() =>
    cn(textareaVariants({ autoResize: this.autoResize() }), this.userClass()),
  );
}
