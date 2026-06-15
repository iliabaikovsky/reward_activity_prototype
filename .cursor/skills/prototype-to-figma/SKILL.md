---
name: prototype-to-figma
description: Export prototype screens to Figma via MCP — INVENTORY, SLOT, incremental VISUAL gates, RENDER. CE-3142 config in docs appendices.
---

# Prototype → Figma

## Mindset

**INVENTORY first** — local composites in target file before library/reference.  
**Universal categories** (canvas, chrome, field list, …) before component names.  
**Visual truth** — raster Figma screenshot, not plugin readback.  
**Incremental gates** — Gate-F → Gate-GH → Gate-full; block on FAIL.

## Before any `use_figma`

1. [`FIGMA_FROM_PROTOTYPE.md`](../../../docs/design/FIGMA_FROM_PROTOTYPE.md) — §1–2
2. [`FIGMA_NAMING.md`](../../../docs/design/FIGMA_NAMING.md) — §2 composites + Appendix C node ids
3. [`FIGMA_VISUAL_QA.md`](../../../docs/design/FIGMA_VISUAL_QA.md) — TRACE + incremental gates
4. Project §3 + appendices (CE-3142)
5. MCP **`figma-use`** + [`.cursor/rules/figma-prototype-to-figma.mdc`](../../rules/figma-prototype-to-figma.mdc)

## INVENTORY (mandatory pre-flight)

1. Read Appendix C + `FIGMA_NAMING.md` §2.
2. `get_metadata` on project Components page — list local `Exness Rewards / …` composites.
3. Map screen template → composite (Order detail → **Summary** instance).
4. **List in user response:** which local instances (name + node-id) will be used.

❌ Inline hero if Summary composite exists.  
❌ Skip Components page inspect.  
❌ Blind clone designer reference for primary block data.

## Workflow

```text
TARGET (code + screenshot + state)
  → INVENTORY (local composites)
  → library-first for gaps only
  → assemble (Summary = instance from INVENTORY)
  → Gate-F: screenshot Summary, compare F — BLOCK if FAIL
  → field list rows
  → Gate-GH: screenshot rows, compare G+H — BLOCK if FAIL
  → Gate-full: screenshot frame, compare A–K
  → RENDER fix loop + re-screenshot
  → §D lesson same session
```

## Incremental gates

| Gate | When | Block |
|------|------|-------|
| **Gate-F** | after Summary instance placed | FAIL F → no rows |
| **Gate-GH** | after all KV rows | placeholder Label/Title = FAIL |
| **Gate-full** | before user reply | full A–K table |

User canvas screenshot = immediate Gate-full.

## VISUAL gate (§1.10)

- `get_screenshot` MCP and/or `frame.screenshot()` — **analyze pixels**
- Compare to `docs/screenshots/` for same state
- Table in response: category · prototype · **Figma visual** · status
- Readback is debug only

## REHYDRATE (§1.8a — before detach)

For DS instances with stale canvas but OK readback:

1. TEXT `setProperties` if available
2. Nested INK (`characters` twice)
3. Re-apply all `componentProperties` snapshot
4. Toggle harmless VARIANT/BOOLEAN → restore
5. `swapComponent(mainComponent)` on **nested** instance (Badge, End accessory) — not root TableView Cell
6. Re-INK; verify readback + screenshot

Never: detach, overlay text, wrapper, `resetOverrides` without re-gate.

## RENDER (§1.11)

readback OK + screenshot FAIL → REHYDRATE first; after 2 cycles escalate in §D.

## INK / SLOT

INK: TEXT prop → nested TEXT → visual verify (not readback alone).  
SLOT: inspect prop types; list row — check end-content swap **and** accessory slot.

## Export checklist

See rule `figma-prototype-to-figma.mdc` — all boxes must pass before «готово».

## CE-3142 overlay

| Topic | Where |
|-------|--------|
| Pages, naming | `FIGMA_FROM_PROTOTYPE.md` §3 |
| Summary composite | `42450:9311` — `Exness Rewards / Transaction detail / Summary` |
| Agent canvas | `42433:17909` |
| Case study | `FIGMA_VISUAL_QA.md` §3 |

Data: active simulator step + `buildLoyaltyModalPack` / row configs — not designer reference `42413:32765`.

## After user review

Universal lesson → §D. Case → `FIGMA_VISUAL_QA.md` §4.
