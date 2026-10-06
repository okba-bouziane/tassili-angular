import { computed, Directive, input } from '@angular/core';
import {
  BrnTabs,
  BrnTabsContent,
  BrnTabsContentLazy,
  BrnTabsList,
  BrnTabsTrigger,
} from '@spartan-ng/brain/tabs';
import { cn, type ClassValue } from '@tassili/ui/core';
import { cva } from 'class-variance-authority';

export type TslTabsVariant = 'line' | 'segmented';

/**
 * Switches between panels of related content in the same place.
 *
 * ```html
 * <tsl-tabs tab="overview">
 *   <tsl-tabs-list aria-label="Project sections">
 *     <button tslTabsTrigger="overview">Overview</button>
 *     <button tslTabsTrigger="activity">Activity</button>
 *   </tsl-tabs-list>
 *   <div tslTabsContent="overview">…</div>
 *   <div tslTabsContent="activity">…</div>
 * </tsl-tabs>
 * ```
 *
 * Arrow keys move between tabs (mirrored in RTL); with `activationMode="manual"`,
 * Enter or Space activates the focused tab.
 */
@Directive({
  selector: '[tslTabs],tsl-tabs',
  hostDirectives: [
    {
      directive: BrnTabs,
      inputs: ['orientation', 'activationMode', 'brnTabs: tab'],
      outputs: ['tabActivated'],
    },
  ],
  host: {
    'data-slot': 'tabs',
    '[class]': 'computedClass()',
  },
})
export class TslTabs {
  /** Key of the active tab (matches a `tslTabsTrigger` value). */
  readonly tab = input.required<string>();
  /** Extra classes, merged so they can override the defaults. */
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('group/tabs flex gap-3 data-[orientation=horizontal]:flex-col', this.userClass()),
  );
}

export const tabsListVariants = cva(
  'group/tabs-list inline-flex w-fit items-center text-muted-foreground group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col group-data-[orientation=vertical]/tabs:items-stretch',
  {
    variants: {
      variant: {
        line: 'gap-4 border-b group-data-[orientation=vertical]/tabs:gap-1 group-data-[orientation=vertical]/tabs:border-b-0 group-data-[orientation=vertical]/tabs:border-e',
        segmented:
          'h-control-md gap-1 rounded-lg bg-muted p-1 group-data-[orientation=vertical]/tabs:h-auto',
      },
    },
    defaultVariants: { variant: 'line' },
  },
);

/** The row of tab buttons. Give it an `aria-label`. */
@Directive({
  selector: '[tslTabsList],tsl-tabs-list',
  hostDirectives: [BrnTabsList],
  host: {
    'data-slot': 'tabs-list',
    '[attr.data-variant]': 'variant()',
    '[class]': 'computedClass()',
  },
})
export class TslTabsList {
  /** `line` (underline, default) or `segmented` (pill group). */
  readonly variant = input<TslTabsVariant>('line');
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(tabsListVariants({ variant: this.variant() }), this.userClass()),
  );
}

/** One tab button. Its value pairs it with a `tslTabsContent` panel. */
@Directive({
  selector: 'button[tslTabsTrigger]',
  hostDirectives: [
    { directive: BrnTabsTrigger, inputs: ['brnTabsTrigger: tslTabsTrigger', 'disabled'] },
  ],
  host: {
    'data-slot': 'tabs-trigger',
    '[class]': 'computedClass()',
  },
})
export class TslTabsTrigger {
  readonly triggerFor = input.required<string>({ alias: 'tslTabsTrigger' });
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly computedClass = computed(() =>
    cn(
      'relative inline-flex cursor-pointer items-center justify-center gap-1.5 text-sm font-medium whitespace-nowrap',
      'transition-colors duration-fast ease-out hover:text-foreground focus-ring',
      'disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground',
      "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      'group-data-[orientation=vertical]/tabs:justify-start',
      // line: an indigo bar under (or beside) the active tab
      'group-data-[variant=line]/tabs-list:h-control-md group-data-[variant=line]/tabs-list:px-0.5',
      'group-data-[variant=line]/tabs-list:after:absolute group-data-[variant=line]/tabs-list:after:bg-primary group-data-[variant=line]/tabs-list:after:opacity-0',
      'group-data-[variant=line]/tabs-list:after:transition-opacity group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100',
      'group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:-bottom-px group-data-[orientation=horizontal]/tabs:after:h-0.5',
      'group-data-[orientation=vertical]/tabs:group-data-[variant=line]/tabs-list:pe-3 group-data-[orientation=vertical]/tabs:after:inset-y-1 group-data-[orientation=vertical]/tabs:after:-end-px group-data-[orientation=vertical]/tabs:after:w-0.5',
      // segmented: the active tab lifts onto the surface
      'group-data-[variant=segmented]/tabs-list:h-full group-data-[variant=segmented]/tabs-list:flex-1 group-data-[variant=segmented]/tabs-list:rounded-md group-data-[variant=segmented]/tabs-list:px-3',
      'group-data-[variant=segmented]/tabs-list:data-[state=active]:bg-background group-data-[variant=segmented]/tabs-list:data-[state=active]:shadow-xs',
      this.userClass(),
    ),
  );
}

/** The panel shown when its tab is active. */
@Directive({
  selector: '[tslTabsContent]',
  hostDirectives: [{ directive: BrnTabsContent, inputs: ['brnTabsContent: tslTabsContent'] }],
  host: {
    'data-slot': 'tabs-content',
    class: 'flex-1 text-sm outline-none focus-visible:outline-2 focus-visible:outline-ring',
  },
})
export class TslTabsContent {
  readonly contentFor = input.required<string>({ alias: 'tslTabsContent' });
}

/** Renders panel content only once its tab is first opened: `<ng-template tslTabsContentLazy>`. */
@Directive({
  selector: 'ng-template[tslTabsContentLazy]',
  hostDirectives: [BrnTabsContentLazy],
})
export class TslTabsContentLazy {}

export const TslTabsImports = [
  TslTabs,
  TslTabsList,
  TslTabsTrigger,
  TslTabsContent,
  TslTabsContentLazy,
] as const;
