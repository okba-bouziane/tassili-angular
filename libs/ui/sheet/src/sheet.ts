import { DOCUMENT } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  ElementRef,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { LucideX } from '@lucide/angular';
import { injectExposedSideProvider, injectExposesStateProvider } from '@spartan-ng/brain/core';
import { BrnDialog, provideBrnDialogDefaultOptions } from '@spartan-ng/brain/dialog';
import {
  BrnSheet,
  BrnSheetClose,
  BrnSheetContent,
  BrnSheetDescription,
  BrnSheetTitle,
  BrnSheetTrigger,
} from '@spartan-ng/brain/sheet';
import { TslButton } from '@tassili/ui/button';
import { cn, type ClassValue } from '@tassili/ui/core';
import { dialogOverlayClass } from '@tassili/ui/dialog';
import { TslIcon } from '@tassili/ui/icon';

/** Where the sheet slides in from. `start`/`end` follow the reading direction. */
export type TslSheetPosition = 'top' | 'bottom' | 'start' | 'end';

/**
 * A panel that slides in from an edge of the screen. Modal like a dialog; use
 * `position="bottom"` for a mobile drawer.
 *
 * ```html
 * <tsl-sheet position="end">
 *   <button tslButton tslSheetTrigger>Filters</button>
 *   <tsl-sheet-content *tslSheetPortal="let ctx">
 *     <tsl-sheet-header>
 *       <h2 tslSheetTitle>Filters</h2>
 *       <p tslSheetDescription>Narrow down the project list.</p>
 *     </tsl-sheet-header>
 *     …
 *   </tsl-sheet-content>
 * </tsl-sheet>
 * ```
 */
@Component({
  selector: 'tsl-sheet',
  exportAs: 'tslSheet',
  providers: [
    { provide: BrnDialog, useExisting: forwardRef(() => BrnSheet) },
    { provide: BrnSheet, useExisting: forwardRef(() => TslSheet) },
    provideBrnDialogDefaultOptions({ backdropClass: dialogOverlayClass }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
})
export class TslSheet extends BrnSheet {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly doc = inject(DOCUMENT);

  /** Edge the sheet slides in from. Default: the end of the reading direction. */
  readonly position = input<TslSheetPosition>('end');

  override open(): void {
    this.sideState.set(this.resolveSide());
    super.open();
  }

  private resolveSide(): 'top' | 'bottom' | 'left' | 'right' {
    const position = this.position();
    if (position === 'top' || position === 'bottom') return position;
    const rtl = this.doc.defaultView?.getComputedStyle(this.host.nativeElement).direction === 'rtl';
    const startIsLeft = !rtl;
    return (position === 'start') === startIsLeft ? 'left' : 'right';
  }
}

/** Opens the surrounding sheet. Use on a `<button>`. */
@Directive({
  selector: 'button[tslSheetTrigger]',
  hostDirectives: [{ directive: BrnSheetTrigger, inputs: ['id', 'type'] }],
  host: { 'data-slot': 'sheet-trigger' },
})
export class TslSheetTrigger {}

/** Renders the sheet content in an overlay. Use as `*tslSheetPortal`. */
@Directive({
  selector: '[tslSheetPortal]',
  hostDirectives: [{ directive: BrnSheetContent, inputs: ['context', 'class'] }],
})
export class TslSheetPortal {}

/** Closes the sheet it is in. Use on a `<button>`. */
@Directive({
  selector: 'button[tslSheetClose]',
  hostDirectives: [BrnSheetClose],
  host: { 'data-slot': 'sheet-close' },
})
export class TslSheetClose {}

/** The sliding panel, with a close button in the corner by default. */
@Component({
  selector: 'tsl-sheet-content',
  imports: [TslButton, TslSheetClose, TslIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'sheet-content',
    '[attr.data-side]': 'side()',
    '[attr.data-state]': 'state()',
    '[class]': 'computedClass()',
  },
  template: `
    @if (side() === 'bottom') {
      <div aria-hidden="true" class="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-border"></div>
    }
    <ng-content />
    @if (showCloseButton()) {
      <button
        tslButton
        tslSheetClose
        variant="ghost"
        size="icon-sm"
        class="absolute end-3 top-3 text-muted-foreground"
        [attr.aria-label]="closeLabel()"
      >
        <tsl-icon [icon]="closeIcon" />
      </button>
    }
  `,
})
export class TslSheetContent {
  private readonly stateProvider = injectExposesStateProvider({ host: true });
  private readonly sideProvider = injectExposedSideProvider({ host: true });
  protected readonly closeIcon = LucideX;

  readonly showCloseButton = input(true, { transform: booleanAttribute });
  readonly closeLabel = input('Close');
  /** Extra classes, merged so they can override the defaults (e.g. `sm:max-w-lg`). */
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly state = this.stateProvider.state ?? signal('closed');
  protected readonly side = this.sideProvider.side;

  protected readonly computedClass = computed(() =>
    cn(
      'fixed flex flex-col gap-4 bg-popover text-sm text-popover-foreground shadow-lg outline-none',
      'duration-slow ease-out data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:max-h-[calc(100dvh-4rem)] data-[side=top]:border-b',
      'data-[side=top]:data-[state=open]:slide-in-from-top data-[side=top]:data-[state=closed]:slide-out-to-top',
      'data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:max-h-[calc(100dvh-4rem)] data-[side=bottom]:rounded-t-xl data-[side=bottom]:border-t',
      'data-[side=bottom]:data-[state=open]:slide-in-from-bottom data-[side=bottom]:data-[state=closed]:slide-out-to-bottom',
      // Sides are physical here: the sheet resolved start/end against the reading direction on open.
      'data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=left]:sm:max-w-sm', // tsl-allow-style: physical side resolved on open
      'data-[side=left]:data-[state=open]:slide-in-from-left data-[side=left]:data-[state=closed]:slide-out-to-left', // tsl-allow-style: physical side resolved on open
      'data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=right]:sm:max-w-sm', // tsl-allow-style: physical side resolved on open
      'data-[side=right]:data-[state=open]:slide-in-from-right data-[side=right]:data-[state=closed]:slide-out-to-right', // tsl-allow-style: physical side resolved on open
      this.userClass(),
    ),
  );
}

/** Title and description block at the top of a sheet. */
@Directive({
  selector: '[tslSheetHeader],tsl-sheet-header',
  host: { 'data-slot': 'sheet-header', class: 'flex flex-col gap-1.5 p-5 pe-12 text-start' },
})
export class TslSheetHeader {}

/** Action row pinned to the bottom of a sheet. */
@Directive({
  selector: '[tslSheetFooter],tsl-sheet-footer',
  host: {
    'data-slot': 'sheet-footer',
    class: 'mt-auto flex flex-col-reverse gap-2 p-5 sm:flex-row sm:justify-end',
  },
})
export class TslSheetFooter {}

/** The sheet's accessible name. */
@Directive({
  selector: '[tslSheetTitle]',
  hostDirectives: [BrnSheetTitle],
  host: {
    'data-slot': 'sheet-title',
    class: 'font-display text-lg leading-tight font-semibold tracking-tight',
  },
})
export class TslSheetTitle {}

/** The sheet's accessible description. */
@Directive({
  selector: '[tslSheetDescription]',
  hostDirectives: [BrnSheetDescription],
  host: { 'data-slot': 'sheet-description', class: 'text-sm text-muted-foreground' },
})
export class TslSheetDescription {}

export const TslSheetImports = [
  TslSheet,
  TslSheetTrigger,
  TslSheetPortal,
  TslSheetClose,
  TslSheetContent,
  TslSheetHeader,
  TslSheetFooter,
  TslSheetTitle,
  TslSheetDescription,
] as const;
