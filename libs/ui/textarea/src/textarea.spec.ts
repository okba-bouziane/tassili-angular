import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { TslLabel } from '@tassili/ui/label';
import { expectNoA11yViolations } from '../../testing/axe';
import { TslTextarea } from './textarea';

describe('TslTextarea', () => {
  it('styles a native textarea and resizes vertically by default', async () => {
    await render(`<textarea tslTextarea aria-label="Bio"></textarea>`, { imports: [TslTextarea] });
    const textarea = screen.getByRole('textbox', { name: 'Bio' });
    expect(textarea.className).toContain('resize-y');
    expect(textarea.getAttribute('data-slot')).toBe('textarea');
  });

  it('grows with content when autoResize is set', async () => {
    await render(`<textarea tslTextarea autoResize aria-label="Bio"></textarea>`, {
      imports: [TslTextarea],
    });
    expect(screen.getByRole('textbox').className).toContain('field-sizing-content');
  });

  it('shows invalid after touch with reactive forms', async () => {
    const user = userEvent.setup();
    const control = new FormControl('', Validators.required);
    await render(`<textarea tslTextarea aria-label="Bio" [formControl]="control"></textarea>`, {
      imports: [TslTextarea, ReactiveFormsModule],
      componentProperties: { control },
    });
    const textarea = screen.getByRole('textbox');
    expect(textarea.hasAttribute('aria-invalid')).toBe(false);
    await user.click(textarea);
    await user.tab();
    expect(textarea.getAttribute('aria-invalid')).toBe('true');
  });

  it('has no accessibility violations', async () => {
    const { container } = await render(
      `<label tslLabel for="bio">Bio</label><textarea tslTextarea id="bio"></textarea>`,
      { imports: [TslTextarea, TslLabel] },
    );
    await expectNoA11yViolations(container);
  });
});
