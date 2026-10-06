import { render, screen } from '@testing-library/angular';
import { expectNoA11yViolations } from '../../testing/axe';
import { initialsOf, TslAvatar, TslAvatarGroup } from './avatar';

describe('initialsOf', () => {
  it.each([
    ['Okba Bouziane', 'OB'],
    ['  amina  ', 'A'],
    ['Jean Paul Sartre', 'JS'],
    ['', ''],
  ])('%s → %s', (name, expected) => {
    expect(initialsOf(name)).toBe(expected);
  });
});

describe('TslAvatar', () => {
  it('is one image named after the person, showing initials as fallback', async () => {
    await render(`<tsl-avatar name="Okba Bouziane" />`, { imports: [TslAvatar] });
    const avatar = screen.getByRole('img', { name: 'Okba Bouziane' });
    expect(avatar.textContent?.trim()).toBe('OB');
  });

  it('is hidden from assistive tech when decorative', async () => {
    const { container } = await render(`<tsl-avatar name="Okba Bouziane" decorative />`, {
      imports: [TslAvatar],
    });
    expect(screen.queryByRole('img')).toBeNull();
    expect(container.querySelector('tsl-avatar')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('keeps the initials until the image has loaded', async () => {
    // The <img> stays detached until it loads (verified in the browser via Storybook).
    const { container } = await render(`<tsl-avatar name="Okba Bouziane" src="/missing.jpg" />`, {
      imports: [TslAvatar],
    });
    expect(container.querySelector('tsl-avatar img')).toBeNull();
    expect(container.textContent?.trim()).toBe('OB');
  });

  it('applies size and shape', async () => {
    const { container } = await render(`<tsl-avatar name="A" size="lg" shape="square" />`, {
      imports: [TslAvatar],
    });
    const inner = container.querySelector('brn-avatar');
    expect(inner?.className).toContain('size-12');
    expect(inner?.className).toContain('rounded-md');
  });

  it('has no accessibility violations in a group', async () => {
    const { container } = await render(
      `<tsl-avatar-group><tsl-avatar name="Okba Bouziane" /><tsl-avatar name="Amina Haddad" /></tsl-avatar-group>`,
      { imports: [TslAvatar, TslAvatarGroup] },
    );
    await expectNoA11yViolations(container);
  });
});
