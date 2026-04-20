# Calendar Popup and Typed Input Store Different Values

## Summary

In legacy calendar fields, the **popup** and **typed** input handlers store different values for the same date. The popup writes a raw UTC timestamp (`toISOString()` output); the typed path runs the same value through `getSaveValue()`, which strips the timezone and re-formats. Non-legacy fields converge through a shared normalization step, so they are not affected. The display looks identical after reload (V1 re-parses the stored value), but the raw database value differs by the user's UTC offset — visible to any downstream consumer that reads the column directly (SQL, reports, dashboards, web services).

## Workflow diagram

Read the diagram top-to-bottom, following the numbered steps ①–④. The red-bordered node marks where the divergence occurs.

```mermaid
%%{init: {'theme':'neutral', 'flowchart': {'nodeSpacing': 35, 'rankSpacing': 45, 'padding': 15}, 'themeCSS': 'code, samp { background-color: #ede7f6 !important; color: #4527a0 !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 0.9em !important; font-family: monospace !important; } .node rect, .node polygon, .node circle, .node path { fill: #f5f5f5 !important; } .cluster rect { fill: #fafafa !important; stroke: #bdbdbd !important; } .cluster-label { font-weight: bold !important; }'}}%%
flowchart TD
    subgraph USER_LAYER["① User input"]
      SRC_POPUP["<b>Source A — Popup</b><br/>User clicks a date in<br/>the Kendo calendar popup<br/>→ Date object emitted<br/>by the widget"]
      SRC_TYPED["<b>Source B — Typed</b><br/>User types a date in<br/>the input and tabs out<br/>→ Date object parsed<br/>from text"]
    end

    subgraph FORM_LAYER["② Angular form handlers"]
      GATE{"useLegacy?"}
      NORM["<code>normalizeCalValue()</code><br/>shared pre-processing;<br/>both handlers receive<br/>the same value"]
      POPUP_H["<b><code>calChangeSetValue</code></b><br/>popup handler<br/>──────────<br/><code>toISOString()</code><br/>→ stored as-is<br/>(raw UTC with Z)"]
      TYPED_H["<code>calChange</code><br/>typed handler<br/>──────────<br/><code>toISOString()</code><br/>→ <code>getSaveValue()</code><br/>strips Z, re-formats"]
      CONVERGE["Both handlers write<br/>the same value"]
    end

    subgraph SAVE_LAYER["③ Save / API"]
      SAVE["Form save (passthrough)<br/>value sent to API<br/>as stored in model"]
    end

    subgraph DB_LAYER["④ SQL Server (datetime column)"]
      DB_POPUP["Popup row:<br/>value shifted by<br/>user's UTC offset<br/>(e.g. BRT → +3h)"]
      DB_TYPED["Typed row:<br/>value stored as<br/>wall-clock local time<br/>(no shift)"]
      DB_OK["Same value for<br/>both input methods"]
    end

    SRC_POPUP --> GATE
    SRC_TYPED --> GATE
    GATE -- "No (non-legacy)" --> NORM --> CONVERGE --> SAVE --> DB_OK
    GATE -- "Yes (legacy)" --> POPUP_H
    GATE -- "Yes (legacy)" --> TYPED_H
    POPUP_H --> SAVE
    TYPED_H --> SAVE
    SAVE --> DB_POPUP
    SAVE --> DB_TYPED

    style USER_LAYER fill:#e8f5e9,stroke:#81c784
    style FORM_LAYER fill:#fff3e0,stroke:#ffb74d
    style SAVE_LAYER fill:#f3e5f5,stroke:#ba68c8
    style DB_LAYER fill:#e3f2fd,stroke:#64b5f6

    style POPUP_H fill:#ffebee,stroke:#d32f2f,stroke-width:3px
```

> **Important**:
>
> - Triggered the first time the user enters a date — no reopen required.
> - Only legacy fields (`useLegacy=true`) diverge. Non-legacy fields share `normalizeCalValue()` and converge to a single stored value.
> - `enableTime` and `ignoreTimezone` do **not** gate this bug — all four legacy configs (E/F/G/H) diverge.
> - At UTC+0 the two stored values are numerically identical; the bug is latent but invisible.
> - Display looks correct after save+reload because V1's init path re-parses whatever is stored; only consumers reading the raw DB column see the divergence.

### Worked examples: user in BRT (UTC−3), selects March 15, 2026

Two configurations, same mechanism — Example 1 is a date-only legacy field; Example 2 is a date+time legacy field.

| Step      | Example 1: date-only (Config E, Field12)                                                                    | Example 2: date+time (Config G, Field14)                                                                    | What happens                                                                             |
| --------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| ①         | User picks `2026-03-15`                                                                                     | User picks `2026-03-15 00:00`                                                                               | Same Date object emitted by the widget or parsed from typed text                         |
| ②ɑ popup  | `2026-03-15T03:00:00.000Z`                                                                                  | `2026-03-15T03:00:00.000Z`                                                                                  | `calChangeSetValue` stores raw `toISOString()` — no formatting                           |
| ②β typed  | `2026-03-15`                                                                                                | `2026-03-15T00:00:00`                                                                                       | `calChange` runs `getSaveValue()` — strips Z, formats to local wall-clock                |
| ③ popup   | `2026-03-15T03:00:00.000Z`                                                                                  | `2026-03-15T03:00:00.000Z`                                                                                  | Save path is a passthrough; value sent to API as stored                                  |
| ③ typed   | `2026-03-15`                                                                                                | `2026-03-15T00:00:00`                                                                                       | Save path is a passthrough                                                               |
| ④ popup   | <code style="background:#ffebee;color:#b71c1c;padding:2px 6px;border-radius:3px">2026-03-15 03:00:00</code> | <code style="background:#ffebee;color:#b71c1c;padding:2px 6px;border-radius:3px">2026-03-15 03:00:00</code> | DB stores 3 AM — the UTC equivalent of midnight BRT                                      |
| ④ typed   | <code style="background:#e8f5e9;color:#1b5e20;padding:2px 6px;border-radius:3px">2026-03-15 00:00:00</code> | <code style="background:#e8f5e9;color:#1b5e20;padding:2px 6px;border-radius:3px">2026-03-15 00:00:00</code> | DB stores midnight — the user's local wall-clock                                         |
| _display_ | <code style="background:#e3f2fd;color:#0d47a1;padding:2px 6px;border-radius:3px">2026-03-15</code>          | <code style="background:#e3f2fd;color:#0d47a1;padding:2px 6px;border-radius:3px">2026-03-15 00:00</code>    | Both rows render identically after reload — V1 re-parses the stored value to the user TZ |

**Net divergence**:

- **Example 1** (date-only): popup row is 3 hours ahead of typed row in the DB. SQL `WHERE date = '2026-03-15'` matches the typed row but not the popup row (which is `2026-03-15 03:00:00`).
- **Example 2** (date+time): same 3-hour offset. Reports that group by hour, or filters on time-of-day, split records into different buckets depending on how the date was entered.
- **Magnitude scales with user offset**: PST (UTC−8) → 8h shift, IST (UTC+5:30) → 5.5h shift in the opposite direction, UTC+0 → 0h (bug invisible).
