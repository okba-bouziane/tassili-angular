import { LucideChevronRight, LucideSearch } from '@lucide/angular';
import { render, screen } from '@testing-library/angular';
import { expectNoA11yViolations } from '../../testing/axe';
import { TslIcon } from './icon';

describe('TslIcon', () => {
  it('renders a decorative icon hidden from assistive tech', async () => {
    const { container } = await render(`<tsl-icon [icon]="icon" />`, {
      imports: [TslIcon],
      componentProperties: { icon: LucideSearch },
    });
    const host = container.querySelector('tsl-icon');
    expect(host?.getAttribute('aria-hidden')).toBe('true');
    expect(host?.querySelector('svg')).not.toBeNull();
    expect(host?.className).toContain('size-4');
  });

  it('exposes a labelled icon as an image', async () => {
    await render(`<tsl-icon [icon]="icon" label="Search" />`, {
      imports: [TslIcon],
      componentProperties: { icon: LucideSearch },
    });
    expect(screen.getByRole('img', { name: 'Search' })).toBeTruthy();
  });

  it('applies the size scale, stroke width and RTL mirroring', async () => {
    const { container } = await render(`<tsl-icon [icon]="icon" size="xl" mirrorInRtl />`, {
      imports: [TslIcon],
      componentProperties: { icon: LucideChevronRight },
    });
    const host = container.querySelector('tsl-icon');
    expect(host?.className).toContain('size-6');
    expect(host?.className).toContain('rtl:-scale-x-100');
    expect(host?.querySelector('svg')?.getAttribute('stroke-width')).toBe('1.75');
  });

  it('has no accessibility violations', async () => {
    const { container } = await render(
      `<p>Find <tsl-icon [icon]="icon" /></p><tsl-icon [icon]="icon" label="Search" />`,
      { imports: [TslIcon], componentProperties: { icon: LucideSearch } },
    );
    await expectNoA11yViolations(container);
  });
});
