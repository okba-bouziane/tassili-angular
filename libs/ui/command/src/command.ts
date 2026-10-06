import { DOCUMENT } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  Directive,
  inject,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { LucideSearch } from '@lucide/angular';
import {
  BrnCommand,
  BrnCommandEmpty,
  BrnCommandGroup,
  BrnCommandInput,
  BrnCommandItem,
  BrnCommandList,
  BrnCommandSeparator,
} from '@spartan-ng/brain/command';
import { type BrnDialogState } from '@spartan-ng/brain/dialog';
import { cn, type ClassValue } from '@tassili/ui/core';
import { TslDialogImports } from '@tassili/ui/dialog';
import { TslIcon } from '@tassili/ui/icon';

/**
 * A searchable list of commands. Typing filters items; arrow keys move, Enter runs.
 *
 * ```html
 * <tsl-command>
 *   <tsl-command-input placeholder="Search commands" />
 *   <tsl-command-list>
 *     <div *tslCommandEmptyState tslCommandEmpty>No commands match.</div>
 *     <tsl-command-group>
 *       <tsl-command-group-label>Navigation</tsl-command-group-label>
 *       <button tslCommandItem value="Dashboard" (selected)="go('/')">Dashboard</button>
 *     </tsl-command-group>
 *   </tsl-command-list>
 * </tsl-command>
 * ```
 */
@Directive({
  selector: '[tslCommand],tsl-command',
  hostDirectives: [
    {
      directive: BrnCommand,
      inputs: ['id', 'filter', 'search', 'disabled'],
      outputs: ['valueChange', 'searchChange'],
    },
  ],
  host: {
    'data-slot': 'command',
    '[class]': 'computedClass()',
  },
})
export class TslCommand {
  /** Extra classes, merged so they can override the defaults. */
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      'flex size-full flex-col overflow-hidden rounded-xl bg-popover p-1 text-popover-foreground',
      this.userClass(),
    ),
  );
}

/** The search field. */
@Component({
  selector: 'tsl-command-input',
  imports: [BrnCommandInput, TslIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-slot': 'command-input-wrapper', class: 'block p-1 pb-0' },
  template: `
    <div
      class="flex h-control-md items-center gap-2 rounded-md border border-input bg-background px-2.5 focus-within:border-ring"
    >
      <tsl-icon [icon]="searchIcon" class="text-muted-foreground" />
      <input
        brnCommandInput
        data-slot="command-input"
        class="h-full w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
        [id]="inputId()"
        [placeholder]="placeholder()"
        [attr.aria-label]="ariaLabel() || placeholder() || null"
      />
    </div>
  `,
})
export class TslCommandInput {
  protected readonly searchIcon = LucideSearch;
  readonly inputId = input<string | undefined>();
  readonly placeholder = input('');
  /** Accessible name; defaults to the placeholder. */
  readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });
}

/** The scrollable result list. */
@Directive({
  selector: '[tslCommandList],tsl-command-list',
  hostDirectives: [{ directive: BrnCommandList, inputs: ['id'] }],
  host: {
    'data-slot': 'command-list',
    class: 'block max-h-80 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none',
  },
})
export class TslCommandList {}

/** Renders its element only when no item matches. Use as `*tslCommandEmptyState`. */
@Directive({
  selector: '[tslCommandEmptyState]',
  hostDirectives: [BrnCommandEmpty],
})
export class TslCommandEmptyState {}

/** Styles the empty-state message. */
@Directive({
  selector: '[tslCommandEmpty]',
  host: {
    'data-slot': 'command-empty',
    class: 'block py-8 text-center text-sm text-muted-foreground',
  },
})
export class TslCommandEmpty {}

/** A group of related commands; hidden when none of them match. */
@Directive({
  selector: '[tslCommandGroup],tsl-command-group',
  hostDirectives: [{ directive: BrnCommandGroup, inputs: ['id'] }],
  host: { 'data-slot': 'command-group', class: 'block overflow-hidden p-1 data-hidden:hidden' },
})
export class TslCommandGroup {}

/** Heading of a command group. */
@Directive({
  selector: '[tslCommandGroupLabel],tsl-command-group-label',
  host: {
    'data-slot': 'command-group-label',
    role: 'presentation',
    class: 'block px-2 py-1.5 text-xs font-medium text-muted-foreground',
  },
})
export class TslCommandGroupLabel {}

/** One command. `value` is what search matches against; `(selected)` runs it. */
@Directive({
  selector: 'button[tslCommandItem]',
  hostDirectives: [
    { directive: BrnCommandItem, inputs: ['value', 'disabled', 'id'], outputs: ['selected'] },
  ],
  host: {
    'data-slot': 'command-item',
    '[class]': 'computedClass()',
  },
})
export class TslCommandItem {
  /** Extra classes, merged so they can override the defaults. */
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      'group/command-item relative flex w-full cursor-default items-center gap-2 rounded-md px-2 py-2 text-start text-sm outline-none select-none',
      'data-selected:bg-accent data-selected:text-accent-foreground',
      'data-disabled:pointer-events-none data-disabled:opacity-50 data-hidden:hidden',
      "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      this.userClass(),
    ),
  );
}

/** Divider between groups; hidden while searching. */
@Directive({
  selector: '[tslCommandSeparator],tsl-command-separator',
  hostDirectives: [BrnCommandSeparator],
  host: {
    'data-slot': 'command-separator',
    class: '-mx-1 my-1 block h-px bg-border data-hidden:hidden',
  },
})
export class TslCommandSeparator {}

/** Keyboard shortcut hint at the end of an item. */
@Directive({
  selector: '[tslCommandShortcut],tsl-command-shortcut',
  host: {
    'data-slot': 'command-shortcut',
    class:
      'ms-auto ps-4 text-xs tracking-wide text-muted-foreground group-data-selected/command-item:text-accent-foreground',
  },
})
export class TslCommandShortcut {}

/**
 * A command palette in a modal dialog.
 *
 * ```html
 * <tsl-command-dialog hotkey="k" [(state)]="paletteState">
 *   <tsl-command>…</tsl-command>
 * </tsl-command-dialog>
 * ```
 *
 * With `hotkey="k"`, ⌘K (macOS) or Ctrl+K toggles the palette from anywhere on the page.
 */
@Component({
  selector: 'tsl-command-dialog',
  imports: [TslDialogImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tsl-dialog [state]="currentState()" (stateChanged)="onStateChanged($event)">
      <tsl-dialog-content
        *tslDialogPortal="let ctx"
        [class]="contentClass()"
        [showCloseButton]="showCloseButton()"
      >
        <tsl-dialog-header class="sr-only">
          <h2 tslDialogTitle>{{ title() }}</h2>
          <p tslDialogDescription>{{ description() }}</p>
        </tsl-dialog-header>
        <ng-content />
      </tsl-dialog-content>
    </tsl-dialog>
  `,
})
export class TslCommandDialog {
  private readonly document = inject(DOCUMENT);

  readonly title = input('Command palette');
  readonly description = input('Search for a page or an action to run.');
  /** Open state; supports `[(state)]`. */
  readonly state = input<BrnDialogState>('closed');
  readonly stateChange = output<BrnDialogState>();
  /** Letter that toggles the palette with ⌘ or Ctrl (e.g. `k`). */
  readonly hotkey = input<string | null>(null);
  readonly showCloseButton = input(false, { transform: booleanAttribute });
  /** Extra classes for the dialog panel. */
  readonly dialogContentClass = input<ClassValue>('');

  protected readonly currentState = linkedSignal(this.state);
  protected readonly contentClass = computed(() =>
    cn('max-w-xl gap-0 overflow-hidden p-0', this.dialogContentClass()),
  );

  constructor() {
    const onKeydown = (event: KeyboardEvent) => {
      const key = this.hotkey();
      if (
        !key ||
        event.key.toLowerCase() !== key.toLowerCase() ||
        !(event.metaKey || event.ctrlKey)
      )
        return;
      event.preventDefault();
      this.onStateChanged(this.currentState() === 'open' ? 'closed' : 'open');
    };
    this.document.addEventListener('keydown', onKeydown);
    inject(DestroyRef).onDestroy(() => this.document.removeEventListener('keydown', onKeydown));
  }

  /** Opens the palette. */
  open(): void {
    this.onStateChanged('open');
  }

  /** Closes the palette. */
  close(): void {
    this.onStateChanged('closed');
  }

  protected onStateChanged(state: BrnDialogState): void {
    this.currentState.set(state);
    this.stateChange.emit(state);
  }
}

export const TslCommandImports = [
  TslCommand,
  TslCommandInput,
  TslCommandList,
  TslCommandEmptyState,
  TslCommandEmpty,
  TslCommandGroup,
  TslCommandGroupLabel,
  TslCommandItem,
  TslCommandSeparator,
  TslCommandShortcut,
  TslCommandDialog,
] as const;
