import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { TslDropdownMenuImports } from '@tassili/ui/dropdown-menu';
import { TslBreadcrumbImports } from './breadcrumb';

const meta: Meta = {
  title: 'Navigation/Breadcrumb',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...TslBreadcrumbImports, ...TslDropdownMenuImports] })],
  parameters: {
    docs: {
      description: {
        component: `
Shows where the current page sits and links back up the hierarchy.

\`\`\`ts
import { TslBreadcrumbImports } from '@tassili/ui/breadcrumb';
\`\`\`

- The last item is the current page (\`tslBreadcrumbPage\`), not a link.
- Collapse long trails with \`tsl-breadcrumb-ellipsis\` inside a dropdown menu trigger.
- Separators mirror in RTL and are hidden from screen readers.
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `
      <nav tslBreadcrumb>
        <ol tslBreadcrumbList>
          <li tslBreadcrumbItem><a tslBreadcrumbLink href="#">Home</a></li>
          <li tslBreadcrumbSeparator></li>
          <li tslBreadcrumbItem><a tslBreadcrumbLink href="#">Projects</a></li>
          <li tslBreadcrumbSeparator></li>
          <li tslBreadcrumbItem><span tslBreadcrumbPage>Atlas</span></li>
        </ol>
      </nav>
    `,
  }),
};

export const Collapsed: Story = {
  render: () => ({
    template: `
      <nav tslBreadcrumb>
        <ol tslBreadcrumbList>
          <li tslBreadcrumbItem><a tslBreadcrumbLink href="#">Home</a></li>
          <li tslBreadcrumbSeparator></li>
          <li tslBreadcrumbItem>
            <button type="button" class="rounded-sm focus-ring hover:text-foreground" aria-label="Show hidden pages" [tslDropdownMenuTrigger]="hidden">
              <tsl-breadcrumb-ellipsis />
            </button>
          </li>
          <li tslBreadcrumbSeparator></li>
          <li tslBreadcrumbItem><a tslBreadcrumbLink href="#">Design system</a></li>
          <li tslBreadcrumbSeparator></li>
          <li tslBreadcrumbItem><span tslBreadcrumbPage>Tokens</span></li>
        </ol>
      </nav>
      <ng-template #hidden>
        <tsl-dropdown-menu>
          <a tslDropdownMenuItem href="#">Workspace</a>
          <a tslDropdownMenuItem href="#">Projects</a>
        </tsl-dropdown-menu>
      </ng-template>
    `,
  }),
};

export const CustomSeparator: Story = {
  render: () => ({
    template: `
      <nav tslBreadcrumb>
        <ol tslBreadcrumbList>
          <li tslBreadcrumbItem><a tslBreadcrumbLink href="#">Docs</a></li>
          <li tslBreadcrumbSeparator>/</li>
          <li tslBreadcrumbItem><a tslBreadcrumbLink href="#">Components</a></li>
          <li tslBreadcrumbSeparator>/</li>
          <li tslBreadcrumbItem><span tslBreadcrumbPage>Breadcrumb</span></li>
        </ol>
      </nav>
    `,
  }),
};
