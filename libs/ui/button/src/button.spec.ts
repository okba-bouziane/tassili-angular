import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../testing/axe';
import { TslButton } from './button';

describe('TslButton', () => {
  it('renders a native button with type="button" by default', async () => {
    await render(`<button tslButton>Save changes</button>`, { imports: [TslButton] });
    const button = screen.getByRole('button', { name: 'Save changes' });
    expect(button.getAttribute('type')).toBe('button');
    expect(button.getAttribute('data-slot')).toBe('button');
  });

  it('keeps an explicit submit type', async () => {
    await render(`<button tslButton type="submit">Send</button>`, { imports: [TslButton] });
    expect(screen.getByRole('button').getAttribute('type')).toBe('submit');
  });

  it('applies variant and size classes and merges custom classes', async () => {
    await render(`<button tslButton variant="outline" size="sm" class="w-full px-8">Go</button>`, {
      imports: [TslButton],
    });
    const button = screen.getByRole('button');
    expect(button.className).toContain('border-input');
    expect(button.className).toContain('h-control-sm');
    expect(button.className).toContain('w-full');
    expect(button.className).toContain('px-8');
    expect(button.className).not.toContain('px-3');
  });

  it('handles clicks and keyboard activation', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    await render(`<button tslButton (click)="onClick()">Run</button>`, {
      imports: [TslButton],
      componentProperties: { onClick },
    });
    const button = screen.getByRole('button');
    await user.click(button);
    button.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('disables a native button', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    await render(`<button tslButton disabled (click)="onClick()">Run</button>`, {
      imports: [TslButton],
      componentProperties: { onClick },
    });
    const button = screen.getByRole('button');
    expect(button).toHaveProperty('disabled', true);
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('disables a link without removing it from the accessibility tree', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    await render(`<a tslButton href="/next" [disabled]="true" (click)="onClick()">Next</a>`, {
      imports: [TslButton],
      componentProperties: { onClick },
    });
    const link = screen.getByRole('link', { name: 'Next' });
    expect(link.getAttribute('aria-disabled')).toBe('true');
    expect(link.getAttribute('tabindex')).toBe('-1');
    expect(link.hasAttribute('type')).toBe(false);
    await user.click(link);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('has no accessibility violations across variants', async () => {
    const { container } = await render(
      `
      <button tslButton>Primary</button>
      <button tslButton variant="secondary">Secondary</button>
      <button tslButton variant="outline">Outline</button>
      <button tslButton variant="ghost">Ghost</button>
      <button tslButton variant="destructive">Delete</button>
      <a tslButton variant="link" href="/docs">Docs</a>
      <button tslButton size="icon" aria-label="Close">×</button>
      `,
      { imports: [TslButton] },
    );
    await expectNoA11yViolations(container);
  });
});
