import { render } from '@testing-library/angular';
import { TslSkeleton } from './skeleton';

describe('TslSkeleton', () => {
  it('is hidden from assistive tech and accepts sizing classes', async () => {
    const { container } = await render(`<tsl-skeleton class="h-4 w-40" />`, {
      imports: [TslSkeleton],
    });
    const skeleton = container.querySelector('tsl-skeleton');
    expect(skeleton?.getAttribute('aria-hidden')).toBe('true');
    expect(skeleton?.className).toContain('animate-pulse');
    expect(skeleton?.className).toContain('w-40');
  });
});
