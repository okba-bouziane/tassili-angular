import { TestBed } from '@angular/core/testing';
import { provideTslTheme, TslTheme } from './theme';

interface FakeMediaQueryList {
  matches: boolean;
  listeners: Set<(event: MediaQueryListEvent) => void>;
  addEventListener(type: 'change', listener: (event: MediaQueryListEvent) => void): void;
  removeEventListener(type: 'change', listener: (event: MediaQueryListEvent) => void): void;
}

function fakeMedia(matches: boolean): FakeMediaQueryList {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  return {
    matches,
    listeners,
    addEventListener: (_type, listener) => listeners.add(listener),
    removeEventListener: (_type, listener) => listeners.delete(listener),
  };
}

describe('TslTheme', () => {
  let media: FakeMediaQueryList;

  function setup(options: Parameters<typeof provideTslTheme>[0] = {}): TslTheme {
    TestBed.configureTestingModule({ providers: [provideTslTheme(options)] });
    const theme = TestBed.inject(TslTheme);
    TestBed.tick();
    return theme;
  }

  beforeEach(() => {
    media = fakeMedia(false);
    // jsdom does not implement matchMedia.
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: () => media,
    });
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('follows the system light preference by default', () => {
    const theme = setup();
    expect(theme.preference()).toBe('system');
    expect(theme.theme()).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('reacts when the system switches to dark', () => {
    const theme = setup();
    media.listeners.forEach((listener) => listener({ matches: true } as MediaQueryListEvent));
    TestBed.tick();
    expect(theme.theme()).toBe('dark');
    expect(theme.colorScheme()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('applies and persists an explicit choice', () => {
    const theme = setup({ themes: ['light', 'dark', 'oasis'] });
    theme.setPreference('oasis');
    TestBed.tick();
    expect(document.documentElement.getAttribute('data-theme')).toBe('oasis');
    expect(theme.colorScheme()).toBe('light');
    expect(localStorage.getItem('tsl-theme')).toBe('oasis');
  });

  it('restores a stored preference', () => {
    localStorage.setItem('tsl-theme', 'dark');
    const theme = setup();
    expect(theme.preference()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('ignores a stored theme the app does not offer', () => {
    localStorage.setItem('tsl-theme', 'removed-theme');
    expect(setup().preference()).toBe('system');
  });

  it('skips persistence when storageKey is null', () => {
    const theme = setup({ storageKey: null });
    theme.setPreference('dark');
    expect(localStorage.length).toBe(0);
  });
});
