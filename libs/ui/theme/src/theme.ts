import { DOCUMENT } from '@angular/common';
import {
  computed,
  DestroyRef,
  effect,
  inject,
  Injectable,
  InjectionToken,
  makeEnvironmentProviders,
  signal,
  type EnvironmentProviders,
} from '@angular/core';

/** `'system'` follows the operating system; any other value is a `data-theme` name. */
export type TslThemePreference = 'system' | (string & {});

export interface TslThemeOptions {
  /** Theme names the app offers, in display order. Default: `['light', 'dark']`. */
  readonly themes: readonly string[];
  /** Themes built on a dark base, used to report the color scheme. Default: `['dark']`. */
  readonly darkThemes: readonly string[];
  /** Preference used when nothing is stored. Default: `'system'`. */
  readonly defaultPreference: TslThemePreference;
  /** localStorage key. Set to `null` to disable persistence. Default: `'tsl-theme'`. */
  readonly storageKey: string | null;
}

const DEFAULT_OPTIONS: TslThemeOptions = {
  themes: ['light', 'dark'],
  darkThemes: ['dark'],
  defaultPreference: 'system',
  storageKey: 'tsl-theme',
};

export const TSL_THEME_OPTIONS = new InjectionToken<TslThemeOptions>('TSL_THEME_OPTIONS', {
  providedIn: 'root',
  factory: () => DEFAULT_OPTIONS,
});

/** Configures theme handling. Optional: without it, light/dark/system with persistence is used. */
export function provideTslTheme(options: Partial<TslThemeOptions> = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: TSL_THEME_OPTIONS, useValue: { ...DEFAULT_OPTIONS, ...options } },
  ]);
}

const DARK_QUERY = '(prefers-color-scheme: dark)';

/**
 * Reads and switches the active theme by setting `data-theme` on `<html>`.
 * Themes are pure CSS variable sets from `@tassili/tokens`; this only picks one.
 */
@Injectable({ providedIn: 'root' })
export class TslTheme {
  private readonly document = inject(DOCUMENT);
  private readonly options = inject(TSL_THEME_OPTIONS);
  private readonly media = this.document.defaultView?.matchMedia?.(DARK_QUERY) ?? null;
  private readonly systemPrefersDark = signal(this.media?.matches ?? false);
  private readonly preferenceState = signal<TslThemePreference>(this.readStoredPreference());

  /** Theme names offered by the app. */
  readonly themes = this.options.themes;

  /** What the user chose: `'system'` or a theme name. */
  readonly preference = this.preferenceState.asReadonly();

  /** The theme actually applied, with `'system'` resolved. */
  readonly theme = computed(() => {
    const preference = this.preferenceState();
    if (preference !== 'system') {
      return preference;
    }
    return this.systemPrefersDark() ? 'dark' : 'light';
  });

  /** Whether the applied theme is dark-based. */
  readonly colorScheme = computed(() =>
    this.options.darkThemes.includes(this.theme()) ? 'dark' : 'light',
  );

  constructor() {
    const onSystemChange = (event: MediaQueryListEvent) =>
      this.systemPrefersDark.set(event.matches);
    this.media?.addEventListener('change', onSystemChange);
    inject(DestroyRef).onDestroy(() => this.media?.removeEventListener('change', onSystemChange));

    effect(() => {
      this.document.documentElement.setAttribute('data-theme', this.theme());
    });
  }

  /** Switches theme and remembers the choice. */
  setPreference(preference: TslThemePreference): void {
    this.preferenceState.set(preference);
    this.writeStoredPreference(preference);
  }

  private readStoredPreference(): TslThemePreference {
    const key = this.options.storageKey;
    if (key === null) {
      return this.options.defaultPreference;
    }
    try {
      const stored = this.document.defaultView?.localStorage.getItem(key);
      if (stored === 'system' || (stored && this.options.themes.includes(stored))) {
        return stored;
      }
    } catch {
      // Storage can be blocked (privacy mode, sandboxed iframes); fall back to the default.
    }
    return this.options.defaultPreference;
  }

  private writeStoredPreference(preference: TslThemePreference): void {
    const key = this.options.storageKey;
    if (key === null) {
      return;
    }
    try {
      this.document.defaultView?.localStorage.setItem(key, preference);
    } catch {
      // Persistence is best-effort.
    }
  }
}

/**
 * Inline this in `<head>` (before styles load) to apply the stored theme before
 * first paint and avoid a flash of the wrong theme. Keep the key in sync with
 * `storageKey`.
 */
export const TSL_THEME_BOOTSTRAP_SCRIPT = `(function(){try{var t=localStorage.getItem('tsl-theme');if(t&&t!=='system'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;
