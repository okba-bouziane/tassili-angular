import { CdkTrapFocus } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  Directive,
  effect,
  type ElementRef,
  HOST_TAG_NAME,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { LucidePanelLeft } from '@lucide/angular';
import { BrnTooltip, provideBrnTooltipDefaultOptions } from '@spartan-ng/brain/tooltip';
import { TslButton } from '@tassili/ui/button';
import { cn, type ClassValue } from '@tassili/ui/core';
import { TslIcon } from '@tassili/ui/icon';
import { tooltipContentClass } from '@tassili/ui/tooltip';
import { TslSidebarState } from './sidebar-state';

/**
 * Wraps the page layout and owns the sidebar state.
 *
 * ```html
 * <tsl-sidebar-provider>
 *   <tsl-sidebar>…</tsl-sidebar>
 *   <tsl-sidebar-inset>
 *     <header><tsl-sidebar-trigger /></header>
 *     <router-outlet />
 *   </tsl-sidebar-inset>
 * </tsl-sidebar-provider>
 * ```
 *
 * Ctrl/⌘+B toggles the sidebar. The desktop collapsed state is remembered.
 */
@Component({
  selector: 'tsl-sidebar-provider',
  providers: [TslSidebarState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'sidebar-provider',
    class: 'group/sidebar-wrapper flex min-h-svh w-full',
  },
  template: `<ng-content />`,
})
export class TslSidebarProvider {
  readonly state = inject(TslSidebarState);
  /** Start collapsed on desktop when nothing is stored. */
  readonly defaultCollapsed = input(false, { transform: booleanAttribute });
  /** localStorage key for the collapsed state; `null` disables persistence. */
  readonly storageKey = input<string | null>('tsl-sidebar-collapsed');
  /** Letter that toggles the sidebar with Ctrl/⌘; `null` disables the shortcut. */
  readonly shortcut = input<string | null>('b');

  constructor() {
    const document = inject(DOCUMENT);
    effect(() =>
      this.state.configure({
        storageKey: this.storageKey(),
        defaultCollapsed: this.defaultCollapsed(),
      }),
    );
    const onKeydown = (event: KeyboardEvent) => {
      const key = this.shortcut();
      if (key && event.key.toLowerCase() === key && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        this.state.toggle();
      }
    };
    document.addEventListener('keydown', onKeydown);
    inject(DestroyRef).onDestroy(() => document.removeEventListener('keydown', onKeydown));
  }
}

/**
 * The sidebar itself. On desktop it collapses to an icon rail; on mobile it slides
 * in over the page with a backdrop, traps focus and closes with Escape.
 */
@Component({
  selector: 'tsl-sidebar',
  imports: [CdkTrapFocus],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'sidebar',
    class: 'contents',
    // Pointer convenience: clicking the mobile backdrop closes the panel (Escape does too).
    '(click)': 'onHostClick($event)',
    '(keydown.escape)': 'onEscape()',
  },
  template: `
    @if (state.isMobile() && state.openMobile()) {
      <div
        aria-hidden="true"
        data-sidebar-backdrop
        class="fixed inset-0 z-overlay bg-overlay animate-in fade-in-0 duration-base"
      ></div>
    }
    <aside
      [id]="state.sidebarId"
      [attr.aria-label]="label()"
      [attr.data-state]="state.state()"
      [attr.data-mobile]="state.isMobile() ? '' : null"
      [attr.inert]="state.isMobile() && !state.openMobile() ? '' : null"
      [cdkTrapFocus]="state.isMobile() && state.openMobile()"
      [class]="computedClass()"
    >
      <ng-content />
    </aside>
  `,
})
export class TslSidebar {
  protected readonly state = inject(TslSidebarState);
  private readonly trap = viewChild.required(CdkTrapFocus);
  /** Accessible name of the sidebar landmark. */
  readonly label = input('Sidebar');
  /** Extra classes, merged so they can override the defaults. */
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly computedClass = computed(() =>
    cn(
      'group/sidebar flex h-svh shrink-0 flex-col overflow-hidden bg-sidebar text-sidebar-foreground border-e border-sidebar-border',
      'transition-[width,translate] duration-base ease-out',
      this.state.isMobile()
        ? 'fixed inset-y-0 start-0 z-modal w-[min(18rem,85vw)] shadow-lg data-[state=collapsed]:shadow-none data-[state=collapsed]:-translate-x-full rtl:data-[state=collapsed]:translate-x-full' // tsl-allow-style: slides off-screen; mirrored with rtl:
        : 'sticky top-0 w-(--tsl-sidebar-width) data-[state=collapsed]:w-(--tsl-sidebar-width-collapsed)',
      this.userClass(),
    ),
  );

  constructor() {
    // Move focus into the mobile panel when it opens (the trap only contains it).
    effect(() => {
      if (this.state.isMobile() && this.state.openMobile()) {
        void this.trap().focusTrap.focusFirstTabbableElementWhenReady();
      }
    });
  }

  protected onHostClick(event: MouseEvent): void {
    if ((event.target as HTMLElement | null)?.hasAttribute('data-sidebar-backdrop')) {
      this.state.closeMobile();
    }
  }

  protected onEscape(): void {
    if (this.state.isMobile() && this.state.openMobile()) {
      this.state.closeMobile();
    }
  }
}

/** Button that toggles the sidebar (icon rail on desktop, panel on mobile). */
@Component({
  selector: 'tsl-sidebar-trigger',
  imports: [TslButton, TslIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-slot': 'sidebar-trigger', class: 'contents' },
  template: `
    <button
      #button
      tslButton
      variant="ghost"
      size="icon-sm"
      [attr.aria-label]="label()"
      [attr.aria-expanded]="state.open()"
      [attr.aria-controls]="state.sidebarId"
      (click)="state.toggle()"
    >
      <tsl-icon [icon]="icon" mirrorInRtl />
    </button>
  `,
})
export class TslSidebarTrigger {
  protected readonly state = inject(TslSidebarState);
  protected readonly icon = LucidePanelLeft;
  private readonly button = viewChild.required<ElementRef<HTMLButtonElement>>('button');
  readonly label = input('Toggle sidebar');

  constructor() {
    // Return focus here when the mobile panel closes (Escape, backdrop, navigation).
    let wasOpen = false;
    effect(() => {
      const open = this.state.openMobile();
      if (wasOpen && !open) this.button().nativeElement.focus();
      wasOpen = open;
    });
  }
}

/** The main content area next to the sidebar. */
@Directive({
  selector: '[tslSidebarInset],tsl-sidebar-inset',
  host: {
    'data-slot': 'sidebar-inset',
    class: 'relative flex min-w-0 flex-1 flex-col bg-background',
  },
})
export class TslSidebarInset {}

@Directive({
  selector: '[tslSidebarHeader],tsl-sidebar-header',
  host: { 'data-slot': 'sidebar-header', class: 'flex shrink-0 flex-col gap-2 p-2' },
})
export class TslSidebarHeader {}

/** Scrollable middle section holding the groups. */
@Directive({
  selector: '[tslSidebarContent],tsl-sidebar-content',
  host: {
    'data-slot': 'sidebar-content',
    class:
      'flex min-h-0 flex-1 flex-col gap-1 overflow-x-hidden overflow-y-auto group-data-[state=collapsed]/sidebar:overflow-y-hidden',
  },
})
export class TslSidebarContent {}

@Directive({
  selector: '[tslSidebarFooter],tsl-sidebar-footer',
  host: { 'data-slot': 'sidebar-footer', class: 'mt-auto flex shrink-0 flex-col gap-2 p-2' },
})
export class TslSidebarFooter {}

@Directive({
  selector: '[tslSidebarGroup],tsl-sidebar-group',
  host: { 'data-slot': 'sidebar-group', class: 'relative flex w-full min-w-0 flex-col p-2' },
})
export class TslSidebarGroup {}

/** Group heading; hidden (but kept for screen readers) in the icon rail. */
@Directive({
  selector: '[tslSidebarGroupLabel],tsl-sidebar-group-label',
  host: {
    'data-slot': 'sidebar-group-label',
    class:
      'flex h-8 shrink-0 items-center px-2 text-xs font-medium text-muted-foreground transition-opacity duration-fast group-data-[state=collapsed]/sidebar:sr-only',
  },
})
export class TslSidebarGroupLabel {}

@Directive({
  selector: 'ul[tslSidebarMenu]',
  host: { 'data-slot': 'sidebar-menu', class: 'flex w-full min-w-0 flex-col gap-0.5' },
})
export class TslSidebarMenu {}

@Directive({
  selector: 'li[tslSidebarMenuItem]',
  host: { 'data-slot': 'sidebar-menu-item', class: 'group/menu-item relative' },
})
export class TslSidebarMenuItem {}

/**
 * A navigation link or action in the sidebar. Put the label in a `<span>` so it can
 * collapse to the icon rail; `tooltip` shows it on hover while collapsed.
 *
 * ```html
 * <a tslSidebarMenuButton routerLink="/projects" routerLinkActive #rla="routerLinkActive"
 *    [active]="rla.isActive" tooltip="Projects">
 *   <tsl-icon [icon]="folder" /><span>Projects</span>
 * </a>
 * ```
 */
@Directive({
  selector: 'a[tslSidebarMenuButton],button[tslSidebarMenuButton]',
  providers: [
    provideBrnTooltipDefaultOptions({
      showDelay: 200,
      hideDelay: 0,
      position: 'right',
      svgClasses: 'hidden',
      arrowClasses: () => 'hidden',
      tooltipContentClasses: tooltipContentClass,
    }),
  ],
  hostDirectives: [{ directive: BrnTooltip, inputs: ['brnTooltip: tooltip'] }],
  host: {
    'data-slot': 'sidebar-menu-button',
    '[attr.data-active]': 'active() ? "" : null',
    '[attr.aria-current]': 'isLink && active() ? "page" : null',
    '[attr.type]': 'isLink ? null : "button"',
    '[class]': 'computedClass()',
  },
})
export class TslSidebarMenuButton {
  private readonly state = inject(TslSidebarState);
  private readonly tooltip = inject(BrnTooltip);
  protected readonly isLink = inject(HOST_TAG_NAME) === 'a';
  /** Marks the current page (sets `aria-current="page"` on links). */
  readonly active = input(false, { transform: booleanAttribute });
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly computedClass = computed(() =>
    cn(
      'flex h-9 w-full items-center gap-2.5 overflow-hidden rounded-md px-2.5 text-start text-sm text-sidebar-foreground outline-none',
      'transition-[background-color,color,padding] duration-fast ease-out focus-ring',
      'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
      'data-active:bg-sidebar-accent data-active:font-medium data-active:text-sidebar-accent-foreground',
      // Tassili's active marker: a short indigo bar on the inline-start edge.
      'relative before:absolute before:inset-y-2 before:start-0 before:w-0.5 before:rounded-full before:bg-primary before:opacity-0 before:transition-opacity data-active:before:opacity-100',
      "[&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&>span:last-child]:truncate",
      'group-data-[state=collapsed]/sidebar:justify-center group-data-[state=collapsed]/sidebar:px-0',
      'group-data-[state=collapsed]/sidebar:[&>span]:sr-only',
      this.userClass(),
    ),
  );

  constructor() {
    // Tooltips only make sense when labels are hidden (desktop icon rail).
    effect(() => {
      this.tooltip.mutableTooltipDisabled.set(this.state.isMobile() || !this.state.collapsed());
    });
  }
}

/** Small count or status next to a menu button (hidden in the icon rail). */
@Directive({
  selector: '[tslSidebarMenuBadge],tsl-sidebar-menu-badge',
  host: {
    'data-slot': 'sidebar-menu-badge',
    class:
      'pointer-events-none absolute end-2 top-1/2 -translate-y-1/2 rounded-sm bg-secondary px-1.5 text-xs font-medium tabular-nums text-secondary-foreground group-data-[state=collapsed]/sidebar:hidden',
  },
})
export class TslSidebarMenuBadge {}

/** Thin divider inside the sidebar. */
@Directive({
  selector: '[tslSidebarSeparator],tsl-sidebar-separator',
  host: {
    'data-slot': 'sidebar-separator',
    role: 'presentation',
    class: 'mx-3 my-1 block h-px bg-sidebar-border',
  },
})
export class TslSidebarSeparator {}

/** Closes the mobile sidebar after navigation; put on links inside the sidebar. */
@Directive({
  selector: '[tslSidebarCloseOnNavigate]',
  host: { '(click)': 'state.closeMobile()' },
})
export class TslSidebarCloseOnNavigate {
  protected readonly state = inject(TslSidebarState);
}

export const TslSidebarImports = [
  TslSidebarProvider,
  TslSidebar,
  TslSidebarTrigger,
  TslSidebarInset,
  TslSidebarHeader,
  TslSidebarContent,
  TslSidebarFooter,
  TslSidebarGroup,
  TslSidebarGroupLabel,
  TslSidebarMenu,
  TslSidebarMenuItem,
  TslSidebarMenuButton,
  TslSidebarMenuBadge,
  TslSidebarSeparator,
  TslSidebarCloseOnNavigate,
] as const;
