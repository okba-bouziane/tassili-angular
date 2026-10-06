import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { TslButton } from '@tassili/ui/button';
import { expectNoA11yViolations } from '../../testing/axe';
import { TslAlertDialogImports, TslDialogImports, TslDialogService } from './dialog';

const dialogTemplate = `
  <tsl-dialog>
    <button tslButton tslDialogTrigger>Edit profile</button>
    <tsl-dialog-content *tslDialogPortal="let ctx">
      <tsl-dialog-header>
        <h2 tslDialogTitle>Edit profile</h2>
        <p tslDialogDescription>Changes are visible to your team.</p>
      </tsl-dialog-header>
      <input aria-label="Name" />
      <tsl-dialog-footer>
        <button tslButton variant="outline" tslDialogClose>Cancel</button>
      </tsl-dialog-footer>
    </tsl-dialog-content>
  </tsl-dialog>
`;

describe('TslDialog', () => {
  afterEach(() =>
    document.querySelectorAll('.cdk-overlay-container').forEach((el) => (el.innerHTML = '')),
  );

  it('opens a named, described modal dialog and moves focus inside', async () => {
    const user = userEvent.setup();
    await render(dialogTemplate, { imports: [...TslDialogImports, TslButton] });
    await user.click(screen.getByRole('button', { name: 'Edit profile' }));

    const dialog = await screen.findByRole('dialog', { name: 'Edit profile' });
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('aria-describedby')).toBeTruthy();
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
  });

  it('closes with Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    await render(dialogTemplate, { imports: [...TslDialogImports, TslButton] });
    const trigger = screen.getByRole('button', { name: 'Edit profile' });
    await user.click(trigger);
    await screen.findByRole('dialog');

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it('closes from the close buttons', async () => {
    const user = userEvent.setup();
    await render(dialogTemplate, { imports: [...TslDialogImports, TslButton] });
    await user.click(screen.getByRole('button', { name: 'Edit profile' }));
    await user.click(await screen.findByRole('button', { name: 'Close' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());

    await user.click(screen.getByRole('button', { name: 'Edit profile' }));
    await user.click(await screen.findByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('has no accessibility violations when open', async () => {
    const user = userEvent.setup();
    await render(dialogTemplate, { imports: [...TslDialogImports, TslButton] });
    await user.click(screen.getByRole('button', { name: 'Edit profile' }));
    await screen.findByRole('dialog');
    await expectNoA11yViolations(document.body);
  });
});

describe('TslAlertDialog', () => {
  afterEach(() =>
    document.querySelectorAll('.cdk-overlay-container').forEach((el) => (el.innerHTML = '')),
  );

  it('opens an alertdialog without a close button', async () => {
    const user = userEvent.setup();
    await render(
      `
      <tsl-alert-dialog>
        <button tslButton tslAlertDialogTrigger>Delete project</button>
        <tsl-alert-dialog-content *tslAlertDialogPortal>
          <tsl-dialog-header>
            <h2 tslAlertDialogTitle>Delete Atlas?</h2>
            <p tslAlertDialogDescription>You can't undo this.</p>
          </tsl-dialog-header>
          <tsl-dialog-footer>
            <button tslButton variant="outline" tslDialogClose>Cancel</button>
          </tsl-dialog-footer>
        </tsl-alert-dialog-content>
      </tsl-alert-dialog>
      `,
      { imports: [...TslAlertDialogImports, TslButton] },
    );
    await user.click(screen.getByRole('button', { name: 'Delete project' }));
    const dialog = await screen.findByRole('alertdialog', { name: 'Delete Atlas?' });
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(dialog.isConnected).toBe(false));
  });
});

describe('TslDialogService', () => {
  @Component({
    template: `<h2 tslDialogTitle>Invite members</h2>`,
    imports: [TslDialogImports],
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  class InviteMembers {}

  afterEach(() =>
    document.querySelectorAll('.cdk-overlay-container').forEach((el) => (el.innerHTML = '')),
  );

  it('opens a component as a dialog and closes it with a result', async () => {
    await render(`<div></div>`);
    const ref = TestBed.inject(TslDialogService).open<string>(InviteMembers, {
      contentClass: 'max-w-xl',
    });
    const dialog = await screen.findByRole('dialog', { name: 'Invite members' });
    expect(
      dialog.querySelector('[data-slot=dialog-content]')?.className ?? dialog.className,
    ).toContain('max-w-xl');

    const result = new Promise<string | undefined>((resolve) => ref.closed$.subscribe(resolve));
    ref.close('sent');
    await expect(result).resolves.toBe('sent');
  });
});
