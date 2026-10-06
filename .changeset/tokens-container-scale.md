---
'@tassili/tokens': patch
---

Stop overriding Tailwind's `--container-*` scale, so `max-w-sm`/`max-w-lg` keep their standard sizes. Page widths remain available as `max-w-(--tsl-container-*)`.
