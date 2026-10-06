import { NgComponentOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  forwardRef,
  inject,
  Injectable,
  input,
  type TemplateRef,
  type Type,
} from '@angular/core';
import { LucideX } from '@lucide/angular';
import {
  BRN_ALERT_DIALOG_DEFAULT_OPTIONS,
  BrnAlertDialog,
  BrnAlertDialogContent,
  BrnAlertDialogDescription,
  BrnAlertDialogTitle,
  BrnAlertDialogTrigger,
} from '@spartan-ng/brain/alert-dialog';
import {
  BrnDialog,
  BrnDialogClose,
  BrnDialogContent,
  BrnDialogDescription,
  BrnDialogRef,
  BrnDialogService,
  BrnDialogTitle,
  BrnDialogTrigger,
  cssClassesToArray,
  injectBrnDialogContext,
  provideBrnDialogDefaultOptions,
  type BrnDialogOptions,
} from '@spartan-ng/brain/dialog';
import { TslButton } from '@tassili/ui/button';
import { cn, type ClassValue } from '@tassili/ui/core';
import { TslIcon } from '@tassili/ui/icon';

/** Backdrop behind modal dialogs and sheets. */
export const dialogOverlayClass =
  'bg-overlay animate-in fade-in-0 duration-base supports-backdrop-filter:backdrop-blur-xs';

/** Surface of a centered dialog. */
export const dialogContentClass = [
  'relative grid max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-lg gap-4 overflow-y-auto rounded-xl border bg-popover p-6 text-sm text-popover-foreground shadow-lg outline-none',
  'duration-base data-[state=open]:animate-in data-[state=closed]:animate-out',
  'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95',
];

/**
 * A modal dialog: focus moves inside, the page behind is inert, Escape or the
 * backdrop closes it, and focus returns to the trigger afterwards.
 *
 * ```html
 * <tsl-dialog>
 *   <button tslButton tslDialogTrigger>Edit profile</button>
 *   <tsl-dialog-content *tslDialogPortal="let ctx">
 *     <tsl-dialog-header>
 *       <h2 tslDialogTitle>Edit profile</h2>
 *       <p tslDialogDescription>Changes are visible to your team.</p>
 *     </tsl-dialog-header>
 *     …
 *     <tsl-dialog-footer>
 *       <button tslButton variant="outline" tslDialogClose>Cancel</button>
 *       <button tslButton>Save changes</button>
 *     </tsl-dialog-footer>
 *   </tsl-dialog-content>
 * </tsl-dialog>
 * ```
 */
@Component({
  selector: 'tsl-dialog',
  exportAs: 'tslDialog',
  providers: [
    { provide: BrnDialog, useExisting: forwardRef(() => TslDialog) },
    provideBrnDialogDefaultOptions({ backdropClass: dialogOverlayClass }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
})
export class TslDialog extends BrnDialog {}

/** Opens the surrounding dialog. Use on a `<button>`. */
@Directive({
  selector: 'button[tslDialogTrigger],button[tslDialogTriggerFor]',
  hostDirectives: [
    {
      directive: BrnDialogTrigger,
      inputs: ['id', 'brnDialogTriggerFor: tslDialogTriggerFor', 'type'],
    },
  ],
  host: { 'data-slot': 'dialog-trigger' },
})
export class TslDialogTrigger {}

/** Renders the dialog content in an overlay. Use as `*tslDialogPortal`. */
@Directive({
  selector: '[tslDialogPortal]',
  hostDirectives: [{ directive: BrnDialogContent, inputs: ['context', 'class'] }],
})
export class TslDialogPortal {}

/** Closes the dialog it is in. Use on a `<button>`. */
@Directive({
  selector: 'button[tslDialogClose]',
  hostDirectives: [BrnDialogClose],
  host: { 'data-slot': 'dialog-close' },
})
export class TslDialogClose {}

interface DialogContentContext {
  $component?: Type<unknown>;
  $contentClass?: string;
  $showCloseButton?: boolean;
  $closeLabel?: string;
}

/** The dialog panel, with a close button in the corner by default. */
@Component({
  selector: 'tsl-dialog-content',
  imports: [NgComponentOutlet, TslButton, TslDialogClose, TslIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'dialog-content',
    '[attr.data-state]': 'state()',
    '[class]': 'computedClass()',
  },
  template: `
    @if (component) {
      <ng-container [ngComponentOutlet]="component" />
    } @else {
      <ng-content />
    }
    @if (showCloseButton()) {
      <button
        tslButton
        tslDialogClose
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
export class TslDialogContent {
  private readonly dialogRef = inject(BrnDialogRef);
  private readonly context = injectBrnDialogContext<DialogContentContext | null>({
    optional: true,
  });
  protected readonly closeIcon = LucideX;

  readonly showCloseButton = input(this.context?.$showCloseButton ?? true, {
    transform: booleanAttribute,
  });
  readonly closeLabel = input(this.context?.$closeLabel ?? 'Close');
  /** Extra classes, merged so they can override the defaults (e.g. `max-w-2xl`). */
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly component = this.context?.$component;
  protected readonly state = computed(() => this.dialogRef?.state() ?? 'closed');
  protected readonly computedClass = computed(() =>
    cn(dialogContentClass, this.context?.$contentClass, this.userClass()),
  );
}

/** Title and description block at the top of a dialog. */
@Directive({
  selector: '[tslDialogHeader],tsl-dialog-header',
  host: { 'data-slot': 'dialog-header', class: 'flex flex-col gap-1.5 pe-8 text-start' },
})
export class TslDialogHeader {}

/** Action row at the bottom of a dialog; stacks on small screens. */
@Directive({
  selector: '[tslDialogFooter],tsl-dialog-footer',
  host: {
    'data-slot': 'dialog-footer',
    class: 'flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end',
  },
})
export class TslDialogFooter {}

/** The dialog's accessible name. */
@Directive({
  selector: '[tslDialogTitle]',
  hostDirectives: [BrnDialogTitle],
  host: {
    'data-slot': 'dialog-title',
    class: 'font-display text-lg leading-tight font-semibold tracking-tight',
  },
})
export class TslDialogTitle {}

/** The dialog's accessible description. */
@Directive({
  selector: '[tslDialogDescription]',
  hostDirectives: [BrnDialogDescription],
  host: { 'data-slot': 'dialog-description', class: 'text-sm text-muted-foreground' },
})
export class TslDialogDescription {}

export interface TslDialogOptions<TContext = unknown> extends Partial<BrnDialogOptions> {
  /** Extra classes for the dialog panel. */
  contentClass?: string;
  showCloseButton?: boolean;
  closeLabel?: string;
  /** Data for the opened component, read with `injectBrnDialogContext()`. */
  context?: TContext;
}

/**
 * Opens a component as a dialog from code.
 *
 * ```ts
 * const ref = inject(TslDialogService).open(InviteMembers, { context: { teamId } });
 * ref.closed$.subscribe((result) => …);
 * ```
 */
@Injectable({ providedIn: 'root' })
export class TslDialogService {
  private readonly brn = inject(BrnDialogService);

  open<TResult = unknown, TContext = unknown>(
    component: Type<unknown> | TemplateRef<unknown>,
    options: TslDialogOptions<TContext> = {},
  ): BrnDialogRef<TResult> {
    const { contentClass, showCloseButton, closeLabel, context, ...brnOptions } = options;
    const mergedContext = {
      ...(context && typeof context === 'object' ? context : {}),
      $component: component,
      $contentClass: contentClass,
      $showCloseButton: showCloseButton,
      $closeLabel: closeLabel,
    };
    return this.brn.open<unknown, TResult>(TslDialogContent, undefined, mergedContext, {
      ...brnOptions,
      backdropClass: [
        ...cssClassesToArray(dialogOverlayClass),
        ...cssClassesToArray(brnOptions.backdropClass ?? ''),
      ],
    });
  }
}

/**
 * A dialog that interrupts to confirm an important action. It cannot be dismissed
 * by clicking outside, and has no close button: people must choose an action.
 *
 * ```html
 * <tsl-alert-dialog>
 *   <button tslButton variant="destructive" tslAlertDialogTrigger>Delete project</button>
 *   <tsl-alert-dialog-content *tslAlertDialogPortal>
 *     <tsl-dialog-header>
 *       <h2 tslAlertDialogTitle>Delete “Atlas”?</h2>
 *       <p tslAlertDialogDescription>This removes all of its data. You can't undo this.</p>
 *     </tsl-dialog-header>
 *     <tsl-dialog-footer>
 *       <button tslButton variant="outline" tslDialogClose>Cancel</button>
 *       <button tslButton variant="destructive" (click)="delete()">Delete project</button>
 *     </tsl-dialog-footer>
 *   </tsl-alert-dialog-content>
 * </tsl-alert-dialog>
 * ```
 */
@Component({
  selector: 'tsl-alert-dialog',
  exportAs: 'tslAlertDialog',
  providers: [
    { provide: BrnDialog, useExisting: forwardRef(() => TslAlertDialog) },
    provideBrnDialogDefaultOptions({
      ...BRN_ALERT_DIALOG_DEFAULT_OPTIONS,
      backdropClass: dialogOverlayClass,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
})
export class TslAlertDialog extends BrnAlertDialog {}

/** Opens the surrounding alert dialog. Use on a `<button>`. */
@Directive({
  selector: 'button[tslAlertDialogTrigger],button[tslAlertDialogTriggerFor]',
  hostDirectives: [
    {
      directive: BrnAlertDialogTrigger,
      inputs: ['id', 'brnAlertDialogTriggerFor: tslAlertDialogTriggerFor', 'type'],
    },
  ],
  host: { 'data-slot': 'alert-dialog-trigger' },
})
export class TslAlertDialogTrigger {}

/** Renders the alert dialog content in an overlay. Use as `*tslAlertDialogPortal`. */
@Directive({
  selector: '[tslAlertDialogPortal]',
  hostDirectives: [{ directive: BrnAlertDialogContent, inputs: ['context', 'class'] }],
})
export class TslAlertDialogPortal {}

/** The alert dialog panel. */
@Component({
  selector: 'tsl-alert-dialog-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'alert-dialog-content',
    '[attr.data-state]': 'state()',
    '[class]': 'computedClass()',
  },
  template: `<ng-content />`,
})
export class TslAlertDialogContent {
  private readonly dialogRef = inject(BrnDialogRef, { optional: true });
  /** Extra classes, merged so they can override the defaults. */
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly state = computed(() => this.dialogRef?.state() ?? 'closed');
  protected readonly computedClass = computed(() =>
    cn(dialogContentClass, 'max-w-md', this.userClass()),
  );
}

/** The alert dialog's accessible name. */
@Directive({
  selector: '[tslAlertDialogTitle]',
  hostDirectives: [BrnAlertDialogTitle],
  host: {
    'data-slot': 'alert-dialog-title',
    class: 'font-display text-lg leading-tight font-semibold tracking-tight',
  },
})
export class TslAlertDialogTitle {}

/** The alert dialog's accessible description. */
@Directive({
  selector: '[tslAlertDialogDescription]',
  hostDirectives: [BrnAlertDialogDescription],
  host: { 'data-slot': 'alert-dialog-description', class: 'text-sm text-muted-foreground' },
})
export class TslAlertDialogDescription {}

export const TslDialogImports = [
  TslDialog,
  TslDialogTrigger,
  TslDialogPortal,
  TslDialogClose,
  TslDialogContent,
  TslDialogHeader,
  TslDialogFooter,
  TslDialogTitle,
  TslDialogDescription,
] as const;

export const TslAlertDialogImports = [
  TslAlertDialog,
  TslAlertDialogTrigger,
  TslAlertDialogPortal,
  TslAlertDialogContent,
  TslAlertDialogTitle,
  TslAlertDialogDescription,
  TslDialogHeader,
  TslDialogFooter,
  TslDialogClose,
] as const;
