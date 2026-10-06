import { computed, Directive, input } from '@angular/core';
import { BrnLabel } from '@spartan-ng/brain/label';
import { cn, type ClassValue } from '@tassili/ui/core';

export const labelBase = [
  'inline-flex items-center gap-1.5 text-sm leading-none font-medium text-foreground select-none',
  'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
  'group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50',
];

/**
 * Styles a native `<label>`. Inside a Tassili form field it links to the control
 * automatically; otherwise set `for` to the control's id.
 *
 * ```html
 * <label tslLabel for="email">Email</label>
 * <input tslInput id="email" type="email" />
 * ```
 */
@Directive({
  selector: 'label[tslLabel]',
  exportAs: 'tslLabel',
  hostDirectives: [{ directive: BrnLabel, inputs: ['id', 'for'] }],
  host: {
    'data-slot': 'label',
    '[class]': 'computedClass()',
  },
})
export class TslLabel {
  /** Extra classes, merged so they can override the defaults. */
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly computedClass = computed(() => cn(labelBase, this.userClass()));
}
