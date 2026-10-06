import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { TslButton } from '@tassili/ui/button';
import { TslInput } from '@tassili/ui/input';
import { TslLabel } from '@tassili/ui/label';
import { TslAlertDialogImports, TslDialogImports } from './dialog';

const meta: Meta = {
  title: 'Overlays/Dialog',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [...TslDialogImports, ...TslAlertDialogImports, TslButton, TslInput, TslLabel],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component: `
Modal dialogs for focused tasks. Focus moves into the dialog, the page behind becomes inert, Escape closes it, and focus returns to the trigger.

\`\`\`ts
import { TslDialogImports, TslAlertDialogImports, TslDialogService } from '@tassili/ui/dialog';
\`\`\`

- Every dialog needs a \`tslDialogTitle\`; add a \`tslDialogDescription\` when the purpose isn't obvious from the title.
- Name the primary action after what it does ("Save changes", "Delete project"), never "OK".
- Use an **alert dialog** to confirm destructive or irreversible actions: it has no close button and ignores clicks outside.
- Open dialogs from code with \`TslDialogService.open(Component, { context })\`.
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
      <tsl-dialog>
        <button tslButton variant="outline" tslDialogTrigger>Edit profile</button>
        <tsl-dialog-content *tslDialogPortal="let ctx">
          <tsl-dialog-header>
            <h2 tslDialogTitle>Edit profile</h2>
            <p tslDialogDescription>Your name and handle are visible to everyone in the workspace.</p>
          </tsl-dialog-header>
          <div class="grid gap-4">
            <div class="grid gap-2">
              <label tslLabel for="name">Name</label>
              <input tslInput id="name" value="Okba Bouziane" />
            </div>
            <div class="grid gap-2">
              <label tslLabel for="handle">Handle</label>
              <input tslInput id="handle" value="okba" />
            </div>
          </div>
          <tsl-dialog-footer>
            <button tslButton variant="outline" tslDialogClose>Cancel</button>
            <button tslButton tslDialogClose>Save changes</button>
          </tsl-dialog-footer>
        </tsl-dialog-content>
      </tsl-dialog>
    `,
  }),
};

export const AlertDialog: Story = {
  render: () => ({
    template: `
      <tsl-alert-dialog>
        <button tslButton variant="destructive" tslAlertDialogTrigger>Delete project</button>
        <tsl-alert-dialog-content *tslAlertDialogPortal>
          <tsl-dialog-header>
            <h2 tslAlertDialogTitle>Delete “Atlas”?</h2>
            <p tslAlertDialogDescription>This permanently removes the project, its 14 pages and all comments. You can't undo this.</p>
          </tsl-dialog-header>
          <tsl-dialog-footer>
            <button tslButton variant="outline" tslDialogClose>Cancel</button>
            <button tslButton variant="destructive" tslDialogClose>Delete project</button>
          </tsl-dialog-footer>
        </tsl-alert-dialog-content>
      </tsl-alert-dialog>
    `,
  }),
};

export const LongContent: Story = {
  render: () => ({
    props: { sections: Array.from({ length: 12 }, (_, index) => index + 1) },
    template: `
      <tsl-dialog>
        <button tslButton variant="outline" tslDialogTrigger>Read the terms</button>
        <tsl-dialog-content *tslDialogPortal="let ctx" class="grid-rows-[auto_1fr_auto] overflow-hidden">
          <tsl-dialog-header>
            <h2 tslDialogTitle>Terms of service</h2>
            <p tslDialogDescription>Last updated October 2026.</p>
          </tsl-dialog-header>
          <div class="-mx-6 overflow-y-auto px-6">
            @for (section of sections; track section) {
              <p class="mb-3 text-sm text-muted-foreground">
                {{ section }}. Tassili is provided as is. You keep ownership of the content you create, and you can export or delete it at any time from your workspace settings.
              </p>
            }
          </div>
          <tsl-dialog-footer>
            <button tslButton tslDialogClose>I agree</button>
          </tsl-dialog-footer>
        </tsl-dialog-content>
      </tsl-dialog>
    `,
  }),
};
