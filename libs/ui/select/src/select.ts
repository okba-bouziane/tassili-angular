import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  inject,
  input,
} from '@angular/core';
import { LucideCheck, LucideChevronDown, LucideChevronUp } from '@lucide/angular';
import { BrnFieldControlDescribedBy } from '@spartan-ng/brain/field';
import {
  BrnPopover,
  BrnPopoverContent,
  provideBrnPopoverConfig,
  provideBrnPopoverDefaultOptions,
} from '@spartan-ng/brain/popover';
import {
  BrnSelect,
  BrnSelectContent,
  BrnSelectGroup,
  BrnSelectItem,
  BrnSelectLabel,
  BrnSelectList,
  BrnSelectPlaceholder,
  BrnSelectScrollDown,
  BrnSelectScrollUp,
  BrnSelectSeparator,
  BrnSelectTrigger,
  BrnSelectValue,
} from '@spartan-ng/brain/select';
import { cn, overlayItem, overlaySurface, type ClassValue } from '@tassili/ui/core';
import { TslIcon } from '@tassili/ui/icon';
import { fieldControlBase } from '@tassili/ui/input';
import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Root of a select. Holds the value and connects to forms.
 *
 * ```html
 * <tsl-select [(value)]="region">
 *   <tsl-select-trigger class="w-56" aria-label="Region">
 *     <tsl-select-value placeholder="Choose a region" />
 *   </tsl-select-trigger>
 *   <tsl-select-content *tslSelectPortal>
 *     <tsl-select-item value="eu">Europe</tsl-select-item>
 *     <tsl-select-item value="af">Africa</tsl-select-item>
 *   </tsl-select-content>
 * </tsl-select>
 * ```
 */
@Directive({
  selector: '[tslSelect],tsl-select',
  exportAs: 'tslSelect',
  providers: [
    provideBrnPopoverConfig({ align: 'start', sideOffset: 6 }),
    provideBrnPopoverDefaultOptions({ role: null }),
  ],
  hostDirectives: [
    {
      directive: BrnSelect,
      inputs: ['disabled', 'value', 'isItemEqualToValue', 'itemToString'],
      outputs: ['valueChange'],
    },
    {
      directive: BrnPopover,
      inputs: ['align', 'sideOffset', 'state'],
      outputs: ['stateChanged', 'closed'],
    },
  ],
  host: { class: 'block', 'data-slot': 'select' },
})
export class TslSelect {}

export const selectTriggerVariants = cva(
  [
    ...fieldControlBase,
    'flex cursor-pointer items-center gap-2 ps-3 pe-2 text-start whitespace-nowrap',
    'data-placeholder:text-muted-foreground',
    'data-[matches-spartan-invalid=true]:border-destructive',
    '*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2',
  ],
  {
    variants: {
      size: {
        sm: 'h-control-sm text-sm',
        md: 'h-control-md text-sm',
        lg: 'h-control-lg text-base',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

export type TslSelectTriggerSize = NonNullable<VariantProps<typeof selectTriggerVariants>['size']>;

/** The button that opens the select and shows the current value. */
@Component({
  selector: 'tsl-select-trigger',
  imports: [BrnSelectTrigger, BrnFieldControlDescribedBy, TslIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents', '[attr.aria-label]': 'null', '[attr.id]': 'null' },
  template: `
    <button
      brnSelectTrigger
      brnFieldControlDescribedBy
      data-slot="select-trigger"
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
export class TslSelectTrigger {
  private static nextId = 0;
  protected readonly chevron = LucideChevronDown;

  /** Id of the trigger button, for `<label for>`. */
  readonly buttonId = input(`tsl-select-trigger-${TslSelectTrigger.nextId++}`);
  readonly size = input<TslSelectTriggerSize>('md');
  readonly forceInvalid = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });
  /** Extra classes, merged so they can override the defaults. */
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly computedClass = computed(() =>
    cn(selectTriggerVariants({ size: this.size() }), this.userClass()),
  );
}

/** Shows the selected item's text, or the placeholder. */
@Directive({
  selector: '[tslSelectValue],tsl-select-value',
  hostDirectives: [{ directive: BrnSelectValue, inputs: ['placeholder'] }],
  host: {
    class: 'truncate data-hidden:hidden',
    '[attr.data-slot]': '!brn.hidden() ? "select-value" : null',
  },
})
export class TslSelectValue {
  protected readonly brn = inject(BrnSelectValue);
}

/** Custom placeholder content (shown when nothing is selected). */
@Directive({
  selector: '[tslSelectPlaceholder],tsl-select-placeholder',
  hostDirectives: [BrnSelectPlaceholder],
  host: { class: 'flex items-center gap-2 data-hidden:hidden', 'data-slot': 'select-placeholder' },
})
export class TslSelectPlaceholder {}

/** Renders the select content in an overlay. Use as `*tslSelectPortal`. */
@Directive({
  selector: '[tslSelectPortal]',
  hostDirectives: [{ directive: BrnPopoverContent, inputs: ['context', 'class'] }],
})
export class TslSelectPortal {}

@Component({
  selector: 'tsl-select-scroll-up',
  imports: [TslIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [BrnSelectScrollUp],
  host: {
    class:
      'sticky top-0 z-raised flex cursor-default items-center justify-center bg-popover py-1 data-hidden:hidden',
  },
  template: `<tsl-icon [icon]="icon" />`,
})
export class TslSelectScrollUp {
  protected readonly icon = LucideChevronUp;
}

@Component({
  selector: 'tsl-select-scroll-down',
  imports: [TslIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [BrnSelectScrollDown],
  host: {
    class:
      'sticky bottom-0 z-raised flex cursor-default items-center justify-center bg-popover py-1 data-hidden:hidden',
  },
  template: `<tsl-icon [icon]="icon" />`,
})
export class TslSelectScrollDown {
  protected readonly icon = LucideChevronDown;
}

/** The floating list of options. */
@Component({
  selector: 'tsl-select-content',
  imports: [TslSelectScrollUp, TslSelectScrollDown, BrnSelectList],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [BrnSelectContent],
  host: { '[class]': 'computedClass()', 'data-slot': 'select-content' },
  template: `
    @if (showScroll()) {
      <tsl-select-scroll-up />
    }
    <div brnSelectList class="flex flex-col p-1"><ng-content /></div>
    @if (showScroll()) {
      <tsl-select-scroll-down />
    }
  `,
})
export class TslSelectContent {
  /** Show scroll buttons when the list overflows. */
  readonly showScroll = input(false, { transform: booleanAttribute });
  /** Extra classes, merged so they can override the defaults. */
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly computedClass = computed(() =>
    cn(
      overlaySurface,
      'relative flex max-h-72 min-w-36 w-(--brn-select-width) flex-col overflow-x-hidden overflow-y-auto',
      this.userClass(),
    ),
  );
}

/** One option. Its content is the option's visible text. */
@Component({
  selector: 'tsl-select-item',
  imports: [TslIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: BrnSelectItem, inputs: ['id', 'disabled', 'value'] }],
  host: { '[class]': 'computedClass()', 'data-slot': 'select-item' },
  template: `
    <span class="flex min-w-0 items-center gap-2 truncate"><ng-content /></span>
    @if (brn.active()) {
      <tsl-icon [icon]="check" class="absolute end-2 text-primary" />
    }
  `,
})
export class TslSelectItem<T = unknown> {
  protected readonly brn = inject<BrnSelectItem<T>>(BrnSelectItem);
  protected readonly check = LucideCheck;
  /** Extra classes, merged so they can override the defaults. */
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() => cn(overlayItem, 'pe-8', this.userClass()));
}

/** Groups related options under a label. */
@Directive({
  selector: '[tslSelectGroup],tsl-select-group',
  hostDirectives: [BrnSelectGroup],
  host: { class: 'block py-1', 'data-slot': 'select-group' },
})
export class TslSelectGroup {}

/** Heading for a group of options. */
@Directive({
  selector: '[tslSelectLabel],tsl-select-label',
  hostDirectives: [{ directive: BrnSelectLabel, inputs: ['id'] }],
  host: {
    class: 'flex px-2 py-1.5 text-xs font-medium text-muted-foreground',
    'data-slot': 'select-label',
  },
})
export class TslSelectLabel {}

/** Divider between groups. */
@Directive({
  selector: '[tslSelectSeparator],tsl-select-separator',
  hostDirectives: [{ directive: BrnSelectSeparator, inputs: ['orientation'] }],
  host: {
    class: 'pointer-events-none -mx-1 my-1 block h-px bg-border',
    'data-slot': 'select-separator',
  },
})
export class TslSelectSeparator {}

export const TslSelectImports = [
  TslSelect,
  TslSelectTrigger,
  TslSelectValue,
  TslSelectPlaceholder,
  TslSelectPortal,
  TslSelectContent,
  TslSelectItem,
  TslSelectGroup,
  TslSelectLabel,
  TslSelectSeparator,
  TslSelectScrollUp,
  TslSelectScrollDown,
] as const;
