import { provideZonelessChangeDetection } from '@angular/core';
import { applicationConfig, type Decorator, type Preview } from '@storybook/angular';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';
import { addons } from 'storybook/preview-api';

const THEMES: Record<string, string> = { Light: 'light', Dark: 'dark', Oasis: 'oasis' };

/** Applies the toolbar globals to <html>, so docs-only pages follow them as well as stories. */
function applyGlobals(globals: Record<string, unknown>): void {
  const root = document.documentElement;
  root.dataset['theme'] = THEMES[String(globals['theme'] ?? 'Light')] ?? 'light';
  root.dir = globals['direction'] === 'rtl' ? 'rtl' : 'ltr';
}

const channel = addons.getChannel();
for (const event of [SET_GLOBALS, GLOBALS_UPDATED]) {
  channel.on(event, ({ globals }: { globals: Record<string, unknown> }) => applyGlobals(globals));
}

const withDirection: Decorator = (story, context) => {
  applyGlobals(context.globals);
  return story();
};

const preview: Preview = {
  decorators: [
    applicationConfig({ providers: [provideZonelessChangeDetection()] }),
    withThemeByDataAttribute({
      themes: THEMES,
      defaultTheme: 'Light',
      attributeName: 'data-theme',
    }),
    withDirection,
  ],
  globalTypes: {
    direction: {
      description: 'Text direction',
      toolbar: {
        title: 'Direction',
        icon: 'transfer',
        items: [
          { value: 'ltr', title: 'Left to right' },
          { value: 'rtl', title: 'Right to left' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    direction: 'ltr',
  },
  parameters: {
    layout: 'centered',
    controls: { expanded: true, sort: 'requiredFirst' },
    a11y: {
      // Fail the a11y panel on violations instead of only listing them.
      test: 'error',
    },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Foundations',
          'Primitives',
          'Overlays',
          'Navigation',
          'Data',
          'Forms',
          'Layout',
        ],
      },
    },
  },
};

export default preview;
