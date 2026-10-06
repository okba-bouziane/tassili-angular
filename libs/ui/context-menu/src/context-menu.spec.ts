import { fireEvent, render, screen, waitFor } from '@testing-library/angular';
import { TslDropdownMenuImports } from '@tassili/ui/dropdown-menu';
import { TslContextMenuTrigger } from './context-menu';

describe('TslContextMenuTrigger', () => {
  afterEach(() =>
    document.querySelectorAll('.cdk-overlay-container').forEach((el) => (el.innerHTML = '')),
  );

  const template = `
    <div [tslContextMenuTrigger]="menu" [disabled]="disabled" data-testid="area">Right-click a file</div>
    <ng-template #menu>
      <tsl-dropdown-menu>
        <button tslDropdownMenuItem>Rename</button>
        <button tslDropdownMenuItem variant="destructive">Delete</button>
      </tsl-dropdown-menu>
    </ng-template>
  `;

  it('opens the menu on right-click', async () => {
    await render(template, {
      imports: [TslContextMenuTrigger, ...TslDropdownMenuImports],
      componentProperties: { disabled: false },
    });
    fireEvent.contextMenu(screen.getByTestId('area'), { clientX: 20, clientY: 20 });
    expect(await screen.findByRole('menu')).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: 'Rename' })).toBeTruthy();
  });

  it('does nothing when disabled', async () => {
    await render(template, {
      imports: [TslContextMenuTrigger, ...TslDropdownMenuImports],
      componentProperties: { disabled: true },
    });
    fireEvent.contextMenu(screen.getByTestId('area'), { clientX: 20, clientY: 20 });
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  });
});
