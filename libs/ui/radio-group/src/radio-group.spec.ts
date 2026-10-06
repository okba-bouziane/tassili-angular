import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../testing/axe';
import { TslRadio, TslRadioGroup } from './radio-group';

const template = `
  <div tslRadioGroup aria-label="Plan" [formControl]="control">
    <tsl-radio value="free">Free</tsl-radio>
    <tsl-radio value="pro">Pro</tsl-radio>
    <tsl-radio value="team" [disabled]="true">Team</tsl-radio>
  </div>
`;

describe('TslRadioGroup', () => {
  it('selects an option by clicking its label', async () => {
    const user = userEvent.setup();
    const control = new FormControl<string | null>(null);
    await render(template, {
      imports: [TslRadioGroup, TslRadio, ReactiveFormsModule],
      componentProperties: { control },
    });
    expect(screen.getByRole('radiogroup', { name: 'Plan' })).toBeTruthy();
    await user.click(screen.getByText('Pro'));
    expect(control.value).toBe('pro');
    expect((screen.getByRole('radio', { name: 'Pro' }) as HTMLInputElement).checked).toBe(true);
  });

  it('reflects the form value and disabled options', async () => {
    const control = new FormControl<string | null>('free');
    await render(template, {
      imports: [TslRadioGroup, TslRadio, ReactiveFormsModule],
      componentProperties: { control },
    });
    expect((screen.getByRole('radio', { name: 'Free' }) as HTMLInputElement).checked).toBe(true);
    expect((screen.getByRole('radio', { name: 'Team' }) as HTMLInputElement).disabled).toBe(true);
  });

  it('has no accessibility violations', async () => {
    const control = new FormControl<string | null>('free');
    const { container } = await render(template, {
      imports: [TslRadioGroup, TslRadio, ReactiveFormsModule],
      componentProperties: { control },
    });
    await expectNoA11yViolations(container);
  });
});
