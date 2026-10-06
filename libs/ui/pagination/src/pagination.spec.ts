import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../testing/axe';
import { TslPagination } from './pagination';
import { paginationRange } from './pagination-range';

describe('paginationRange', () => {
  it.each([
    [1, 5, [1, 2, 3, 4, 5]],
    [1, 10, [1, 2, 3, 4, 5, 'ellipsis', 10]],
    [4, 10, [1, 2, 3, 4, 5, 'ellipsis', 10]],
    [5, 10, [1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]],
    [7, 10, [1, 'ellipsis', 6, 7, 8, 9, 10]],
    [10, 10, [1, 'ellipsis', 6, 7, 8, 9, 10]],
    [99, 10, [1, 'ellipsis', 6, 7, 8, 9, 10]],
    [1, 0, []],
  ])('page %i of %i', (page, total, expected) => {
    expect(paginationRange(page, total)).toEqual(expected);
  });

  it('respects the sibling count', () => {
    expect(paginationRange(10, 20, 2)).toEqual([1, 'ellipsis', 8, 9, 10, 11, 12, 'ellipsis', 20]);
  });
});

describe('TslPagination', () => {
  it('marks the current page and labels each button', async () => {
    await render(`<tsl-pagination [page]="5" [pageCount]="10" />`, { imports: [TslPagination] });
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Page 5' }).getAttribute('aria-current')).toBe(
      'page',
    );
    expect(screen.getByRole('button', { name: 'Page 10' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Page 8' })).toBeNull();
  });

  it('changes page with the number, previous and next buttons', async () => {
    const user = userEvent.setup();
    const onPage = vi.fn();
    await render(`<tsl-pagination [page]="1" [pageCount]="3" (pageChange)="onPage($event)" />`, {
      imports: [TslPagination],
      componentProperties: { onPage },
    });
    expect(
      (screen.getByRole('button', { name: 'Previous page' }) as HTMLButtonElement).disabled,
    ).toBe(true);
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    await user.click(screen.getByRole('button', { name: 'Page 3' }));
    expect(onPage.mock.calls.map(([page]) => page)).toEqual([2, 3]);
    expect((screen.getByRole('button', { name: 'Next page' }) as HTMLButtonElement).disabled).toBe(
      true,
    );
  });

  it('has no accessibility violations', async () => {
    const { container } = await render(`<tsl-pagination [page]="5" [pageCount]="10" />`, {
      imports: [TslPagination],
    });
    await expectNoA11yViolations(container);
  });
});
