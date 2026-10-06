import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TslTheme } from '@tassili/ui/theme';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  /** Instantiated at startup so the stored or system theme is applied immediately. */
  protected readonly theme = inject(TslTheme);
}
