import { fireEvent, render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../testing/axe';
import { TslSidebarImports } from './sidebar';

const template = `
  <tsl-sidebar-provider [storageKey]="storageKey">
    <tsl-sidebar label="Main navigation">
      <tsl-sidebar-content>
        <tsl-sidebar-group>
          <tsl-sidebar-group-label>Workspace</tsl-sidebar-group-label>
          <ul tslSidebarMenu>
            <li tslSidebarMenuItem><a tslSidebarMenuButton href="/" [active]="true" tooltip="Home"><span>Home</span></a></li>
            <li tslSidebarMenuItem><a tslSidebarMenuButton href="/projects" tooltip="Projects"><span>Projects</span></a></li>
          </ul>
        </tsl-sidebar-group>
      </tsl-sidebar-content>
    </tsl-sidebar>
    <tsl-sidebar-inset><tsl-sidebar-trigger /><main>Content</main></tsl-sidebar-inset>
  </tsl-sidebar-provider>
`;

function mockViewport(mobile: boolean): void {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches: mobile,
      media: query,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    }),
  });
}

describe('TslSidebar', () => {
  beforeEach(() => localStorage.clear());

  describe('on desktop', () => {
    beforeEach(() => mockViewport(false));

    it('collapses to an icon rail and remembers it', async () => {
      const user = userEvent.setup();
      await render(template, {
        imports: [...TslSidebarImports],
        componentProperties: { storageKey: 'test-sidebar' },
      });
      const sidebar = screen.getByRole('complementary', { name: 'Main navigation' });
      const trigger = screen.getByRole('button', { name: 'Toggle sidebar' });
      expect(sidebar.getAttribute('data-state')).toBe('expanded');
      expect(trigger.getAttribute('aria-expanded')).toBe('true');
      expect(trigger.getAttribute('aria-controls')).toBe(sidebar.id);

      await user.click(trigger);
      expect(sidebar.getAttribute('data-state')).toBe('collapsed');
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
      expect(localStorage.getItem('test-sidebar')).toBe('true');
    });

    it('toggles with Ctrl+B', async () => {
      await render(template, {
        imports: [...TslSidebarImports],
        componentProperties: { storageKey: null },
      });
      const sidebar = screen.getByRole('complementary');
      fireEvent.keyDown(document, { key: 'b', ctrlKey: true });
      await waitFor(() => expect(sidebar.getAttribute('data-state')).toBe('collapsed'));
    });

    it('marks the active link as the current page', async () => {
      await render(template, {
        imports: [...TslSidebarImports],
        componentProperties: { storageKey: null },
      });
      expect(screen.getByRole('link', { name: 'Home' }).getAttribute('aria-current')).toBe('page');
      expect(screen.getByRole('link', { name: 'Projects' }).hasAttribute('aria-current')).toBe(
        false,
      );
    });

    it('has no accessibility violations', async () => {
      const { container } = await render(template, {
        imports: [...TslSidebarImports],
        componentProperties: { storageKey: null },
      });
      await expectNoA11yViolations(container);
    });
  });

  describe('on mobile', () => {
    beforeEach(() => mockViewport(true));

    it('opens as a panel, closes with Escape and returns focus to the trigger', async () => {
      const user = userEvent.setup();
      await render(template, {
        imports: [...TslSidebarImports],
        componentProperties: { storageKey: null },
      });
      const sidebar = screen.getByRole('complementary', { hidden: true });
      expect(sidebar.hasAttribute('inert')).toBe(true);

      const trigger = screen.getByRole('button', { name: 'Toggle sidebar' });
      await user.click(trigger);
      expect(sidebar.getAttribute('data-state')).toBe('expanded');
      expect(sidebar.hasAttribute('inert')).toBe(false);
      // Focus moving into the panel relies on CDK's layout-based tabbable checks,
      // which jsdom can't do; it is verified in the browser (Storybook).

      fireEvent.keyDown(sidebar, { key: 'Escape' });
      await waitFor(() => expect(sidebar.getAttribute('data-state')).toBe('collapsed'));
      await waitFor(() => expect(document.activeElement).toBe(trigger));
    });
  });
});
