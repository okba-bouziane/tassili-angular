import { DOCUMENT } from '@angular/common';
import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';

const MOBILE_QUERY = '(max-width: 767px)';

/**
 * Shared sidebar state, provided by `tsl-sidebar-provider`.
 *
 * Desktop: `expanded` or `collapsed` (icon rail), remembered across visits.
 * Mobile (< 768px): an off-canvas panel that is either open or closed.
 */
@Injectable()
export class TslSidebarState {
  private readonly document = inject(DOCUMENT);
  private readonly media = this.document.defaultView?.matchMedia?.(MOBILE_QUERY) ?? null;
  private storageKey: string | null = 'tsl-sidebar-collapsed';

  readonly isMobile = signal(this.media?.matches ?? false);
  readonly collapsed = signal(false);
  readonly openMobile = signal(false);
  /** Id of the sidebar element, for `aria-controls`. */
  readonly sidebarId = `tsl-sidebar-${Math.random().toString(36).slice(2, 8)}`;

  /** What the sidebar shows right now. */
  readonly state = computed<'expanded' | 'collapsed'>(() =>
    this.isMobile()
      ? this.openMobile()
        ? 'expanded'
        : 'collapsed'
      : this.collapsed()
        ? 'collapsed'
        : 'expanded',
  );
  /** Whether the sidebar is currently showing its full content. */
  readonly open = computed(() => (this.isMobile() ? this.openMobile() : !this.collapsed()));

  constructor() {
    const onChange = (event: MediaQueryListEvent) => {
      this.isMobile.set(event.matches);
      this.openMobile.set(false);
    };
    this.media?.addEventListener('change', onChange);
    inject(DestroyRef).onDestroy(() => this.media?.removeEventListener('change', onChange));
  }

  /** @internal Called by the provider with its inputs. */
  configure(options: { storageKey: string | null; defaultCollapsed: boolean }): void {
    this.storageKey = options.storageKey;
    let stored: string | null = null;
    try {
      stored = options.storageKey
        ? (this.document.defaultView?.localStorage.getItem(options.storageKey) ?? null)
        : null;
    } catch {
      // Storage can be blocked; fall back to the default.
    }
    this.collapsed.set(stored === null ? options.defaultCollapsed : stored === 'true');
  }

  toggle(): void {
    if (this.isMobile()) {
      this.openMobile.update((open) => !open);
    } else {
      this.setCollapsed(!this.collapsed());
    }
  }

  setCollapsed(collapsed: boolean): void {
    this.collapsed.set(collapsed);
    try {
      if (this.storageKey)
        this.document.defaultView?.localStorage.setItem(this.storageKey, String(collapsed));
    } catch {
      // Persistence is best-effort.
    }
  }

  closeMobile(): void {
    this.openMobile.set(false);
  }
}
