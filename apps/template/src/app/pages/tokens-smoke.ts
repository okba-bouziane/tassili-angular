import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Temporary page proving the token preset compiles; replaced in Phase 3. */
@Component({
  selector: 'app-tokens-smoke',
  template: `
    <main class="mx-auto max-w-(--tsl-container-lg) p-6">
      <h1 class="text-5xl">Tassili</h1>
      <p class="text-muted-foreground mt-2">
        Tokens, themes and type, compiled through Tailwind v4.
      </p>
      <button
        type="button"
        class="bg-primary text-primary-foreground hover:bg-primary-hover h-control-md rounded-md px-4 text-sm font-medium transition-colors duration-fast focus-ring mt-4"
      >
        Continue
      </button>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokensSmoke {}
