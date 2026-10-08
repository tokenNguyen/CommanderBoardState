# Commander Board Tracker

A single-page web app (no build step) for keeping track of the battlefield during
in-person Magic: The Gathering Commander games. Card data and images come from the
[Scryfall API](https://scryfall.com/docs/api).

## What it tracks

- **Players and life.** Four players by default (add or remove as needed), 40 life each.
  The current player's life total and board totals stay pinned at the top of the screen.
- **Commander damage.** Damage taken from each opponent's commander, with a warning at 15
  and lethal at 21. Optionally also lowers the life total.
- **Creatures.** Search Scryfall as you type; the card's image, power/toughness, keywords,
  type line and rules text are filled in. Each creature is shown as its full card.
  - Tap a card to attack: it turns sideways. Summoning-sick creatures can't attack unless
    they have haste; creatures with vigilance attack without tapping.
  - Icons on the card show +1/+1 or -1/-1 counters, until-end-of-turn boosts, keywords,
    attacking and summoning sickness. The badge in the corner is the current power/toughness.
  - The ⓘ button opens the card's details: full card (with flip for double-faced cards),
    rules text, a power/toughness breakdown, and every control.
- **Token groups.** Many identical tokens in one tile, with counts for total, tapped,
  attacking and summoning sick. Split one off when it gets its own counter or aura.
- **Totals.** Attacking power, and the toughness and power of untapped creatures available
  to block.
- **Next turn** clears until-end-of-turn effects and attack flags, then untaps the next
  player's creatures and removes their summoning sickness.

The game is saved in the browser automatically (localStorage), so a refresh doesn't lose it.

## Running it

Open `index.html` in a browser. Card search needs an internet connection; everything
else works offline.

## Deploying

The site is plain static files, so Vercel serves it with no configuration. Every push to
GitHub redeploys it. `deploy.ps1` commits and pushes in one step:

```powershell
powershell -ExecutionPolicy Bypass -File deploy.ps1 -Message "what changed"
```
