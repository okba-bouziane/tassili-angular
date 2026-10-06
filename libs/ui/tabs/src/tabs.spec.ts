import { fireEvent, render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../testing/axe';
import { TslTabsImports } from './tabs';

const template = (variant = 'line') => `
  <tsl-tabs tab="overview" (tabActivated)="onTab($event)">
    <tsl-tabs-list aria-label="Project sections" variant="${variant}">
      <button tslTabsTrigger="overview">Overview</button>
      <button tslTabsTrigger="activity">Activity</button>
      <button tslTabsTrigger="settings" disabled>Settings</button>
    </tsl-tabs-list>
    <div tslTabsContent="overview">Overview panel</div>
    <div tslTabsContent="activity">Activity panel</div>
    <div tslTabsContent="settings">Settings panel</div>
  </tsl-tabs>
`;

describe('TslTabs', () => {
  it('shows the active panel and links tabs to panels', async () => {
    await render(template(), {
      imports: [...TslTabsImports],
      componentProperties: { onTab: vi.fn() },
    });
    const overview = screen.getByRole('tab', { name: 'Overview' });
    expect(overview.getAttribute('aria-selected')).toBe('true');
    const panel = screen.getByRole('tabpanel', { name: 'Overview' });
    expect(panel.textContent).toContain('Overview panel');
    expect(overview.getAttribute('aria-controls')).toBe(panel.id);
    expect(screen.getByText('Activity panel').hasAttribute('hidden')).toBe(true);
  });

  it('activates a tab on click', async () => {
    const user = userEvent.setup();
    const onTab = vi.fn();
    await render(template(), { imports: [...TslTabsImports], componentProperties: { onTab } });
    await user.click(screen.getByRole('tab', { name: 'Activity' }));
    expect(onTab).toHaveBeenCalledWith('activity');
    expect(screen.getByRole('tabpanel').textContent).toContain('Activity panel');
  });

  it('moves between tabs with arrow keys and skips disabled tabs', async () => {
    await render(template(), {
      imports: [...TslTabsImports],
      componentProperties: { onTab: vi.fn() },
    });
    const overview = screen.getByRole('tab', { name: 'Overview' });
    overview.focus();
    // CDK's key manager reads the legacy keyCode, which user-event does not set.
    fireEvent.keyDown(overview, { key: 'ArrowRight', keyCode: 39 });
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Activity' }));
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowRight', keyCode: 39 });
    expect(document.activeElement).toBe(overview);
  });

  it('applies the segmented variant', async () => {
    await render(template('segmented'), {
      imports: [...TslTabsImports],
      componentProperties: { onTab: vi.fn() },
    });
    expect(screen.getByRole('tablist').getAttribute('data-variant')).toBe('segmented');
  });

  it('has no accessibility violations', async () => {
    const { container } = await render(template(), {
      imports: [...TslTabsImports],
      componentProperties: { onTab: vi.fn() },
    });
    await expectNoA11yViolations(container);
  });
});
