import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { TslLabel } from '@tassili/ui/label';
import { expectNoA11yViolations } from '../../testing/axe';
import { TslSwitch } from './switch';

describe('TslSwitch', () => {
  it('toggles with click, Space and its label', async () => {
    const user = userEvent.setup();
    await render(
      `<tsl-switch inputId="emails" /><label tslLabel for="emails">Email notifications</label>`,
      { imports: [TslSwitch, TslLabel] },
    );
    const toggle = screen.getByRole('switch', { name: 'Email notifications' });
    expect(toggle.getAttribute('aria-checked')).toBe('false');
    await user.click(toggle);
    expect(toggle.getAttribute('aria-checked')).toBe('true');
    await user.keyboard(' ');
    expect(toggle.getAttribute('aria-checked')).toBe('false');
    await user.click(screen.getByText('Email notifications'));
    expect(toggle.getAttribute('aria-checked')).toBe('true');
  });

  it('applies the size variant', async () => {
    await render(`<tsl-switch aria-label="Compact" size="sm" />`, { imports: [TslSwitch] });
    expect(screen.getByRole('switch').className).toContain('w-7');
  });

  it('works with reactive forms', async () => {
    const user = userEvent.setup();
    const control = new FormControl(true);
    await render(`<tsl-switch aria-label="Sync" [formControl]="control" />`, {
      imports: [TslSwitch, ReactiveFormsModule],
      componentProperties: { control },
    });
    const toggle = screen.getByRole('switch');
    expect(toggle.getAttribute('aria-checked')).toBe('true');
    await user.click(toggle);
    expect(control.value).toBe(false);
  });

  it('has no accessibility violations', async () => {
    const { container } = await render(
      `<tsl-switch inputId="s" /><label tslLabel for="s">Dark mode</label>`,
      { imports: [TslSwitch, TslLabel] },
    );
    await expectNoA11yViolations(container);
  });
});
