import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { form, FormField, required } from '@angular/forms/signals';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { TslLabel } from '@tassili/ui/label';
import { expectNoA11yViolations } from '../../testing/axe';
import { TslInput } from './input';

describe('TslInput', () => {
  it('styles a native input with size variants and merged classes', async () => {
    await render(`<input tslInput size="lg" class="max-w-xs" aria-label="Name" />`, {
      imports: [TslInput],
    });
    const input = screen.getByRole('textbox', { name: 'Name' });
    expect(input.className).toContain('h-control-lg');
    expect(input.className).toContain('max-w-xs');
    expect(input.getAttribute('data-slot')).toBe('input');
    expect(input.id).toMatch(/^brn-input-/);
  });

  it('accepts typing', async () => {
    const user = userEvent.setup();
    await render(`<input tslInput aria-label="Name" />`, { imports: [TslInput] });
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await user.type(input, 'Okba');
    expect(input.value).toBe('Okba');
  });

  describe('with reactive forms', () => {
    it('shows invalid only after the user leaves the field', async () => {
      const user = userEvent.setup();
      const control = new FormControl('', Validators.required);
      await render(`<input tslInput aria-label="Email" [formControl]="control" />`, {
        imports: [TslInput, ReactiveFormsModule],
        componentProperties: { control },
      });
      const input = screen.getByRole('textbox');
      expect(input.hasAttribute('aria-invalid')).toBe(false);

      await user.click(input);
      await user.tab();
      expect(input.getAttribute('aria-invalid')).toBe('true');
      expect(input.getAttribute('data-shown-invalid')).toBe('true');

      await user.type(input, 'a@b.dz');
      expect(input.hasAttribute('aria-invalid')).toBe(false);
    });

    it('disables through the form control', async () => {
      const control = new FormControl({ value: '', disabled: true });
      await render(`<input tslInput aria-label="Email" [formControl]="control" />`, {
        imports: [TslInput, ReactiveFormsModule],
        componentProperties: { control },
      });
      expect((screen.getByRole('textbox') as HTMLInputElement).disabled).toBe(true);
    });
  });

  describe('with signal forms', () => {
    it('binds the value and shows invalid after touch', async () => {
      const user = userEvent.setup();
      @Component({
        imports: [TslInput, FormField],
        template: `<input tslInput aria-label="Name" [formField]="profile.name" />`,
        changeDetection: ChangeDetectionStrategy.OnPush,
      })
      class SignalFormHost {
        readonly model = signal({ name: '' });
        readonly profile = form(this.model, (path) => required(path.name));
      }
      const { fixture } = await render(SignalFormHost);
      const model = fixture.componentInstance.model;
      const input = screen.getByRole('textbox');
      expect(input.hasAttribute('aria-invalid')).toBe(false);

      await user.click(input);
      await user.tab();
      expect(input.getAttribute('aria-invalid')).toBe('true');

      await user.type(input, 'Okba');
      expect(model().name).toBe('Okba');
      expect(input.hasAttribute('aria-invalid')).toBe(false);
    });
  });

  it('can be forced invalid', async () => {
    await render(`<input tslInput aria-label="Code" forceInvalid />`, { imports: [TslInput] });
    expect(screen.getByRole('textbox').getAttribute('aria-invalid')).toBe('true');
  });

  it('is labelled by a Tassili label and has no accessibility violations', async () => {
    const { container } = await render(
      `<label tslLabel for="email">Email</label><input tslInput id="email" type="email" />`,
      { imports: [TslInput, TslLabel] },
    );
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeTruthy();
    await expectNoA11yViolations(container);
  });
});
