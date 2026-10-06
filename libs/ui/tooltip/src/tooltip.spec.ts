import { render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { TslButton } from '@tassili/ui/button';
import { expectNoA11yViolations } from '../../testing/axe';
import { TslTooltip } from './tooltip';

const template = `<button tslButton aria-label="Archive" tslTooltip="Archive project" [showDelay]="0">A</button>`;

describe('TslTooltip', () => {
  afterEach(() =>
    document.querySelectorAll('.cdk-overlay-container').forEach((el) => (el.innerHTML = '')),
  );

  it('shows on keyboard focus and describes the trigger', async () => {
    const user = userEvent.setup();
    await render(template, { imports: [TslButton, TslTooltip] });
    await user.tab();
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip.textContent).toContain('Archive project');
    const trigger = screen.getByRole('button', { name: 'Archive' });
    await waitFor(() => expect(trigger.getAttribute('aria-describedby')).toBe(tooltip.id));
  });

  it('shows on hover and hides with Escape', async () => {
    const user = userEvent.setup();
    await render(template, { imports: [TslButton, TslTooltip] });
    await user.hover(screen.getByRole('button'));
    await screen.findByRole('tooltip');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull());
  });

  it('can be disabled', async () => {
    const user = userEvent.setup();
    await render(
      `<button tslButton tslTooltip="Hidden" [showDelay]="0" [tooltipDisabled]="true">B</button>`,
      { imports: [TslButton, TslTooltip] },
    );
    await user.hover(screen.getByRole('button'));
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('has no accessibility violations when shown', async () => {
    const user = userEvent.setup();
    await render(template, { imports: [TslButton, TslTooltip] });
    await user.tab();
    await screen.findByRole('tooltip');
    await expectNoA11yViolations(document.body);
  });
});
