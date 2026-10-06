import { fireEvent, render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { TslButton } from '@tassili/ui/button';
import { expectNoA11yViolations } from '../../testing/axe';
import { TslDropdownMenuImports } from './dropdown-menu';

const template = `
  <button tslButton variant="outline" [tslDropdownMenuTrigger]="menu">Options</button>
  <ng-template #menu>
    <tsl-dropdown-menu class="w-48">
      <tsl-dropdown-menu-label>My account</tsl-dropdown-menu-label>
      <button tslDropdownMenuItem (triggered)="onProfile()">Profile <tsl-dropdown-menu-shortcut>⇧⌘P</tsl-dropdown-menu-shortcut></button>
      <button tslDropdownMenuItem disabled>Billing</button>
      <tsl-dropdown-menu-separator />
      <button tslDropdownMenuCheckbox [checked]="true">Show grid</button>
      <tsl-dropdown-menu-group>
        <button tslDropdownMenuRadio [checked]="true">Compact</button>
        <button tslDropdownMenuRadio>Comfortable</button>
      </tsl-dropdown-menu-group>
      <tsl-dropdown-menu-separator />
      <button tslDropdownMenuItem variant="destructive">Sign out</button>
    </tsl-dropdown-menu>
  </ng-template>
`;

async function setup() {
  const onProfile = vi.fn();
  const user = userEvent.setup();
  await render(template, {
    imports: [...TslDropdownMenuImports, TslButton],
    componentProperties: { onProfile },
  });
  return { user, onProfile, trigger: screen.getByRole('button', { name: 'Options' }) };
}

describe('TslDropdownMenu', () => {
  afterEach(() =>
    document.querySelectorAll('.cdk-overlay-container').forEach((el) => (el.innerHTML = '')),
  );

  it('opens a menu with items, checkbox and radio items', async () => {
    const { user, trigger } = await setup();
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    await user.click(trigger);
    expect(await screen.findByRole('menu')).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: /Profile/ })).toBeTruthy();
    expect(
      screen.getByRole('menuitemcheckbox', { name: 'Show grid' }).getAttribute('aria-checked'),
    ).toBe('true');
    expect(
      screen.getByRole('menuitemradio', { name: 'Compact' }).getAttribute('aria-checked'),
    ).toBe('true');
    expect(screen.getByRole('menuitem', { name: 'Billing' }).hasAttribute('data-disabled')).toBe(
      true,
    );
  });

  it('runs the action and closes when an item is chosen', async () => {
    const { user, trigger, onProfile } = await setup();
    await user.click(trigger);
    await user.click(await screen.findByRole('menuitem', { name: /Profile/ }));
    expect(onProfile).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  });

  it('keeps the menu open when toggling a checkbox item', async () => {
    const { user, trigger } = await setup();
    await user.click(trigger);
    const checkbox = await screen.findByRole('menuitemcheckbox', { name: 'Show grid' });
    await user.click(checkbox);
    expect(checkbox.getAttribute('aria-checked')).toBe('false');
    expect(screen.getByRole('menu')).toBeTruthy();
  });

  it('opens from the keyboard, closes with Escape and returns focus to the trigger', async () => {
    const { user, trigger } = await setup();
    trigger.focus();
    await user.keyboard('{Enter}');
    await screen.findByRole('menu');
    await waitFor(() =>
      expect(screen.getByRole('menu').contains(document.activeElement)).toBe(true),
    );
    // CDK menus read the legacy keyCode, which user-event does not set.
    fireEvent.keyDown(document.activeElement as Element, { key: 'Escape', keyCode: 27 });
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });

  it('has no accessibility violations when open', async () => {
    const { user, trigger } = await setup();
    await user.click(trigger);
    await screen.findByRole('menu');
    await expectNoA11yViolations(document.body);
  });
});
