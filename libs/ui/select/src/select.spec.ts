import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { TslLabel } from '@tassili/ui/label';
import { expectNoA11yViolations } from '../../testing/axe';
import { TslSelectImports } from './select';

const regions: Record<string, string> = { eu: 'Europe', af: 'Africa', as: 'Asia' };

const template = `
  <label tslLabel for="region-trigger">Region</label>
  <tsl-select [formControl]="control" [itemToString]="labelFor">
    <tsl-select-trigger buttonId="region-trigger" class="w-56">
      <tsl-select-value placeholder="Choose a region" />
    </tsl-select-trigger>
    <tsl-select-content *tslSelectPortal>
      <tsl-select-group>
        <tsl-select-label>Regions</tsl-select-label>
        <tsl-select-item value="eu">Europe</tsl-select-item>
        <tsl-select-item value="af">Africa</tsl-select-item>
        <tsl-select-item value="as" [disabled]="true">Asia</tsl-select-item>
      </tsl-select-group>
    </tsl-select-content>
  </tsl-select>
`;

async function setup(initial: string | null = null) {
  const control = new FormControl<string | null>(initial, Validators.required);
  const result = await render(template, {
    imports: [...TslSelectImports, TslLabel, ReactiveFormsModule],
    componentProperties: { control, labelFor: (value: string) => regions[value] ?? value },
  });
  return { control, ...result };
}

describe('TslSelect', () => {
  afterEach(() =>
    document.querySelectorAll('.cdk-overlay-container').forEach((el) => (el.innerHTML = '')),
  );

  it('shows the placeholder and is labelled', async () => {
    await setup();
    const trigger = screen.getByRole('combobox', { name: 'Region' });
    expect(trigger.textContent).toContain('Choose a region');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('opens on click and selects an option', async () => {
    const user = userEvent.setup();
    const { control } = await setup();
    const trigger = screen.getByRole('combobox');
    await user.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    await user.click(await screen.findByRole('option', { name: 'Africa' }));
    expect(control.value).toBe('af');
    await waitFor(() => expect(trigger.textContent).toContain('Africa'));
  });

  it('supports keyboard selection', async () => {
    const user = userEvent.setup();
    const { control } = await setup();
    screen.getByRole('combobox').focus();
    await user.keyboard('{ArrowDown}');
    await screen.findByRole('listbox');
    await user.keyboard('{ArrowDown}{Enter}');
    expect(control.value).not.toBeNull();
  });

  it('marks the selected option and shows the current value', async () => {
    const user = userEvent.setup();
    await setup('eu');
    const trigger = screen.getByRole('combobox');
    await waitFor(() => expect(trigger.textContent).toContain('Europe'));
    await user.click(trigger);
    const option = await screen.findByRole('option', { name: 'Europe' });
    expect(option.getAttribute('aria-selected')).toBe('true');
  });

  it('has no accessibility violations when open', async () => {
    const user = userEvent.setup();
    await setup();
    await user.click(screen.getByRole('combobox'));
    await screen.findByRole('listbox');
    await expectNoA11yViolations(document.body);
  });
});
