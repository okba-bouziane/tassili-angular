import { fireEvent, render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../testing/axe';
import { TslCommandImports } from './command';

const list = `
  <tsl-command>
    <tsl-command-input placeholder="Search commands" />
    <tsl-command-list>
      <div *tslCommandEmptyState tslCommandEmpty>No commands match.</div>
      <tsl-command-group>
        <tsl-command-group-label>Navigation</tsl-command-group-label>
        <button tslCommandItem value="Dashboard" (selected)="run('dashboard')">Dashboard</button>
        <button tslCommandItem value="Projects" (selected)="run('projects')">Projects</button>
      </tsl-command-group>
      <tsl-command-separator />
      <tsl-command-group>
        <tsl-command-group-label>Account</tsl-command-group-label>
        <button tslCommandItem value="Settings" (selected)="run('settings')">Settings <tsl-command-shortcut>⌘,</tsl-command-shortcut></button>
        <button tslCommandItem value="Billing" disabled>Billing</button>
      </tsl-command-group>
    </tsl-command-list>
  </tsl-command>
`;

describe('TslCommand', () => {
  afterEach(() =>
    document.querySelectorAll('.cdk-overlay-container').forEach((el) => (el.innerHTML = '')),
  );

  it('filters commands as you type and shows the empty state', async () => {
    const user = userEvent.setup();
    await render(list, { imports: [...TslCommandImports], componentProperties: { run: vi.fn() } });
    const input = screen.getByRole('combobox', { name: 'Search commands' });
    await user.type(input, 'proj');
    await waitFor(() =>
      expect(
        screen.getByRole('option', { name: 'Dashboard', hidden: true }).hasAttribute('data-hidden'),
      ).toBe(true),
    );
    expect(screen.getByRole('option', { name: 'Projects' }).hasAttribute('data-hidden')).toBe(
      false,
    );

    await user.clear(input);
    await user.type(input, 'zzz');
    expect(await screen.findByText('No commands match.')).toBeTruthy();
  });

  it('runs a command on click and with the keyboard', async () => {
    const user = userEvent.setup();
    const run = vi.fn();
    await render(list, { imports: [...TslCommandImports], componentProperties: { run } });
    await user.click(screen.getByRole('option', { name: 'Projects' }));
    expect(run).toHaveBeenCalledWith('projects');

    const input = screen.getByRole('combobox');
    input.focus();
    fireEvent.keyDown(input, { key: 'ArrowDown', keyCode: 40 });
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });
    expect(run).toHaveBeenCalledTimes(2);
  });

  it('has no accessibility violations', async () => {
    const { container } = await render(list, {
      imports: [...TslCommandImports],
      componentProperties: { run: vi.fn() },
    });
    await expectNoA11yViolations(container);
  });
});

describe('TslCommandDialog', () => {
  afterEach(() =>
    document.querySelectorAll('.cdk-overlay-container').forEach((el) => (el.innerHTML = '')),
  );

  it('toggles with the ⌘/Ctrl hotkey and is named for assistive tech', async () => {
    await render(`<tsl-command-dialog hotkey="k">${list}</tsl-command-dialog>`, {
      imports: [...TslCommandImports],
      componentProperties: { run: vi.fn() },
    });
    expect(screen.queryByRole('dialog')).toBeNull();
    fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
    expect(await screen.findByRole('dialog', { name: 'Command palette' })).toBeTruthy();
    fireEvent.keyDown(document, { key: 'k', metaKey: true });
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });
});
