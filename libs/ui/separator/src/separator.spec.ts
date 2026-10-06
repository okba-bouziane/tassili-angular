import { render, screen } from '@testing-library/angular';
import { TslSeparator } from './separator';

describe('TslSeparator', () => {
  it('is decorative and horizontal by default', async () => {
    const { container } = await render(`<tsl-separator />`, { imports: [TslSeparator] });
    const separator = container.querySelector('tsl-separator');
    expect(separator?.getAttribute('role')).toBe('none');
    expect(separator?.getAttribute('data-orientation')).toBe('horizontal');
    expect(separator?.className).toContain('h-px');
  });

  it('is announced when not decorative', async () => {
    await render(`<tsl-separator orientation="vertical" [decorative]="false" />`, {
      imports: [TslSeparator],
    });
    const separator = screen.getByRole('separator');
    expect(separator.getAttribute('aria-orientation')).toBe('vertical');
  });
});
