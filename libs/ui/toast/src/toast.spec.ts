import { Directionality } from '@angular/cdk/bidi';
import { signal } from '@angular/core';
import { render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../testing/axe';
import { toast, TslToaster } from './toast';

describe('TslToaster', () => {
  afterEach(() => toast.dismiss());

  it('renders toasts in a labelled live region', async () => {
    await render(`<tsl-toaster />`, { imports: [TslToaster] });
    toast.success('Invitation sent', { description: 'Amina will get an email shortly.' });
    expect(await screen.findByText('Invitation sent')).toBeTruthy();
    expect(screen.getByText('Amina will get an email shortly.')).toBeTruthy();
    const region = document.querySelector('section[aria-label]');
    expect(region?.getAttribute('aria-label')).toMatch(/Notifications/);
    expect(document.querySelector('[aria-live]')).not.toBeNull();
  });

  it('runs the action button', async () => {
    const user = userEvent.setup();
    const onUndo = vi.fn();
    await render(`<tsl-toaster />`, { imports: [TslToaster] });
    toast('Project archived', { action: { label: 'Undo', onClick: onUndo } });
    await user.click(await screen.findByRole('button', { name: 'Undo' }));
    expect(onUndo).toHaveBeenCalledOnce();
  });

  it('maps logical positions to the reading direction', async () => {
    const { container } = await render(`<tsl-toaster position="bottom-end" />`, {
      imports: [TslToaster],
      providers: [
        {
          provide: Directionality,
          useValue: {
            value: 'rtl',
            valueSignal: signal('rtl'),
            change: { subscribe: () => ({ unsubscribe: () => undefined }) },
          },
        },
      ],
    });
    toast('Saved');
    await screen.findByText('Saved');
    await waitFor(() =>
      expect(container.querySelector('[data-x-position]')?.getAttribute('data-x-position')).toBe(
        'left',
      ),
    );
  });

  it('has no accessibility violations with a toast shown', async () => {
    const { container } = await render(`<tsl-toaster />`, { imports: [TslToaster] });
    toast.error("Couldn't connect to the server. Try again.");
    await screen.findByText("Couldn't connect to the server. Try again.");
    // Known upstream markup in sonner: each toast is <li role="status"> inside an <ol>.
    // Toasts are still announced as polite live regions; tracked as an upstream issue.
    await expectNoA11yViolations(container, {
      'aria-allowed-role': { enabled: false },
      list: { enabled: false },
    });
  });
});
