import { render, screen } from '@testing-library/angular';
import { expectNoA11yViolations } from '../../testing/axe';
import { TslBadge } from './badge';

describe('TslBadge', () => {
  it('defaults to the secondary variant', async () => {
    await render(`<span tslBadge>Draft</span>`, { imports: [TslBadge] });
    const badge = screen.getByText('Draft');
    expect(badge.className).toContain('bg-secondary');
    expect(badge.getAttribute('data-slot')).toBe('badge');
  });

  it('applies variants, sizes and custom classes', async () => {
    await render(`<span tslBadge variant="success" size="sm" class="uppercase">Paid</span>`, {
      imports: [TslBadge],
    });
    const badge = screen.getByText('Paid');
    expect(badge.className).toContain('bg-success');
    expect(badge.className).toContain('h-5');
    expect(badge.className).toContain('uppercase');
  });

  it('works on links and has no accessibility violations', async () => {
    const { container } = await render(
      `<a tslBadge variant="outline" href="/tags/angular">Angular</a>
       <span tslBadge variant="destructive">Overdue</span>`,
      { imports: [TslBadge] },
    );
    expect(screen.getByRole('link', { name: 'Angular' })).toBeTruthy();
    await expectNoA11yViolations(container);
  });
});
