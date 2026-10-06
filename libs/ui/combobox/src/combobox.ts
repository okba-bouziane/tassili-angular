import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  inject,
  input,
} from '@angular/core';
import { LucideCheck, LucideChevronDown, LucideX } from '@lucide/angular';
import {
  BrnCombobox,
  BrnComboboxAnchor,
  BrnComboboxChip,
  BrnComboboxChipInput,
  BrnComboboxChipRemove,
  BrnComboboxClear,
  BrnComboboxContent,
  BrnComboboxEmpty,
  BrnComboboxGroup,
  BrnComboboxInput,
  BrnComboboxItem,
  BrnComboboxLabel,
  BrnComboboxList,
  BrnComboboxMultiple,
  BrnComboboxPlaceholder,
  BrnComboboxPopoverTrigger,
  BrnComboboxSeparator,
  BrnComboboxStatus,
  BrnComboboxTrigger,
  BrnComboboxValue,
  BrnComboboxValues,
  injectBrnComboboxBase,
} from '@spartan-ng/brain/combobox';
import { BrnFieldControlDescribedBy } from '@spartan-ng/brain/field';
import {
  BrnPopover,
  BrnPopoverContent,
  provideBrnPopoverConfig,
  provideBrnPopoverDefaultOptions,
} from '@spartan-ng/brain/popover';
import { TslButton } from '@tassili/ui/button';
import { cn, overlayItem, overlaySurface, type ClassValue } from '@tassili/ui/core';
import { TslIcon } from '@tassili/ui/icon';
import { inputVariants } from '@tassili/ui/input';
import { selectTriggerVariants } from '@tassili/ui/select';

const comboboxInputs = [
  'autoHighlight',
  'closeOnSelect',
  'disabled',
  'filter',
  'search',
  'value',
  'itemToString',
  'filterOptions',
  'isItemEqualToValue',
];

const popoverProviders = [
  provideBrnPopoverConfig({ align: 'start', sideOffset: 6 }),
  provideBrnPopoverDefaultOptions({ role: null }),
];

const popoverHostDirective = {
  directive: BrnPopover,
  inputs: ['align', 'sideOffset', 'state'],
  outputs: ['stateChanged', 'closed'],
};

/**
 * Root of a single-value combobox: a text field that filters a list of options.
 *
 * ```html
 * <tsl-combobox [(value)]="country">
 *   <tsl-combobox-input placeholder="Search countries" aria-label="Country" />
 *   <tsl-combobox-content *tslComboboxPortal>
 *     <tsl-combobox-empty>No countries match.</tsl-combobox-empty>
 *     <div tslComboboxList>
 *       @for (country of countries; track country) {
 *         <tsl-combobox-item [value]="country">{{ country }}</tsl-combobox-item>
 *       }
 *     </div>
 *   </tsl-combobox-content>
 * </tsl-combobox>
 * ```
 *
 * For object values, pass `itemToString` so typing can filter and the input can show the label.
 */
@Directive({
  selector: '[tslCombobox],tsl-combobox',
  exportAs: 'tslCombobox',
  providers: popoverProviders,
  hostDirectives: [
    { directive: BrnCombobox, inputs: comboboxInputs, outputs: ['searchChange', 'valueChange'] },
    popoverHostDirective,
  ],
  host: { class: 'block', 'data-slot': 'combobox' },
})
export class TslCombobox {}

/** Root of a multi-value combobox, shown as removable chips. */
@Directive({
  selector: '[tslComboboxMultiple],tsl-combobox-multiple',
  exportAs: 'tslComboboxMultiple',
  providers: popoverProviders,
  hostDirectives: [
    {
      directive: BrnComboboxMultiple,
      inputs: comboboxInputs,
      outputs: ['searchChange', 'valueChange'],
    },
    popoverHostDirective,
  ],
  host: { class: 'block', 'data-slot': 'combobox' },
})
export class TslComboboxMultiple {}

/** The text field of a combobox, with an optional chevron and clear button. */
@Component({
  selector: 'tsl-combobox-input',
  imports: [BrnComboboxInput, BrnComboboxPopoverTrigger, BrnComboboxClear, TslButton, TslIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [BrnComboboxAnchor],
  host: {
    'data-slot': 'combobox-input',
    class: 'relative flex w-full items-center',
    '[attr.aria-label]': 'null',
    '[attr.id]': 'null',
  },
  template: `
    <input
      brnComboboxInput
      #comboboxInput="brnComboboxInput"
      brnComboboxPopoverTrigger
      [closeOnTriggerClick]="false"
      [id]="inputId()"
      [placeholder]="placeholder()"
      [forceInvalid]="forceInvalid()"
      [attr.aria-label]="ariaLabel()"
      [class]="inputClass()"
    />
    <span class="absolute end-1 flex items-center gap-0.5">
      @if (showClear()) {
        <button
          *brnComboboxClear
          tslButton
          variant="ghost"
          size="icon-sm"
          class="size-7 text-muted-foreground"
          data-slot="combobox-clear"
          [disabled]="comboboxInput.disabled()"
          [attr.aria-label]="clearLabel()"
        >
          <tsl-icon [icon]="clearIcon" />
        </button>
      }
      @if (showTrigger()) {
        <button
          brnComboboxPopoverTrigger
          tslButton
          variant="ghost"
          size="icon-sm"
          tabindex="-1"
          class="size-7 text-muted-foreground"
          [disabled]="comboboxInput.disabled()"
          [attr.aria-label]="triggerLabel()"
        >
          <tsl-icon [icon]="chevron" />
        </button>
      }
    </span>
    <ng-content />
  `,
})
export class TslComboboxInput {
  private static nextId = 0;
  protected readonly chevron = LucideChevronDown;
  protected readonly clearIcon = LucideX;

  /** Id of the text field, for `<label for>`. */
  readonly inputId = input(`tsl-combobox-input-${TslComboboxInput.nextId++}`);
  readonly placeholder = input('');
  readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });
  /** Show the chevron that opens the list. */
  readonly showTrigger = input(true, { transform: booleanAttribute });
  /** Show a button that clears the value once one is selected. */
  readonly showClear = input(false, { transform: booleanAttribute });
  readonly forceInvalid = input(false, { transform: booleanAttribute });
  readonly triggerLabel = input('Show options');
  readonly clearLabel = input('Clear');

  protected readonly inputClass = computed(() =>
    cn(
      inputVariants({ size: 'md' }),
      'data-[matches-spartan-invalid=true]:border-destructive',
      this.showTrigger() && this.showClear()
        ? 'pe-16'
        : this.showTrigger() || this.showClear()
          ? 'pe-9'
          : '',
    ),
  );
}

/** A button trigger that opens the list (use with a search input inside the content). */
@Component({
  selector: 'tsl-combobox-trigger',
  imports: [
    BrnComboboxTrigger,
    BrnComboboxAnchor,
    BrnComboboxPopoverTrigger,
    BrnFieldControlDescribedBy,
    TslIcon,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents', '[attr.aria-label]': 'null', '[attr.id]': 'null' },
  template: `
    <button
      brnComboboxTrigger
      brnComboboxAnchor
      brnComboboxPopoverTrigger
      brnFieldControlDescribedBy
      data-slot="combobox-trigger"
      [id]="buttonId()"
      [forceInvalid]="forceInvalid()"
      [attr.aria-label]="ariaLabel()"
      [class]="computedClass()"
    >
      <ng-content />
      <tsl-icon [icon]="chevron" class="ms-auto text-muted-foreground" />
    </button>
  `,
})
export class TslComboboxTrigger {
  private static nextId = 0;
  protected readonly chevron = LucideChevronDown;

  /** Id of the trigger button, for `<label for>`. */
  readonly buttonId = input(`tsl-combobox-trigger-${TslComboboxTrigger.nextId++}`);
  readonly forceInvalid = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });
  /** Extra classes, merged so they can override the defaults. */
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly computedClass = computed(() =>
    cn(selectTriggerVariants({ size: 'md' }), this.userClass()),
  );
}

/** Shows the selected value (or placeholder) inside a combobox trigger. */
@Directive({
  selector: '[tslComboboxValue],tsl-combobox-value',
  hostDirectives: [{ directive: BrnComboboxValue, inputs: ['placeholder'] }],
  host: { class: 'truncate data-hidden:hidden', 'data-slot': 'combobox-value' },
})
export class TslComboboxValue {}

/** Custom placeholder content for a combobox trigger. */
@Directive({
  selector: '[tslComboboxPlaceholder],tsl-combobox-placeholder',
  hostDirectives: [BrnComboboxPlaceholder],
  host: {
    class: 'flex items-center gap-2 text-muted-foreground data-hidden:hidden',
    'data-slot': 'combobox-placeholder',
  },
})
export class TslComboboxPlaceholder {}

/** Renders the combobox content in an overlay. Use as `*tslComboboxPortal`. */
@Directive({
  selector: '[tslComboboxPortal]',
  hostDirectives: [{ directive: BrnPopoverContent, inputs: ['context', 'class'] }],
})
export class TslComboboxPortal {}

/** The floating panel of a combobox. */
@Directive({
  selector: '[tslComboboxContent],tsl-combobox-content',
  hostDirectives: [{ directive: BrnComboboxContent, inputs: ['id'] }],
  host: { '[class]': 'computedClass()', 'data-slot': 'combobox-content' },
})
export class TslComboboxContent {
  /** Extra classes, merged so they can override the defaults. */
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      overlaySurface,
      'group/combobox-content relative flex max-h-72 min-w-36 w-(--brn-combobox-width) flex-col overflow-hidden',
      '[&_[data-slot=combobox-input]]:p-1 [&_[data-slot=combobox-input]]:pb-0',
      this.userClass(),
    ),
  );
}

/** The scrollable list of options. */
@Directive({
  selector: '[tslComboboxList]',
  hostDirectives: [{ directive: BrnComboboxList, inputs: ['id'] }],
  host: {
    class: 'max-h-64 scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0',
    'data-slot': 'combobox-list',
  },
})
export class TslComboboxList {}

/** Shown when no option matches the search. */
@Directive({
  selector: '[tslComboboxEmpty],tsl-combobox-empty',
  hostDirectives: [BrnComboboxEmpty],
  host: {
    class:
      'hidden w-full items-center justify-center py-6 text-center text-sm text-muted-foreground group-data-empty/combobox-content:flex',
    'data-slot': 'combobox-empty',
  },
})
export class TslComboboxEmpty {}

/** Live status text (loading, result count) announced to assistive tech. */
@Directive({
  selector: '[tslComboboxStatus],tsl-combobox-status',
  hostDirectives: [BrnComboboxStatus],
  host: {
    class:
      'flex w-full items-center justify-center px-3 py-2 text-center text-sm text-muted-foreground',
    'data-slot': 'combobox-status',
  },
})
export class TslComboboxStatus {}

/** One option. Its content is the option's visible text. */
@Component({
  selector: 'tsl-combobox-item',
  imports: [TslIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: BrnComboboxItem, inputs: ['id', 'disabled', 'value'] }],
  host: { '[class]': 'computedClass()', 'data-slot': 'combobox-item' },
  template: `
    <span class="flex min-w-0 items-center gap-2 truncate"><ng-content /></span>
    @if (brn.active()) {
      <tsl-icon [icon]="check" class="absolute end-2 text-primary" />
    }
  `,
})
export class TslComboboxItem<T = unknown> {
  protected readonly brn = inject<BrnComboboxItem<T>>(BrnComboboxItem);
  protected readonly check = LucideCheck;
  /** Extra classes, merged so they can override the defaults. */
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(overlayItem, 'pe-8 data-hidden:hidden', this.userClass()),
  );
}

/** Groups related options; hidden automatically when none of them match. */
@Directive({
  selector: '[tslComboboxGroup],tsl-combobox-group',
  hostDirectives: [BrnComboboxGroup],
  host: { class: 'block data-hidden:hidden', 'data-slot': 'combobox-group' },
})
export class TslComboboxGroup {}

/** Heading for a group of options. */
@Directive({
  selector: '[tslComboboxLabel],tsl-combobox-label',
  hostDirectives: [{ directive: BrnComboboxLabel, inputs: ['id'] }],
  host: {
    class: 'flex px-2 py-1.5 text-xs font-medium text-muted-foreground',
    'data-slot': 'combobox-label',
  },
})
export class TslComboboxLabel {}

/** Divider between groups. */
@Directive({
  selector: '[tslComboboxSeparator],tsl-combobox-separator',
  hostDirectives: [{ directive: BrnComboboxSeparator, inputs: ['orientation'] }],
  host: { class: '-mx-1 my-1 block h-px bg-border', 'data-slot': 'combobox-separator' },
})
export class TslComboboxSeparator {}

/** Field that holds the chips and the text input of a multi-value combobox. */
@Directive({
  selector: '[tslComboboxChips],tsl-combobox-chips',
  hostDirectives: [BrnComboboxAnchor, BrnComboboxPopoverTrigger],
  host: {
    '[class]': 'computedClass()',
    'data-slot': 'combobox-chips',
    '[attr.data-matches-spartan-invalid]': 'shownInvalid() ? "true" : null',
  },
})
export class TslComboboxChips {
  private readonly combobox = injectBrnComboboxBase();
  readonly forceInvalid = input(false, { transform: booleanAttribute });
  /** Extra classes, merged so they can override the defaults. */
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly shownInvalid = computed(
    () => this.forceInvalid() || !!this.combobox.controlState?.()?.spartanInvalid,
  );
  protected readonly computedClass = computed(() =>
    cn(
      'flex min-h-(--tsl-control-md) w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-2 py-1 text-sm shadow-xs',
      'transition-[border-color,box-shadow] duration-fast ease-out',
      'focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/25',
      this.shownInvalid() && 'border-destructive',
      this.userClass(),
    ),
  );
}

/** Repeats a template for each selected value: `<ng-template tslComboboxValues let-values>`. */
@Directive({
  selector: '[tslComboboxValues]',
  hostDirectives: [BrnComboboxValues],
})
export class TslComboboxValues {}

/** One selected value in a multi-value combobox. */
@Component({
  selector: 'tsl-combobox-chip',
  imports: [BrnComboboxChipRemove, TslIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: BrnComboboxChip, inputs: ['value'] }],
  host: {
    class:
      'inline-flex h-6 max-w-full items-center gap-1 rounded-sm bg-secondary px-1.5 text-xs font-medium whitespace-nowrap text-secondary-foreground has-data-[slot=combobox-chip-remove]:pe-0.5',
    'data-slot': 'combobox-chip',
  },
  template: `
    <span class="truncate"><ng-content /></span>
    @if (showRemove()) {
      <button
        brnComboboxChipRemove
        data-slot="combobox-chip-remove"
        class="inline-flex size-5 items-center justify-center rounded-xs opacity-60 transition-opacity duration-fast hover:opacity-100"
        [attr.aria-label]="removeLabel()"
      >
        <tsl-icon [icon]="removeIcon" size="xs" />
      </button>
    }
  `,
})
export class TslComboboxChip {
  protected readonly removeIcon = LucideX;
  readonly showRemove = input(true, { transform: booleanAttribute });
  /** Accessible name of the remove button, e.g. "Remove Angular". Backspace in the input also removes. */
  readonly removeLabel = input('Remove');
}

/** Text input inside `tsl-combobox-chips`. */
@Directive({
  selector: 'input[tslComboboxChipInput]',
  hostDirectives: [{ directive: BrnComboboxChipInput, inputs: ['id', 'aria-invalid'] }],
  host: {
    class: 'h-6 min-w-16 flex-1 bg-transparent outline-none placeholder:text-muted-foreground',
    'data-slot': 'combobox-chip-input',
  },
})
export class TslComboboxChipInput {}

export const TslComboboxImports = [
  TslCombobox,
  TslComboboxMultiple,
  TslComboboxInput,
  TslComboboxTrigger,
  TslComboboxValue,
  TslComboboxPlaceholder,
  TslComboboxPortal,
  TslComboboxContent,
  TslComboboxList,
  TslComboboxEmpty,
  TslComboboxStatus,
  TslComboboxItem,
  TslComboboxGroup,
  TslComboboxLabel,
  TslComboboxSeparator,
  TslComboboxChips,
  TslComboboxValues,
  TslComboboxChip,
  TslComboboxChipInput,
] as const;
