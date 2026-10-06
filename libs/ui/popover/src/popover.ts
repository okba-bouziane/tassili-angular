import {
  afterRenderEffect,
  computed,
  contentChild,
  Directive,
  ElementRef,
  effect,
  inject,
  input,
  Renderer2,
  signal,
} from '@angular/core';
import { injectExposesStateProvider } from '@spartan-ng/brain/core';
import {
  BrnPopover,
  BrnPopoverContent,
  BrnPopoverTrigger,
  provideBrnPopoverConfig,
} from '@spartan-ng/brain/popover';
import { cn, overlaySurface, type ClassValue } from '@tassili/ui/core';

/**
 * Non-modal floating content anchored to a trigger: extra details, quick settings,
 * small forms. Escape or a click outside closes it and focus returns to the trigger.
 *
 * ```html
 * <tsl-popover>
 *   <button tslButton variant="outline" tslPopoverTrigger>Share</button>
 *   <tsl-popover-content *tslPopoverPortal="let ctx">
 *     <tsl-popover-header>
 *       <h3 tslPopoverTitle>Share this page</h3>
 *       <p tslPopoverDescription>Anyone with the link can view.</p>
 *     </tsl-popover-header>
 *   </tsl-popover-content>
 * </tsl-popover>
 * ```
 */
@Directive({
  selector: '[tslPopover],tsl-popover',
  exportAs: 'tslPopover',
  providers: [provideBrnPopoverConfig({ align: 'center', sideOffset: 6 })],
  hostDirectives: [
    {
      directive: BrnPopover,
      inputs: [
        'align',
        'attachTo',
        'autoFocus',
        'closeOnOutsidePointerEvents',
        'offsetX',
        'sideOffset',
        'state',
      ],
      outputs: ['stateChanged', 'closed'],
    },
  ],
  host: { 'data-slot': 'popover' },
})
export class TslPopover {}

/** Opens the surrounding popover. Use on a `<button>`. */
@Directive({
  selector: 'button[tslPopoverTrigger],button[tslPopoverTriggerFor]',
  hostDirectives: [
    {
      directive: BrnPopoverTrigger,
      inputs: ['id', 'brnPopoverTriggerFor: tslPopoverTriggerFor', 'type'],
    },
  ],
  host: { 'data-slot': 'popover-trigger' },
})
export class TslPopoverTrigger {}

/** Renders the popover content in an overlay. Use as `*tslPopoverPortal`. */
@Directive({
  selector: '[tslPopoverPortal]',
  hostDirectives: [{ directive: BrnPopoverContent, inputs: ['context', 'class'] }],
})
export class TslPopoverPortal {}

/** Heading of a popover; names the popover for assistive tech. */
@Directive({
  selector: '[tslPopoverTitle]',
  host: {
    'data-slot': 'popover-title',
    class: 'font-medium leading-tight text-foreground',
    '[id]': 'id()',
  },
})
export class TslPopoverTitle {
  private static nextId = 0;
  readonly id = input(`tsl-popover-title-${TslPopoverTitle.nextId++}`);
}

/** The floating panel. */
@Directive({
  selector: '[tslPopoverContent],tsl-popover-content',
  host: {
    'data-slot': 'popover-content',
    '[class]': 'computedClass()',
    '[attr.aria-label]': 'null',
  },
})
export class TslPopoverContent {
  private readonly stateProvider = injectExposesStateProvider({ host: true });
  private readonly renderer = inject(Renderer2);
  private readonly element = inject(ElementRef);
  readonly state = this.stateProvider.state ?? signal('closed');
  /** Extra classes, merged so they can override the defaults (e.g. `w-96`). */
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  /** Accessible name when the popover has no `tslPopoverTitle`. */
  readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });
  private readonly title = contentChild(TslPopoverTitle, { descendants: true });

  protected readonly computedClass = computed(() =>
    cn(
      overlaySurface,
      'relative flex w-72 flex-col gap-3 p-4 text-sm outline-none',
      this.userClass(),
    ),
  );

  constructor() {
    effect(() => {
      const state = this.state();
      this.renderer.setAttribute(this.element.nativeElement, 'data-state', state);
      this.renderer.setAttribute(
        this.element.nativeElement,
        state === 'open' ? 'data-open' : 'data-closed',
        '',
      );
      this.renderer.removeAttribute(
        this.element.nativeElement,
        state === 'open' ? 'data-closed' : 'data-open',
      );
    });

    // The overlay renders the popover as role="dialog"; name it after the title.
    afterRenderEffect(() => {
      const host = this.element.nativeElement as HTMLElement;
      const dialog = host.closest('[role=dialog]') ?? host;
      const titleId = this.title()?.id();
      const label = this.ariaLabel();
      if (titleId) {
        this.renderer.setAttribute(dialog, 'aria-labelledby', titleId);
      } else if (label) {
        this.renderer.setAttribute(dialog, 'aria-label', label);
      }
    });
  }
}

/** Title and description block at the top of a popover. */
@Directive({
  selector: '[tslPopoverHeader],tsl-popover-header',
  host: { 'data-slot': 'popover-header', class: 'flex flex-col gap-1' },
})
export class TslPopoverHeader {}

@Directive({
  selector: '[tslPopoverDescription]',
  host: { 'data-slot': 'popover-description', class: 'text-sm text-muted-foreground' },
})
export class TslPopoverDescription {}

export const TslPopoverImports = [
  TslPopover,
  TslPopoverTrigger,
  TslPopoverPortal,
  TslPopoverContent,
  TslPopoverHeader,
  TslPopoverTitle,
  TslPopoverDescription,
] as const;
