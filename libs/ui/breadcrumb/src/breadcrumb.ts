import { ChangeDetectionStrategy, Component, computed, Directive, input } from '@angular/core';
import { LucideChevronRight, LucideEllipsis } from '@lucide/angular';
import { cn, type ClassValue } from '@tassili/ui/core';
import { TslIcon } from '@tassili/ui/icon';

/**
 * Shows where the current page sits in the site hierarchy.
 *
 * ```html
 * <nav tslBreadcrumb>
 *   <ol tslBreadcrumbList>
 *     <li tslBreadcrumbItem><a tslBreadcrumbLink routerLink="/">Home</a></li>
 *     <li tslBreadcrumbSeparator></li>
 *     <li tslBreadcrumbItem><a tslBreadcrumbLink routerLink="/projects">Projects</a></li>
 *     <li tslBreadcrumbSeparator></li>
 *     <li tslBreadcrumbItem><span tslBreadcrumbPage>Atlas</span></li>
 *   </ol>
 * </nav>
 * ```
 */
@Directive({
  selector: 'nav[tslBreadcrumb]',
  host: { 'data-slot': 'breadcrumb', '[attr.aria-label]': 'ariaLabel()' },
})
export class TslBreadcrumb {
  readonly ariaLabel = input('Breadcrumb', { alias: 'aria-label' });
}

@Directive({
  selector: 'ol[tslBreadcrumbList]',
  host: { 'data-slot': 'breadcrumb-list', '[class]': 'computedClass()' },
})
export class TslBreadcrumbList {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      'flex flex-wrap items-center gap-1.5 text-sm break-words text-muted-foreground',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: 'li[tslBreadcrumbItem]',
  host: { 'data-slot': 'breadcrumb-item', class: 'inline-flex items-center gap-1.5' },
})
export class TslBreadcrumbItem {}

/** A link to an ancestor page. Works with `href` or `routerLink`. */
@Directive({
  selector: 'a[tslBreadcrumbLink]',
  host: {
    'data-slot': 'breadcrumb-link',
    class: 'rounded-xs transition-colors duration-fast hover:text-foreground focus-ring',
  },
})
export class TslBreadcrumbLink {}

/** The current page: not a link, announced as the current location. */
@Directive({
  selector: '[tslBreadcrumbPage]',
  host: {
    'data-slot': 'breadcrumb-page',
    'aria-current': 'page',
    class: 'font-medium text-foreground',
  },
})
export class TslBreadcrumbPage {}

/** Chevron between items; hidden from assistive tech and mirrored in RTL. */
@Component({
  selector: 'li[tslBreadcrumbSeparator]',
  imports: [TslIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'breadcrumb-separator',
    role: 'presentation',
    'aria-hidden': 'true',
    class: 'inline-flex items-center text-muted-foreground/70',
  },
  template: `<ng-content><tsl-icon [icon]="icon" size="sm" mirrorInRtl /></ng-content>`,
})
export class TslBreadcrumbSeparator {
  protected readonly icon = LucideChevronRight;
}

/** Stands in for collapsed items; pair it with a menu that lists them. */
@Component({
  selector: 'tsl-breadcrumb-ellipsis',
  imports: [TslIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'breadcrumb-ellipsis',
    class: 'inline-flex size-6 items-center justify-center',
  },
  template: `<tsl-icon [icon]="icon" /><span class="sr-only">{{ label() }}</span>`,
})
export class TslBreadcrumbEllipsis {
  protected readonly icon = LucideEllipsis;
  readonly label = input('More pages');
}

export const TslBreadcrumbImports = [
  TslBreadcrumb,
  TslBreadcrumbList,
  TslBreadcrumbItem,
  TslBreadcrumbLink,
  TslBreadcrumbPage,
  TslBreadcrumbSeparator,
  TslBreadcrumbEllipsis,
] as const;
