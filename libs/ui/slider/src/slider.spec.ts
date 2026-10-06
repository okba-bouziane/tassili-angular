import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { fireEvent, render, screen } from '@testing-library/angular';
import { expectNoA11yViolations } from '../../testing/axe';
import { TslSlider } from './slider';

// Thumbs stay visibility:hidden until brain measures the track, which jsdom cannot do,
// so queries include hidden elements. In a browser they become visible immediately.
const hidden = { hidden: true } as const;

describe('TslSlider', () => {
  it('exposes a slider with its value range', async () => {
    await render(`<tsl-slider aria-label="Volume" [value]="[40]" [min]="0" [max]="100" />`, {
      imports: [TslSlider],
    });
    const thumb = await screen.findByRole('slider', hidden);
    expect(thumb.getAttribute('aria-label')).toBe('Volume');
    expect(thumb.getAttribute('aria-valuenow')).toBe('40');
    expect(thumb.getAttribute('aria-valuemin')).toBe('0');
    expect(thumb.getAttribute('aria-valuemax')).toBe('100');
  });

  it('moves with the keyboard and updates the form value', async () => {
    const control = new FormControl([50]);
    await render(`<tsl-slider aria-label="Volume" [step]="5" [formControl]="control" />`, {
      imports: [TslSlider, ReactiveFormsModule],
      componentProperties: { control },
    });
    const thumb = await screen.findByRole('slider', hidden);
    fireEvent.keyDown(thumb, { key: 'ArrowRight' });
    expect(control.value).toEqual([55]);
    fireEvent.keyDown(thumb, { key: 'Home' });
    expect(control.value).toEqual([0]);
    fireEvent.keyDown(thumb, { key: 'End' });
    expect(control.value).toEqual([100]);
  });

  it('renders two thumbs for a range', async () => {
    await render(`<tsl-slider aria-label="Price" [value]="[20, 80]" />`, { imports: [TslSlider] });
    expect(await screen.findAllByRole('slider', hidden)).toHaveLength(2);
  });

  it('has no accessibility violations', async () => {
    const { container } = await render(
      `<tsl-slider aria-label="Volume" [value]="[40]" /><tsl-slider aria-label="Price" [value]="[20, 80]" showTicks />`,
      { imports: [TslSlider] },
    );
    const thumbs = await screen.findAllByRole('slider', hidden);
    thumbs.forEach((thumb) => (thumb.style.visibility = 'visible'));
    await expectNoA11yViolations(container);
  });
});
