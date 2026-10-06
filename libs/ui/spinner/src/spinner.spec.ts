import { render, screen } from '@testing-library/angular';
import { expectNoA11yViolations } from '../../testing/axe';
import { TslSpinner } from './spinner';

describe('TslSpinner', () => {
  it('announces loading by default', async () => {
    await render(`<tsl-spinner />`, { imports: [TslSpinner] });
    expect(screen.getByRole('status', { name: 'Loading' })).toBeTruthy();
  });

  it('uses a custom label and size', async () => {
    const { container } = await render(`<tsl-spinner label="Saving changes" size="lg" />`, {
      imports: [TslSpinner],
    });
    expect(screen.getByRole('status', { name: 'Saving changes' })).toBeTruthy();
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('size-6');
  });

  it('is hidden when decorative', async () => {
    await render(`<tsl-spinner decorative />`, { imports: [TslSpinner] });
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('has no accessibility violations', async () => {
    const { container } = await render(`<tsl-spinner />`, { imports: [TslSpinner] });
    await expectNoA11yViolations(container);
  });
});
