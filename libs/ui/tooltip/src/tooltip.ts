import { Directive } from '@angular/core';
import {
  BrnTooltip,
  provideBrnTooltipDefaultOptions,
  type BrnTooltipPosition,
} from '@spartan-ng/brain/tooltip';
import { cn } from '@tassili/ui/core';

export type TslTooltipPosition = BrnTooltipPosition;

export const tooltipContentClass = cn(
  'z-tooltip w-fit max-w-64 rounded-md bg-foreground px-2.5 py-1.5 text-xs text-balance text-background shadow-md',
  'duration-fast data-open:animate-in data-closed:animate-out data-open:fade-in-0 data-closed:fade-out-0',
  'data-[state=instant-open]:animate-none',
);

/**
 * A short text label that appears on hover and keyboard focus, after a short delay.
 *
 * ```html
 * <button tslButton size="icon" aria-label="Archive" tslTooltip="Archive">…</button>
 * <button tslButton tslTooltip="Saves a copy to your drive" position="bottom">Export</button>
 * ```
 *
 * The trigger must be focusable. Tooltips supplement a label, they don't replace one:
 * icon-only buttons still need `aria-label`. Escape dismisses the tooltip.
 */
@Directive({
  selector: '[tslTooltip]',
  exportAs: 'tslTooltip',
  providers: [
    provideBrnTooltipDefaultOptions({
      showDelay: 400,
      hideDelay: 100,
      svgClasses: 'hidden',
      arrowClasses: () => 'hidden',
      tooltipContentClasses: tooltipContentClass,
    }),
  ],
  hostDirectives: [
    {
      directive: BrnTooltip,
      inputs: ['brnTooltip: tslTooltip', 'position', 'hideDelay', 'showDelay', 'tooltipDisabled'],
      outputs: ['show', 'hide'],
    },
  ],
})
export class TslTooltip {}
