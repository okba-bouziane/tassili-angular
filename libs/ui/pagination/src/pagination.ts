import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  numberAttribute,
} from '@angular/core';
import { LucideChevronLeft, LucideChevronRight, LucideEllipsis } from '@lucide/angular';
import { buttonVariants } from '@tassili/ui/button';
import { cn, type ClassValue } from '@tassili/ui/core';
import { TslIcon } from '@tassili/ui/icon';
import { paginationRange } from './pagination-range';

/**
 * Moves through pages of results.
 *
 * ```html
 * <tsl-pagination [(page)]="page" [pageCount]="12" />
 * ```
 *
 * Shows the first and last page, the current page and its neighbours, and collapses
 * the rest. Each button is labelled ("Page 4"), the current one has `aria-current`.
 */
@Component({
  selector: 'tsl-pagination',
  imports: [TslIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-slot': 'pagination', class: 'block' },
  template: `
    <nav [attr.aria-label]="label()" [class]="computedClass()">
      <ul class="flex flex-row items-center gap-1">
        <li>
          <button
            type="button"
            [class]="edgeClass"
            [disabled]="page() <= 1"
            [attr.aria-label]="previousLabel()"
            (click)="go(page() - 1)"
          >
            <tsl-icon [icon]="icons.previous" mirrorInRtl />
            <span class="hidden sm:inline">{{ previousText() }}</span>
          </button>
        </li>
        @for (item of items(); track $index) {
          <li>
            @if (item === 'ellipsis') {
              <span
                aria-hidden="true"
                class="flex size-control-md items-center justify-center text-muted-foreground"
              >
                <tsl-icon [icon]="icons.ellipsis" />
              </span>
            } @else {
              <button
                type="button"
                [class]="item === page() ? currentClass : pageClass"
                [attr.aria-current]="item === page() ? 'page' : null"
                [attr.aria-label]="pageLabel() + ' ' + item"
                (click)="go(item)"
              >
                {{ item }}
              </button>
            }
          </li>
        }
        <li>
          <button
            type="button"
            [class]="edgeClass"
            [disabled]="page() >= pageCount()"
            [attr.aria-label]="nextLabel()"
            (click)="go(page() + 1)"
          >
            <span class="hidden sm:inline">{{ nextText() }}</span>
            <tsl-icon [icon]="icons.next" mirrorInRtl />
          </button>
        </li>
      </ul>
    </nav>
  `,
})
export class TslPagination {
  protected readonly icons = {
    previous: LucideChevronLeft,
    next: LucideChevronRight,
    ellipsis: LucideEllipsis,
  };

  /** Current page, starting at 1. Supports `[(page)]`. */
  readonly page = model(1);
  /** Total number of pages. */
  readonly pageCount = input.required({ transform: numberAttribute });
  /** Pages shown on each side of the current one. */
  readonly siblings = input(1, { transform: numberAttribute });
  readonly label = input('Pagination');
  readonly pageLabel = input('Page');
  readonly previousLabel = input('Previous page');
  readonly nextLabel = input('Next page');
  readonly previousText = input('Previous');
  readonly nextText = input('Next');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly items = computed(() =>
    paginationRange(this.page(), this.pageCount(), this.siblings()),
  );
  protected readonly computedClass = computed(() =>
    cn('flex w-full justify-center', this.userClass()),
  );

  protected readonly pageClass = cn(
    buttonVariants({ variant: 'ghost', size: 'icon' }),
    'tabular-nums',
  );
  protected readonly currentClass = cn(
    buttonVariants({ variant: 'outline', size: 'icon' }),
    'tabular-nums',
  );
  protected readonly edgeClass = cn(
    buttonVariants({ variant: 'ghost', size: 'md' }),
    'gap-1 px-2.5',
  );

  protected go(target: number): void {
    const next = Math.min(Math.max(target, 1), this.pageCount());
    if (next !== this.page()) this.page.set(next);
  }
}
