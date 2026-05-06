# Plyvo — Product

Mobile-first browser app that helps groups decide where to go by turning indecision into a short, playful ritual. Local-first, no backend, deployable as a static site.

## One-line

> Pick. Spin. Go.

## The job to be done

A group cannot decide where to eat / drink / go. Plyvo settles it in under a minute via an animated reveal that picks a winner.

It is **not** a discovery, review, or recommendation tool.

## Goals

- End indecision quickly.
- Make the result feel fun and satisfying.
- Beautiful and simple on mobile.
- Run entirely in the browser; no server.

## MVP scope

In:

- Create and save named pools.
- Add 3–8 options manually.
- Edit, delete, reorder options.
- Choose a reveal mode.
- Run the animated ritual.
- Show a winner screen.
- Persist recent history and settings in `localStorage`.

Out (v1):

- External APIs, accounts, sync, voting, ratings, reviews, photos, push, social sharing, mood filters.

## Screens

| Screen              | Purpose                                                                       |
| ------------------- | ----------------------------------------------------------------------------- |
| Home                | Brand, primary CTA, recent + saved pools, tagline                             |
| Pool Builder        | Create/edit pool: title, optional emoji, options list with add/edit/reorder   |
| Reveal Mode Picker  | Choose Spin / Plyvo / Dice with short description and visual preview          |
| Ritual              | Full-focus animated reveal, minimal chrome, ceremonial pacing                 |
| Winner              | Big winner name, optional note, actions: Reroll · Back to pool · Start over   |

## Reveal modes

- **Spin** — classic wheel; default quick-start, most intuitive.
- **Plyvo** — signature mode; theatrical, pulsing lights, cycling cards, glow.
- **Dice** — punchy, fast arcade randomness.

## UX direction

- Premium retro arcade — dark, polished, distinctive.
- One primary action per screen.
- Minimal text, large tap targets, fast nav.
- Animation for delight, not clutter.

## Visual tokens (high level)

- Dark background.
- Neon teal primary accent.
- Magenta/coral secondary accent.
- Warm gold for winner states.
- One bold display font for headings; one clean sans-serif for UI.

## Build order

1. Project setup with static-export-ready Next config.
2. App shell + mobile layout.
3. Local storage hooks + data model wiring.
4. Home screen + pool CRUD.
5. Reveal mode picker.
6. First ritual: **Spin**.
7. Winner screen + history.
8. Add **Plyvo** and **Dice** modes.
9. Visual polish, motion QA.
10. Static export and deploy.

## Principles

- One-job product.
- Mobile-first browser.
- Local-first persistence.
- Delight over feature count.
- Tight MVP that ships as a static site.
