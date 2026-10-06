import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { fireEvent, render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../testing/axe';
import { TslComboboxImports } from './combobox';

const frameworks = ['Angular', 'Analog', 'Astro', 'Nuxt', 'SvelteKit'];

const single = `
  <tsl-combobox [formControl]="control">
    <tsl-combobox-input placeholder="Search frameworks" aria-label="Framework" showClear />
    <tsl-combobox-content *tslComboboxPortal>
      <tsl-combobox-empty>No frameworks match.</tsl-combobox-empty>
      <div tslComboboxList>
        @for (framework of frameworks; track framework) {
          <tsl-combobox-item [value]="framework">{{ framework }}</tsl-combobox-item>
        }
      </div>
    </tsl-combobox-content>
  </tsl-combobox>
`;

const multiple = `
  <tsl-combobox-multiple [formControl]="control">
    <tsl-combobox-chips>
      <ng-template tslComboboxValues let-values>
        @for (value of values; track value) {
          <tsl-combobox-chip [value]="value" [removeLabel]="'Remove ' + value">{{ value }}</tsl-combobox-chip>
        }
      </ng-template>
      <input tslComboboxChipInput aria-label="Frameworks" placeholder="Add framework" />
    </tsl-combobox-chips>
    <tsl-combobox-content *tslComboboxPortal>
      <tsl-combobox-empty>No frameworks match.</tsl-combobox-empty>
      <div tslComboboxList>
        @for (framework of frameworks; track framework) {
          <tsl-combobox-item [value]="framework">{{ framework }}</tsl-combobox-item>
        }
      </div>
    </tsl-combobox-content>
  </tsl-combobox-multiple>
`;

describe('TslCombobox', () => {
  afterEach(() =>
    document.querySelectorAll('.cdk-overlay-container').forEach((el) => (el.innerHTML = '')),
  );

  it('filters options while typing and selects one', async () => {
    const user = userEvent.setup();
    const control = new FormControl<string | null>(null);
    await render(single, {
      imports: [...TslComboboxImports, ReactiveFormsModule],
      componentProperties: { control, frameworks },
    });
    const input = screen.getByRole('combobox', { name: 'Framework' });
    await user.type(input, 'an');
    // Non-matching options are hidden with data-hidden (CSS display:none in the browser).
    await waitFor(() =>
      expect(screen.getByRole('option', { name: 'Nuxt' }).hasAttribute('data-hidden')).toBe(true),
    );
    expect(screen.getByRole('option', { name: 'Angular' }).hasAttribute('data-hidden')).toBe(false);

    await user.click(screen.getByRole('option', { name: 'Analog' }));
    expect(control.value).toBe('Analog');
    await waitFor(() => expect((input as HTMLInputElement).value).toBe('Analog'));
  });

  it('shows the empty state when nothing matches', async () => {
    const user = userEvent.setup();
    await render(single, {
      imports: [...TslComboboxImports, ReactiveFormsModule],
      componentProperties: { control: new FormControl<string | null>(null), frameworks },
    });
    await user.type(screen.getByRole('combobox'), 'zzz');
    const empty = await screen.findByText('No frameworks match.');
    expect(empty.closest('[data-slot=combobox-content]')?.hasAttribute('data-empty')).toBe(true);
  });

  it('selects with the keyboard', async () => {
    const user = userEvent.setup();
    const control = new FormControl<string | null>(null);
    await render(single, {
      imports: [...TslComboboxImports, ReactiveFormsModule],
      componentProperties: { control, frameworks },
    });
    await user.click(screen.getByRole('combobox'));
    await screen.findByRole('listbox');
    // CDK's key manager reads the legacy keyCode, which user-event does not set.
    const input = screen.getByRole('combobox');
    fireEvent.keyDown(input, { key: 'ArrowDown', keyCode: 40 });
    await waitFor(() => expect(document.querySelector('[data-highlighted]')).not.toBeNull());
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });
    expect(frameworks).toContain(control.value);
  });

  it('adds and removes chips in multiple mode', async () => {
    const user = userEvent.setup();
    const control = new FormControl<string[] | null>(['Angular']);
    await render(multiple, {
      imports: [...TslComboboxImports, ReactiveFormsModule],
      componentProperties: { control, frameworks },
    });
    expect(screen.getByText('Angular', { selector: 'span' })).toBeTruthy();

    await user.click(screen.getByRole('combobox', { name: 'Frameworks' }));
    await user.click(await screen.findByRole('option', { name: 'Astro' }));
    expect(control.value).toEqual(['Angular', 'Astro']);

    await user.click(screen.getByLabelText('Remove Angular'));
    expect(control.value).toEqual(['Astro']);
  });

  it('has no accessibility violations when open', async () => {
    const user = userEvent.setup();
    await render(single, {
      imports: [...TslComboboxImports, ReactiveFormsModule],
      componentProperties: { control: new FormControl<string | null>(null), frameworks },
    });
    await user.click(screen.getByRole('combobox'));
    await screen.findByRole('listbox');
    await expectNoA11yViolations(document.body);
  });
});
