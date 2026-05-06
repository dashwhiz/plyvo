# Rituals — animation design

Each reveal mode is its own folder under `src/rituals/`. They share a contract:

```ts
type RitualProps = {
  options: Option[];
  onComplete: (winnerId: string) => void;
};
```

The mode picks a winner via `lib/random.ts` **before** animation starts, then animates *toward* that winner. This makes the result deterministic for a given run and avoids "the wheel landed elsewhere" bugs.

## Shared elements

- Mounted full-screen with a dim vignette.
- Top-left close button (small, low contrast).
- Bottom safe-area padding.
- On `prefers-reduced-motion` or `settings.reducedMotion`, skip animation, dissolve to winner over 240ms.

## Spin (default, ship first)

A wheel divided into 3–8 equal slices, each labeled with an option name + emoji.

**Mechanics:**
- Compute target angle so the chosen slice ends at the top pointer.
- Add 4–6 full rotations on top of the target angle.
- Animate `rotate` with `arcade.settle` over 2.2s.
- Tick sound on each slice crossing the pointer (computed by frame).

**Implementation:**
- Pure CSS conic gradient for slice colors, SVG `<text>` curved along arcs for labels.
- Single `motion.div` rotates the whole wheel.
- Pointer is fixed, drawn on top.

**Files:**
- `SpinRitual.tsx` — orchestrates state, computes target angle.
- `SpinWheel.tsx` — renders the wheel given a `rotation` prop.
- `useSpinAnimation.ts` — exposes `start(targetIndex)` and animation state.

## Plyvo (signature)

The branded mode. Stack of cards (3D perspective) cycles through options with rising tempo, then locks on the winner with a flash.

**Mechanics:**
1. Show 3 cards stacked center-screen. Each tick, top card flies off (translateY + rotate + fade), revealing next.
2. Cycle order is randomized; tempo accelerates from 350ms → 90ms over ~2s.
3. On final card (the winner), card scales 1 → 1.08 with gold glow, magenta-to-gold gradient sweep, screen flash.
4. Brief hold (400ms), then `onComplete(winnerId)`.

**Effects:**
- Pulsing radial glow behind the stack, color cycles teal → magenta on each tick.
- Subtle scanline overlay (CSS gradient, low opacity) for arcade vibe.
- Confetti fired from `canvas-confetti` at the moment of lock.

**Files:**
- `PlyvoRitual.tsx`
- `PlyvoCardStack.tsx`
- `usePlyvoSequence.ts` — generates the cycle plan (timings + order) up front.

## Dice (fast)

A single chunky die tumbles, lands, and the face it lands on maps to the winner.

**Mechanics:**
- For 3–6 options: standard d6, faces map directly.
- For 7–8 options: stylize as a d8 (octahedron with CSS 3D); rotate to a chosen face.
- Tumble = three sequential rotations on different axes, easing into a snap.
- Final face shows option name + emoji.

**Tone:** punchy. Whole reveal under 1.4s.

**Files:**
- `DiceRitual.tsx`
- `DiceCube.tsx` — pure CSS 3D cube with 6 (or 8) faces.
- `useDiceRoll.ts` — picks tumble keyframes for the target face.

## Why no library for the wheel/dice

Every off-the-shelf wheel I considered (`react-custom-roulette`, etc.) ships its own opinionated theme that fights the arcade aesthetic. A custom SVG wheel + `motion` is ~120 lines and fully ours. Same calculus for the dice — CSS 3D is a tiny amount of code and makes the look distinct.

## Random selection

`lib/random.ts` exports `pickWinner(options): { winner, index }` using `crypto.getRandomValues` for unbiased selection. Avoid `Math.random() * length | 0` — fine for casual use but we should set a higher bar for "fairness" since the whole product is about settling disputes.

```ts
export function pickWinner<T>(items: T[]): { winner: T; index: number } {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  // Rejection-sample to avoid modulo bias:
  const max = Math.floor(0xffffffff / items.length) * items.length;
  let n = buf[0];
  while (n >= max) {
    crypto.getRandomValues(buf);
    n = buf[0];
  }
  const index = n % items.length;
  return { winner: items[index], index };
}
```
