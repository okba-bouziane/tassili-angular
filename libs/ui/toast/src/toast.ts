import { Directionality } from '@angular/cdk/bidi';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import {
  LucideCircleCheck,
  LucideInfo,
  LucideOctagonX,
  LucideTriangleAlert,
} from '@lucide/angular';
import {
  BrnSonnerImports,
  toast,
  type Position,
  type ToastOptions,
} from '@spartan-ng/brain/sonner';
import { TslButton } from '@tassili/ui/button';
import { cn, type ClassValue } from '@tassili/ui/core';
import { TslIcon } from '@tassili/ui/icon';
import { TslSpinner } from '@tassili/ui/spinner';

/** Where toasts stack. `start`/`end` follow the reading direction. */
export type TslToasterPosition =
  'top-start' | 'top-center' | 'top-end' | 'bottom-start' | 'bottom-center' | 'bottom-end';

/**
 * Shows a toast. Re-exported from spartan's sonner engine.
 *
 * ```ts
 * toast('Draft saved');
 * toast.success('Invitation sent', { description: 'Amina will get an email shortly.' });
 * toast.error('Couldn't connect to the server. Try again.');
 * toast('Project archived', { action: { label: 'Undo', onClick: () => restore() } });
 * toast.promise(save(), { loading: 'Saving…', success: 'Saved', error: 'Couldn't save' });
 * ```
 */
export { toast };

const iconChip = 'inline-flex size-5 items-center justify-center rounded-sm';

/**
 * Renders toasts. Add it once, near the root of the app (e.g. in `app.html`).
 *
 * ```html
 * <tsl-toaster />
 * ```
 *
 * Toasts are announced politely to screen readers, pause on hover and focus, and can be
 * reached with Alt+T. Keep messages short; don't put the only copy of important
 * information or required actions in a toast.
 */
@Component({
  selector: 'tsl-toaster',
  imports: [BrnSonnerImports, TslButton, TslIcon, TslSpinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <brn-sonner-toaster
      [class]="computedClass()"
      theme="system"
      [position]="physicalPosition()"
      [hotKey]="hotKey()"
      [expand]="expand()"
      [duration]="duration()"
      [visibleToasts]="visibleToasts()"
      [closeButton]="closeButton()"
      [toastOptions]="computedToastOptions()"
      [offset]="offset()"
      [style]="tokenStyle"
    >
      <ng-template #loadingIcon><tsl-spinner size="sm" decorative /></ng-template>
      <ng-template #successIcon>
        <span class="${iconChip} bg-success text-success-foreground"
          ><tsl-icon [icon]="icons.success" size="sm"
        /></span>
      </ng-template>
      <ng-template #errorIcon>
        <span class="${iconChip} bg-destructive text-destructive-foreground"
          ><tsl-icon [icon]="icons.error" size="sm"
        /></span>
      </ng-template>
      <ng-template #infoIcon>
        <span class="${iconChip} bg-info text-info-foreground"
          ><tsl-icon [icon]="icons.info" size="sm"
        /></span>
      </ng-template>
      <ng-template #warningIcon>
        <span class="${iconChip} bg-warning text-warning-foreground"
          ><tsl-icon [icon]="icons.warning" size="sm"
        /></span>
      </ng-template>
      <button
        *brnToastAction="let action; let toast = toast"
        tslButton
        size="sm"
        class="h-7 px-2.5"
        [style]="toast.actionButtonStyle"
        (click)="action.onClick($event)"
      >
        {{ action.label }}
      </button>
      <button
        *brnToastCancelAction="let cancel; let toast = toast"
        tslButton
        size="sm"
        variant="ghost"
        class="h-7 px-2.5"
        [style]="toast.cancelButtonStyle"
        (click)="cancel.onClick($event)"
      >
        {{ cancel.label }}
      </button>
    </brn-sonner-toaster>
  `,
})
export class TslToaster {
  private readonly dir = inject(Directionality, { optional: true });
  protected readonly icons = {
    success: LucideCircleCheck,
    error: LucideOctagonX,
    info: LucideInfo,
    warning: LucideTriangleAlert,
  };

  readonly position = input<TslToasterPosition>('bottom-end');
  /** Keyboard shortcut that moves focus to the toasts. */
  readonly hotKey = input<string[]>(['altKey', 'KeyT']);
  /** Show all visible toasts expanded instead of stacked. */
  readonly expand = input(false, { transform: booleanAttribute });
  /** Default display time in milliseconds. */
  readonly duration = input(5000, { transform: numberAttribute });
  readonly visibleToasts = input(3, { transform: numberAttribute });
  readonly closeButton = input(true, { transform: booleanAttribute });
  readonly toastOptions = input<ToastOptions>({});
  readonly offset = input<string | number | null>(null);
  /** Extra classes for the toaster region. */
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  /** Sonner reads these variables; mapping them to tokens themes every toast. */
  protected readonly tokenStyle: Record<string, string> = {
    '--normal-bg': 'var(--tsl-color-popover)',
    '--normal-text': 'var(--tsl-color-popover-foreground)',
    '--normal-border': 'var(--tsl-color-border)',
    '--border-radius': 'var(--tsl-radius-lg)',
    '--width': '22rem',
  };

  protected readonly physicalPosition = computed<Position>(() => {
    const rtl = this.dir?.value === 'rtl';
    return this.position().replace(/start|end/, (side) =>
      (side === 'start') !== rtl ? 'left' : 'right',
    ) as Position;
  });

  protected readonly computedClass = computed(() => cn('toaster group', this.userClass()));

  protected readonly computedToastOptions = computed<ToastOptions>(() => {
    const options = this.toastOptions();
    return {
      ...options,
      classes: {
        ...options.classes,
        toast: cn('font-sans shadow-lg gap-3', options.classes?.toast),
        title: cn('text-sm font-medium', options.classes?.title),
        description: cn('text-sm text-muted-foreground', options.classes?.description),
        closeButton: cn(
          'border-border bg-popover text-muted-foreground',
          options.classes?.closeButton,
        ),
      },
    };
  });
}
