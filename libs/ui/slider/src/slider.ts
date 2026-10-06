import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {
  BrnSlider,
  BrnSliderRange,
  BrnSliderThumb,
  BrnSliderTick,
  BrnSliderTrack,
  injectBrnSlider,
} from '@spartan-ng/brain/slider';
import { cn, type ClassValue } from '@tassili/ui/core';

/**
 * Picks a number, or a range with two thumbs, from a continuous scale.
 *
 * ```html
 * <tsl-slider aria-label="Volume" [value]="[40]" [max]="100" />
 * <tsl-slider aria-label="Price" [value]="[20, 80]" [step]="5" showTicks />
 * ```
 *
 * The value is always an array (one entry per thumb). Arrow keys move by `step`,
 * Page Up/Down by larger steps, Home/End to the ends. Works with forms.
 */
@Component({
  selector: 'tsl-slider',
  imports: [BrnSliderTrack, BrnSliderRange, BrnSliderThumb, BrnSliderTick],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: BrnSlider,
      inputs: [
        'id',
        'value',
        'disabled',
        'min',
        'max',
        'step',
        'minStepsBetweenThumbs',
        'maxStepsBetweenThumbs',
        'preventStepOverThumb',
        'inverted',
        'orientation',
        'showTicks',
        'maxTicks',
        'tickLabelInterval',
        'formatTick',
        'draggableRange',
        'draggableRangeOnly',
        'aria-label',
        'aria-labelledby',
      ],
      outputs: ['valueChange'],
    },
  ],
  host: {
    '[class]': 'computedClass()',
    '[attr.data-orientation]': 'slider.orientation()',
    // The accessible name belongs on the thumbs (role="slider"), not the wrapper.
    '[attr.aria-label]': 'null',
    '[attr.aria-labelledby]': 'null',
  },
  template: `
    <div
      class="relative flex w-full items-center group-data-[orientation=vertical]/slider:h-full group-data-[orientation=vertical]/slider:w-auto group-data-[orientation=vertical]/slider:flex-col"
    >
      <div
        brnSliderTrack
        class="relative grow overflow-hidden rounded-full bg-secondary data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
      >
        <div
          brnSliderRange
          class="absolute bg-primary select-none data-draggable-range:cursor-move data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
        ></div>
      </div>
      @for (index of slider.thumbIndexes(); track index) {
        <span
          brnSliderThumb
          class="absolute block size-4 shrink-0 cursor-grab rounded-full border-2 border-primary bg-background shadow-sm select-none transition-[box-shadow] duration-fast ease-out after:absolute after:-inset-1 hover:ring-4 hover:ring-ring/15 active:cursor-grabbing"
        ></span>
      }
    </div>

    @if (slider.showTicks()) {
      <div
        class="mt-3 flex w-full items-start justify-between gap-1 px-2 text-xs font-medium text-muted-foreground group-data-inverted/slider:flex-row-reverse group-data-[orientation=vertical]/slider:mt-0 group-data-[orientation=vertical]/slider:ms-3 group-data-[orientation=vertical]/slider:w-auto group-data-[orientation=vertical]/slider:flex-col-reverse group-data-[orientation=vertical]/slider:px-0 group-data-[orientation=vertical]/slider:py-2"
      >
        <div
          *brnSliderTick="let tick; let formattedTick = formattedTick"
          class="group/tick flex w-0 flex-col items-center justify-center gap-1.5 group-data-[orientation=vertical]/slider:h-0 group-data-[orientation=vertical]/slider:w-auto group-data-[orientation=vertical]/slider:flex-row"
        >
          <div
            class="h-1 w-px bg-border group-data-[orientation=vertical]/slider:h-px group-data-[orientation=vertical]/slider:w-1"
          ></div>
          <div class="text-center group-data-[skip]/tick:opacity-0">{{ formattedTick }}</div>
        </div>
      </div>
    }
  `,
})
export class TslSlider {
  protected readonly slider = injectBrnSlider();
  /** Extra classes, merged so they can override the defaults. */
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly computedClass = computed(() =>
    cn(
      'group/slider flex w-full touch-none flex-col py-1 select-none',
      'data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-40 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-row data-[orientation=vertical]:px-1 data-[orientation=vertical]:py-0',
      'data-disabled:pointer-events-none data-disabled:opacity-50',
      this.userClass(),
    ),
  );
}
