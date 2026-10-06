import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { TslButton } from '@tassili/ui/button';
import { TslCheckbox } from '@tassili/ui/checkbox';
import { TslLabel } from '@tassili/ui/label';
import { TslSheetImports } from './sheet';

const meta: Meta = {
  title: 'Overlays/Sheet',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...TslSheetImports, TslButton, TslCheckbox, TslLabel] })],
  parameters: {
    docs: {
      description: {
        component: `
A modal panel that slides in from an edge. Use it for secondary tasks that benefit from keeping the page in view: filters, details, settings, navigation on mobile.

\`\`\`ts
import { TslSheetImports } from '@tassili/ui/sheet';
\`\`\`

- \`position\`: \`start\` and \`end\` follow the reading direction (switch the Direction toolbar to RTL); \`top\` and \`bottom\` are fixed.
- \`position="bottom"\` works as a mobile **drawer**, with a grab handle and a height capped below the viewport.
- Sheets behave like dialogs: they need a title, trap focus, and close with Escape.
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const body = `
  <tsl-sheet-header>
    <h2 tslSheetTitle>Filters</h2>
    <p tslSheetDescription>Narrow down the project list.</p>
  </tsl-sheet-header>
  <div class="grid gap-3 px-5">
    @for (status of ['Active', 'Paused', 'Archived']; track status) {
      <div class="flex items-center gap-2">
        <tsl-checkbox [inputId]="'status-' + status" [checked]="status === 'Active'" />
        <label tslLabel [for]="'status-' + status">{{ status }}</label>
      </div>
    }
  </div>
  <tsl-sheet-footer>
    <button tslButton variant="outline" tslSheetClose>Reset</button>
    <button tslButton tslSheetClose>Show results</button>
  </tsl-sheet-footer>
`;

export const Positions: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap gap-3">
        @for (position of ['start', 'end', 'top', 'bottom']; track position) {
          <tsl-sheet [position]="position">
            <button tslButton variant="outline" tslSheetTrigger>Open {{ position }}</button>
            <tsl-sheet-content *tslSheetPortal="let ctx">${body}</tsl-sheet-content>
          </tsl-sheet>
        }
      </div>
    `,
  }),
};

export const MobileDrawer: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    template: `
      <tsl-sheet position="bottom">
        <button tslButton tslSheetTrigger>Filters</button>
        <tsl-sheet-content *tslSheetPortal="let ctx">${body}</tsl-sheet-content>
      </tsl-sheet>
    `,
  }),
};
