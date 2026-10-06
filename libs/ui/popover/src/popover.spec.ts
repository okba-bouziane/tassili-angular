import { render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { TslButton } from '@tassili/ui/button';
import { expectNoA11yViolations } from '../../testing/axe';
import { TslPopoverImports } from './popover';

const template = `
  <tsl-popover>
    <button tslButton variant="outline" tslPopoverTrigger>Share</button>
    <tsl-popover-content *tslPopoverPortal="let ctx">
      <tsl-popover-header>
        <h3 tslPopoverTitle>Share this page</h3>
        <p tslPopoverDescription>Anyone with the link can view.</p>
      </tsl-popover-header>
      <button tslButton size="sm">Copy link</button>
    </tsl-popover-content>
  </tsl-popover>
`;

describe('TslPopover', () => {
  afterEach(() =>
    document.querySelectorAll('.cdk-overlay-container').forEach((el) => (el.innerHTML = '')),
  );

  it('toggles from its trigger and reflects the expanded state', async () => {
    const user = userEvent.setup();
    await render(template, { imports: [...TslPopoverImports, TslButton] });
    const trigger = screen.getByRole('button', { name: 'Share' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    await user.click(trigger);
    expect(await screen.findByText('Share this page')).toBeTruthy();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    const content = document.querySelector('[data-slot=popover-content]');
    expect(content?.hasAttribute('data-open')).toBe(true);
  });

  it('closes with Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    await render(template, { imports: [...TslPopoverImports, TslButton] });
    const trigger = screen.getByRole('button', { name: 'Share' });
    await user.click(trigger);
    await screen.findByText('Share this page');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByText('Share this page')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it('has no accessibility violations when open', async () => {
    const user = userEvent.setup();
    await render(template, { imports: [...TslPopoverImports, TslButton] });
    await user.click(screen.getByRole('button', { name: 'Share' }));
    await screen.findByText('Share this page');
    await expectNoA11yViolations(document.body);
  });
});
