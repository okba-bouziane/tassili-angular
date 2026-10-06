import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { form, FormField, required } from '@angular/forms/signals';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { TslLabel } from '@tassili/ui/label';
import { expectNoA11yViolations } from '../../testing/axe';
import { TslCheckbox } from './checkbox';

describe('TslCheckbox', () => {
  it('toggles with click and Space, and is named by its label', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    await render(
      `<tsl-checkbox inputId="terms" (checkedChange)="onChange($event)" /><label tslLabel for="terms">Accept terms</label>`,
      { imports: [TslCheckbox, TslLabel], componentProperties: { onChange } },
    );
    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });
    expect(checkbox.getAttribute('aria-checked')).toBe('false');

    await user.click(checkbox);
    expect(checkbox.getAttribute('aria-checked')).toBe('true');

    await user.keyboard(' ');
    expect(checkbox.getAttribute('aria-checked')).toBe('false');

    await user.click(screen.getByText('Accept terms'));
    expect(checkbox.getAttribute('aria-checked')).toBe('true');
    expect(onChange.mock.calls.map(([value]) => value)).toEqual([true, false, true]);
  });

  it('exposes the indeterminate state as mixed', async () => {
    await render(`<tsl-checkbox aria-label="Select all" [indeterminate]="true" />`, {
      imports: [TslCheckbox],
    });
    expect(screen.getByRole('checkbox').getAttribute('aria-checked')).toBe('mixed');
  });

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup();
    await render(`<tsl-checkbox aria-label="Locked" disabled />`, { imports: [TslCheckbox] });
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    expect(checkbox.getAttribute('aria-checked')).toBe('false');
    expect((checkbox as HTMLButtonElement).disabled).toBe(true);
  });

  it('works with reactive forms', async () => {
    const user = userEvent.setup();
    const control = new FormControl(false, Validators.requiredTrue);
    await render(`<tsl-checkbox aria-label="Agree" [formControl]="control" />`, {
      imports: [TslCheckbox, ReactiveFormsModule],
      componentProperties: { control },
    });
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    expect(control.value).toBe(true);
    control.setValue(false);
    await screen.findByRole('checkbox', { checked: false });
    control.disable();
    expect(await screen.findByRole('checkbox')).toHaveProperty('disabled', true);
  });

  it('works with signal forms', async () => {
    const user = userEvent.setup();
    @Component({
      imports: [TslCheckbox, FormField],
      template: `<tsl-checkbox aria-label="Agree" [formField]="consent.agreed" />`,
      changeDetection: ChangeDetectionStrategy.OnPush,
    })
    class Host {
      readonly model = signal({ agreed: false });
      readonly consent = form(this.model, (path) => required(path.agreed));
    }
    const { fixture } = await render(Host);
    await user.click(screen.getByRole('checkbox'));
    expect(fixture.componentInstance.model().agreed).toBe(true);
  });

  it('has no accessibility violations', async () => {
    const { container } = await render(
      `<tsl-checkbox inputId="a" /><label tslLabel for="a">Weekly digest</label>
       <tsl-checkbox aria-label="Select all" [indeterminate]="true" />`,
      { imports: [TslCheckbox, TslLabel] },
    );
    await expectNoA11yViolations(container);
  });
});
