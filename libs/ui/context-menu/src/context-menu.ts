import { CdkContextMenuTrigger } from '@angular/cdk/menu';
import {
  booleanAttribute,
  computed,
  Directive,
  effect,
  forwardRef,
  inject,
  input,
} from '@angular/core';
import {
  createMenuPosition,
  MENU_SIDE,
  type MenuAlign,
  type MenuSide,
} from '@spartan-ng/brain/core';

/**
 * Opens a menu on right-click (or the context-menu key / Shift+F10) inside an area.
 * The menu itself is a regular `tsl-dropdown-menu`.
 *
 * ```html
 * <div [tslContextMenuTrigger]="menu" class="…">Right-click a file</div>
 * <ng-template #menu>
 *   <tsl-dropdown-menu class="w-48">
 *     <button tslDropdownMenuItem>Rename</button>
 *     <button tslDropdownMenuItem variant="destructive">Delete</button>
 *   </tsl-dropdown-menu>
 * </ng-template>
 * ```
 *
 * Context menus are hard to discover: always offer the same actions somewhere visible too.
 */
@Directive({
  selector: '[tslContextMenuTrigger]',
  providers: [{ provide: MENU_SIDE, useExisting: forwardRef(() => TslContextMenuTrigger) }],
  hostDirectives: [
    {
      directive: CdkContextMenuTrigger,
      inputs: [
        'cdkContextMenuTriggerFor: tslContextMenuTrigger',
        'cdkContextMenuTriggerData: tslContextMenuTriggerData',
        'cdkContextMenuDisabled: disabled',
      ],
      outputs: [
        'cdkContextMenuOpened: tslContextMenuOpened',
        'cdkContextMenuClosed: tslContextMenuClosed',
      ],
    },
  ],
  host: {
    'data-slot': 'context-menu-trigger',
    class: 'select-none',
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
})
export class TslContextMenuTrigger {
  private readonly cdkTrigger = inject(CdkContextMenuTrigger, { host: true });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly align = input<MenuAlign>('start');
  readonly side = input<MenuSide>('bottom');
  private readonly position = computed(() => createMenuPosition(this.align(), this.side()));

  constructor() {
    this.cdkTrigger.transformOriginSelector = '[data-slot="dropdown-menu"]';
    effect(() => {
      this.cdkTrigger.menuPosition = this.position();
    });
  }
}
