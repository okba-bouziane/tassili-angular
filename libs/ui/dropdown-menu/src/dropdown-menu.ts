import {
  CdkMenu,
  CdkMenuGroup,
  CdkMenuItem,
  CdkMenuItemCheckbox,
  CdkMenuItemRadio,
  CdkMenuItemSelectable,
  CdkMenuTrigger,
} from '@angular/cdk/menu';
import { InputModalityDetector } from '@angular/cdk/a11y';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  effect,
  ElementRef,
  forwardRef,
  HOST_TAG_NAME,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LucideCheck, LucideChevronRight } from '@lucide/angular';
import {
  createMenuPosition,
  deriveMenuSideFromTransformOrigin,
  MENU_SIDE,
  updateMenuPosition,
  type MenuAlign,
  type MenuSide,
} from '@spartan-ng/brain/core';
import { cn, overlaySurface, type ClassValue } from '@tassili/ui/core';
import { TslIcon } from '@tassili/ui/icon';

export type TslMenuAlign = MenuAlign;
export type TslMenuSide = MenuSide;

/** Shared look of menu rows (items, checkbox and radio items, sub-triggers). */
export const menuItemClass = [
  'group/menu-item relative flex w-full cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-start text-sm outline-none select-none',
  'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
  'data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:ps-8',
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
];

/**
 * Moves focus with the pointer, so hovering and the keyboard share one highlight
 * and focus never drops out of an open submenu stack.
 */
@Directive({
  selector: '[tslMenuFocusOnHover]',
  host: { '(mouseenter)': 'focusOnHover()' },
})
export class TslMenuFocusOnHover {
  private readonly item = inject(CdkMenuItem, { self: true });
  private readonly menu = inject(CdkMenu, { optional: true });
  private readonly modality = inject(InputModalityDetector);

  protected focusOnHover(): void {
    if (this.modality.mostRecentModality === 'touch' || this.item.disabled) return;
    this.menu?.setActiveMenuItem(this.item);
  }
}

/** Shared behaviour of a menu panel (root or submenu): open state and resolved side. */
abstract class MenuPanel {
  private readonly cdkMenu = inject(CdkMenu);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly menuSide = inject(MENU_SIDE, { optional: true });
  protected readonly state = signal<'open' | 'closed'>('open');
  protected readonly side = signal<MenuSide>(this.menuSide?.side() ?? this.defaultSide());

  protected abstract defaultSide(): MenuSide;

  constructor() {
    this.cdkMenu.closed.pipe(takeUntilDestroyed()).subscribe(() => this.state.set('closed'));
    // CDK sets transform-origin on attach; derive the side it actually opened on.
    setTimeout(() =>
      this.side.set(
        deriveMenuSideFromTransformOrigin(
          this.element.nativeElement.style.transformOrigin,
          this.menuSide?.side() ?? this.defaultSide(),
        ),
      ),
    );
  }
}

/**
 * The menu panel. Put it in an `<ng-template>` referenced by a trigger.
 *
 * ```html
 * <button tslButton variant="outline" [tslDropdownMenuTrigger]="menu">Options</button>
 * <ng-template #menu>
 *   <tsl-dropdown-menu class="w-48">
 *     <tsl-dropdown-menu-label>My account</tsl-dropdown-menu-label>
 *     <button tslDropdownMenuItem>Profile <tsl-dropdown-menu-shortcut>⇧⌘P</tsl-dropdown-menu-shortcut></button>
 *     <tsl-dropdown-menu-separator />
 *     <button tslDropdownMenuItem variant="destructive">Sign out</button>
 *   </tsl-dropdown-menu>
 * </ng-template>
 * ```
 *
 * Arrow keys move between items, typing jumps to an item, Enter/Space activate,
 * Escape closes and returns focus to the trigger.
 */
@Directive({
  selector: '[tslDropdownMenu],tsl-dropdown-menu',
  hostDirectives: [CdkMenu],
  host: {
    'data-slot': 'dropdown-menu',
    '[attr.data-state]': 'state()',
    '[attr.data-open]': 'state() === "open" ? "" : null',
    '[attr.data-closed]': 'state() === "closed" ? "" : null',
    '[attr.data-side]': 'side()',
    '[class]': 'computedClass()',
  },
})
export class TslDropdownMenu extends MenuPanel {
  /** Extra classes, merged so they can override the defaults (e.g. `w-56`). */
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected defaultSide(): MenuSide {
    return 'bottom';
  }
  protected readonly computedClass = computed(() =>
    cn(
      overlaySurface,
      'my-1 block min-w-40 overflow-x-hidden overflow-y-auto p-1 outline-none',
      this.userClass(),
    ),
  );
}

/** A submenu panel, opened from a `tslDropdownMenuSubTrigger` item. */
@Directive({
  selector: '[tslDropdownMenuSub],tsl-dropdown-menu-sub',
  hostDirectives: [CdkMenu],
  host: {
    'data-slot': 'dropdown-menu-sub',
    '[attr.data-state]': 'state()',
    '[attr.data-open]': 'state() === "open" ? "" : null',
    '[attr.data-closed]': 'state() === "closed" ? "" : null',
    '[attr.data-side]': 'side()',
    '[class]': 'computedClass()',
  },
})
export class TslDropdownMenuSub extends MenuPanel {
  /** Extra classes, merged so they can override the defaults (e.g. `w-56`). */
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected defaultSide(): MenuSide {
    return 'right';
  }
  protected readonly computedClass = computed(() =>
    cn(
      overlaySurface,
      'mx-1 block min-w-36 overflow-hidden p-1 shadow-lg outline-none',
      this.userClass(),
    ),
  );
}

/** Opens a dropdown menu. Use on a `<button>`: `[tslDropdownMenuTrigger]="menuTemplate"`. */
@Directive({
  selector: '[tslDropdownMenuTrigger]',
  providers: [{ provide: MENU_SIDE, useExisting: forwardRef(() => TslDropdownMenuTrigger) }],
  hostDirectives: [
    {
      directive: CdkMenuTrigger,
      inputs: [
        'cdkMenuTriggerFor: tslDropdownMenuTrigger',
        'cdkMenuTriggerData: tslDropdownMenuTriggerData',
      ],
      outputs: ['cdkMenuOpened: tslDropdownMenuOpened', 'cdkMenuClosed: tslDropdownMenuClosed'],
    },
  ],
  host: { 'data-slot': 'dropdown-menu-trigger' },
})
export class TslDropdownMenuTrigger {
  private readonly cdkTrigger = inject(CdkMenuTrigger, { host: true });
  /** Alignment along the trigger edge. */
  readonly align = input<MenuAlign>('start');
  /** Preferred side; flips automatically when there isn't room. */
  readonly side = input<MenuSide>('bottom');
  private readonly position = computed(() => createMenuPosition(this.align(), this.side()));

  constructor() {
    this.cdkTrigger.transformOriginSelector = '[data-slot="dropdown-menu"]';
    effect(() => updateMenuPosition(this.cdkTrigger, this.position()));
  }
}

/** A menu row that runs an action. Use on a `<button>` (or `<a>` for navigation). */
@Directive({
  selector: '[tslDropdownMenuItem]',
  hostDirectives: [
    {
      directive: CdkMenuItem,
      inputs: ['cdkMenuItemDisabled: disabled'],
      outputs: ['cdkMenuItemTriggered: triggered'],
    },
    TslMenuFocusOnHover,
  ],
  host: {
    'data-slot': 'dropdown-menu-item',
    '[attr.disabled]': 'isButton && disabled() ? "" : null',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.data-variant]': 'variant()',
    '[attr.data-inset]': 'inset() ? "" : null',
    '[class]': 'computedClass()',
  },
})
export class TslDropdownMenuItem {
  protected readonly isButton = inject(HOST_TAG_NAME) === 'button';
  readonly disabled = input(false, { transform: booleanAttribute });
  /** `destructive` for actions such as Delete. */
  readonly variant = input<'default' | 'destructive'>('default');
  /** Indent to line up with checkbox and radio items. */
  readonly inset = input(false, { transform: booleanAttribute });
  /** Extra classes, merged so they can override the defaults. */
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly computedClass = computed(() =>
    cn(
      menuItemClass,
      'data-[variant=destructive]:text-destructive data-[variant=destructive]:hover:bg-destructive/10 data-[variant=destructive]:hover:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive',
      this.userClass(),
    ),
  );
}

/** Opens a submenu: `[tslDropdownMenuSubTrigger]="subTemplate"` on a `tslDropdownMenuItem`. */
@Directive({
  selector: '[tslDropdownMenuSubTrigger]',
  providers: [{ provide: MENU_SIDE, useExisting: forwardRef(() => TslDropdownMenuSubTrigger) }],
  hostDirectives: [
    {
      directive: CdkMenuTrigger,
      inputs: [
        'cdkMenuTriggerFor: tslDropdownMenuSubTrigger',
        'cdkMenuTriggerData: tslDropdownMenuTriggerData',
      ],
      outputs: [
        'cdkMenuOpened: tslDropdownMenuSubOpened',
        'cdkMenuClosed: tslDropdownMenuSubClosed',
      ],
    },
  ],
  host: {
    'data-slot': 'dropdown-menu-sub-trigger',
    class: 'aria-expanded:bg-accent aria-expanded:text-accent-foreground',
  },
})
export class TslDropdownMenuSubTrigger {
  private readonly cdkTrigger = inject(CdkMenuTrigger, { host: true });
  readonly align = input<MenuAlign>('start');
  readonly side = input<MenuSide>('right');
  private readonly position = computed(() => createMenuPosition(this.align(), this.side()));

  constructor() {
    this.cdkTrigger.transformOriginSelector = '[data-slot="dropdown-menu-sub"]';
    effect(() => updateMenuPosition(this.cdkTrigger, this.position()));
  }
}

/** Chevron shown at the end of a sub-trigger item; mirrors in RTL. */
@Component({
  selector: 'tsl-dropdown-menu-sub-indicator',
  imports: [TslIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ms-auto flex items-center' },
  template: `<tsl-icon [icon]="icon" mirrorInRtl />`,
})
export class TslDropdownMenuSubIndicator {
  protected readonly icon = LucideChevronRight;
}

/** @internal CDK checkbox item that keeps the menu open by default. */
@Directive({
  selector: '[tslDropdownMenuCheckboxCdk]',
  providers: [
    { provide: CdkMenuItemCheckbox, useExisting: TslDropdownMenuCheckboxCdk },
    { provide: CdkMenuItemSelectable, useExisting: TslDropdownMenuCheckboxCdk },
    { provide: CdkMenuItem, useExisting: CdkMenuItemSelectable },
  ],
})
export class TslDropdownMenuCheckboxCdk extends CdkMenuItemCheckbox {
  readonly keepOpen = input(true, { transform: booleanAttribute });
  override trigger(options?: { keepOpen: boolean }): void {
    super.trigger({ ...options, keepOpen: this.keepOpen() });
  }
}

/** A menu row that toggles an option on or off. */
@Component({
  selector: '[tslDropdownMenuCheckbox]',
  imports: [TslIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: TslDropdownMenuCheckboxCdk,
      inputs: ['cdkMenuItemDisabled: disabled', 'cdkMenuItemChecked: checked', 'keepOpen'],
      outputs: ['cdkMenuItemTriggered: triggered'],
    },
    TslMenuFocusOnHover,
  ],
  host: {
    'data-slot': 'dropdown-menu-checkbox-item',
    '[attr.data-disabled]': 'cdk.disabled ? "" : null',
    '[attr.data-checked]': 'cdk.checked ? "" : null',
    '[class]': 'computedClass()',
  },
  template: `
    <span class="absolute start-2 flex size-4 items-center justify-center">
      @if (cdk.checked) {
        <tsl-icon [icon]="check" />
      }
    </span>
    <ng-content />
  `,
})
export class TslDropdownMenuCheckbox {
  protected readonly cdk = inject(TslDropdownMenuCheckboxCdk);
  protected readonly check = LucideCheck;
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() => cn(menuItemClass, 'ps-8', this.userClass()));
}

/** @internal CDK radio item that keeps the menu open by default. */
@Directive({
  selector: '[tslDropdownMenuRadioCdk]',
  providers: [
    { provide: CdkMenuItemRadio, useExisting: TslDropdownMenuRadioCdk },
    { provide: CdkMenuItemSelectable, useExisting: TslDropdownMenuRadioCdk },
    { provide: CdkMenuItem, useExisting: CdkMenuItemSelectable },
  ],
})
export class TslDropdownMenuRadioCdk extends CdkMenuItemRadio {
  readonly keepOpen = input(true, { transform: booleanAttribute });
  override trigger(options?: { keepOpen: boolean }): void {
    super.trigger({ ...options, keepOpen: this.keepOpen() });
  }
}

/** One choice in a group of mutually exclusive menu options (wrap in `tsl-dropdown-menu-group`). */
@Component({
  selector: '[tslDropdownMenuRadio]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: TslDropdownMenuRadioCdk,
      inputs: ['cdkMenuItemDisabled: disabled', 'cdkMenuItemChecked: checked', 'keepOpen'],
      outputs: ['cdkMenuItemTriggered: triggered'],
    },
    TslMenuFocusOnHover,
  ],
  host: {
    'data-slot': 'dropdown-menu-radio-item',
    '[attr.data-disabled]': 'cdk.disabled ? "" : null',
    '[attr.data-checked]': 'cdk.checked ? "" : null',
    '[class]': 'computedClass()',
  },
  template: `
    <span class="absolute start-2 flex size-4 items-center justify-center">
      @if (cdk.checked) {
        <span class="size-2 rounded-full bg-current"></span>
      }
    </span>
    <ng-content />
  `,
})
export class TslDropdownMenuRadio {
  protected readonly cdk = inject(TslDropdownMenuRadioCdk);
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() => cn(menuItemClass, 'ps-8', this.userClass()));
}

/** Groups related items (and scopes radio items). */
@Directive({
  selector: '[tslDropdownMenuGroup],tsl-dropdown-menu-group',
  hostDirectives: [CdkMenuGroup],
  host: { 'data-slot': 'dropdown-menu-group', class: 'block' },
})
export class TslDropdownMenuGroup {}

/** Non-interactive heading inside a menu. */
@Directive({
  selector: '[tslDropdownMenuLabel],tsl-dropdown-menu-label',
  host: {
    'data-slot': 'dropdown-menu-label',
    '[attr.data-inset]': 'inset() ? "" : null',
    class: 'block px-2 py-1.5 text-xs font-medium text-muted-foreground data-inset:ps-8',
  },
})
export class TslDropdownMenuLabel {
  readonly inset = input(false, { transform: booleanAttribute });
}

/** Divider between groups of items. */
@Directive({
  selector: '[tslDropdownMenuSeparator],tsl-dropdown-menu-separator',
  host: {
    'data-slot': 'dropdown-menu-separator',
    role: 'separator',
    class: '-mx-1 my-1 block h-px bg-border',
  },
})
export class TslDropdownMenuSeparator {}

/** Keyboard shortcut hint at the end of an item. */
@Directive({
  selector: '[tslDropdownMenuShortcut],tsl-dropdown-menu-shortcut',
  host: {
    'data-slot': 'dropdown-menu-shortcut',
    class:
      'ms-auto ps-4 text-xs tracking-wide text-muted-foreground group-focus/menu-item:text-accent-foreground',
  },
})
export class TslDropdownMenuShortcut {}

export const TslDropdownMenuImports = [
  TslDropdownMenu,
  TslDropdownMenuSub,
  TslDropdownMenuTrigger,
  TslDropdownMenuItem,
  TslDropdownMenuSubTrigger,
  TslDropdownMenuSubIndicator,
  TslDropdownMenuCheckbox,
  TslDropdownMenuRadio,
  TslDropdownMenuGroup,
  TslDropdownMenuLabel,
  TslDropdownMenuSeparator,
  TslDropdownMenuShortcut,
] as const;
