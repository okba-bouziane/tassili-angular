import { render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { TslButton } from '@tassili/ui/button';
import { expectNoA11yViolations } from '../../testing/axe';
import { TslSheetImports, type TslSheetPosition } from './sheet';

function template(position: TslSheetPosition, dir = 'ltr') {
  return `
    <div dir="${dir}">
      <tsl-sheet position="${position}">
        <button tslButton tslSheetTrigger>Filters</button>
        <tsl-sheet-content *tslSheetPortal="let ctx">
          <tsl-sheet-header>
            <h2 tslSheetTitle>Filters</h2>
            <p tslSheetDescription>Narrow down the project list.</p>
          </tsl-sheet-header>
        </tsl-sheet-content>
      </tsl-sheet>
    </div>
  `;
}

async function open(position: TslSheetPosition, dir = 'ltr') {
  const user = userEvent.setup();
  await render(template(position, dir), { imports: [...TslSheetImports, TslButton] });
  await user.click(screen.getByRole('button', { name: 'Filters' }));
  const dialog = await screen.findByRole('dialog', { name: 'Filters' });
  return { user, dialog, content: dialog.querySelector('[data-slot=sheet-content]') ?? dialog };
}

describe('TslSheet', () => {
  afterEach(() =>
    document.querySelectorAll('.cdk-overlay-container').forEach((el) => (el.innerHTML = '')),
  );

  it('opens from the end of the reading direction by default', async () => {
    const { content } = await open('end');
    expect(content.getAttribute('data-side')).toBe('right');
  });

  it('mirrors start and end in right-to-left layouts', async () => {
    const { content } = await open('end', 'rtl');
    expect(content.getAttribute('data-side')).toBe('left');
  });

  it('shows a grab handle when opened from the bottom', async () => {
    const { content } = await open('bottom');
    expect(content.getAttribute('data-side')).toBe('bottom');
    expect(content.querySelector('.rounded-full[aria-hidden=true]')).not.toBeNull();
  });

  it('closes with Escape and with the close button', async () => {
    const { user } = await open('start');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());

    await user.click(screen.getByRole('button', { name: 'Filters' }));
    await user.click(await screen.findByRole('button', { name: 'Close' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('has no accessibility violations when open', async () => {
    await open('end');
    await expectNoA11yViolations(document.body);
  });
});
