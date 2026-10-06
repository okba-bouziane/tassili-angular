import { render, screen } from '@testing-library/angular';
import { expectNoA11yViolations } from '../../testing/axe';
import { TslBreadcrumbImports } from './breadcrumb';

const template = `
  <nav tslBreadcrumb>
    <ol tslBreadcrumbList>
      <li tslBreadcrumbItem><a tslBreadcrumbLink href="/">Home</a></li>
      <li tslBreadcrumbSeparator></li>
      <li tslBreadcrumbItem><tsl-breadcrumb-ellipsis /></li>
      <li tslBreadcrumbSeparator></li>
      <li tslBreadcrumbItem><a tslBreadcrumbLink href="/projects">Projects</a></li>
      <li tslBreadcrumbSeparator></li>
      <li tslBreadcrumbItem><span tslBreadcrumbPage>Atlas</span></li>
    </ol>
  </nav>
`;

describe('TslBreadcrumb', () => {
  it('renders a labelled trail with the current page marked', async () => {
    await render(template, { imports: [...TslBreadcrumbImports] });
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Projects' }).getAttribute('href')).toBe('/projects');
    expect(screen.getByText('Atlas').getAttribute('aria-current')).toBe('page');
    expect(screen.getByText('More pages').className).toContain('sr-only');
  });

  it('hides separators from assistive tech', async () => {
    const { container } = await render(template, { imports: [...TslBreadcrumbImports] });
    const separators = container.querySelectorAll('[data-slot=breadcrumb-separator]');
    expect(separators).toHaveLength(3);
    separators.forEach((separator) => expect(separator.getAttribute('aria-hidden')).toBe('true'));
  });

  it('has no accessibility violations', async () => {
    const { container } = await render(template, { imports: [...TslBreadcrumbImports] });
    await expectNoA11yViolations(container);
  });
});
