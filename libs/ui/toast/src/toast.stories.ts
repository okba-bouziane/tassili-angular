import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { TslButton } from '@tassili/ui/button';
import { toast, TslToaster } from './toast';

const meta: Meta = {
  title: 'Overlays/Toast',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [TslToaster, TslButton] })],
  parameters: {
    docs: {
      description: {
        component: `
Brief, non-blocking messages about something that just happened.

\`\`\`ts
import { toast, TslToaster } from '@tassili/ui/toast';
\`\`\`

- Add \`<tsl-toaster />\` once near the app root, then call \`toast()\` from anywhere.
- Say what happened in past tense ("Invitation sent"); errors say what to do next.
- Offer **Undo** as an action instead of asking for confirmation, where the action can be reversed.
- \`position\` uses \`start\`/\`end\`, so toasts move to the correct corner in RTL.
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Types: Story = {
  render: () => ({
    props: {
      show: (type: string) => {
        switch (type) {
          case 'success':
            return toast.success('Invitation sent', {
              description: 'Amina will get an email shortly.',
            });
          case 'error':
            return toast.error("Couldn't connect to the server", {
              description: 'Check your connection and try again.',
            });
          case 'warning':
            return toast.warning('Storage almost full', {
              description: "You've used 92% of your plan.",
            });
          case 'info':
            return toast.info('New version available', {
              description: 'Reload to get the latest features.',
            });
          case 'action':
            return toast('Project archived', {
              action: { label: 'Undo', onClick: () => toast('Project restored') },
            });
          case 'promise':
            return toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
              loading: 'Saving changes…',
              success: 'Changes saved',
              error: "Couldn't save changes",
            });
          default:
            return toast('Draft saved');
        }
      },
    },
    template: `
      <tsl-toaster />
      <div class="flex flex-wrap gap-2">
        @for (type of ['default', 'success', 'error', 'warning', 'info', 'action', 'promise']; track type) {
          <button tslButton variant="outline" (click)="show(type)">{{ type }}</button>
        }
      </div>
    `,
  }),
};
