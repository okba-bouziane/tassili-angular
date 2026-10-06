import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { TslLabel } from './label';

describe('TslLabel', () => {
  it('renders a styled native label linked with for', async () => {
    const user = userEvent.setup();
    await render(
      `<label tslLabel for="terms">Accept terms</label><input id="terms" type="checkbox" />`,
      { imports: [TslLabel] },
    );
    const label = screen.getByText('Accept terms');
    expect(label.tagName).toBe('LABEL');
    expect(label.getAttribute('for')).toBe('terms');
    expect(label.getAttribute('data-slot')).toBe('label');

    await user.click(label);
    expect(
      (screen.getByRole('checkbox', { name: 'Accept terms' }) as HTMLInputElement).checked,
    ).toBe(true);
  });

  it('merges custom classes', async () => {
    await render(`<label tslLabel class="text-base">Name</label>`, { imports: [TslLabel] });
    const label = screen.getByText('Name');
    expect(label.className).toContain('text-base');
    expect(label.className).not.toContain('text-sm');
  });
});
