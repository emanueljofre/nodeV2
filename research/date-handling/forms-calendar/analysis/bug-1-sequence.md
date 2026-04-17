# Calendar Field Date Corruption via Timezone Stripping

## Summary

VisualVault form calendar fields silently corrupt stored date/time values when users open and save affected forms. The display shows the original value while the database is permanently shifted by the user's UTC offset. Affects fields with both "time enabled" and "ignore timezone" set — a common setting for local-time data.

## Workflow diagram

Read the diagram top-to-bottom, following the numbered steps ①–⑤. The red-bordered node marks where the defect occurs.

```mermaid
%%{init: {'theme':'neutral', 'flowchart': {'nodeSpacing': 35, 'rankSpacing': 45, 'padding': 15}, 'themeCSS': 'code, samp { background-color: #ede7f6 !important; color: #4527a0 !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 0.9em !important; font-family: monospace !important; } .node rect, .node polygon, .node circle, .node path { fill: #f5f5f5 !important; } .cluster rect { fill: #fafafa !important; stroke: #bdbdbd !important; } .cluster-label { font-weight: bold !important; }'}}%%
flowchart TD
    subgraph DB_LAYER["SQL Server (same row)"]
      DB["① Stored value<br/>(no Z, no TZ metadata)<br/>──────────<br/>⑤ Overwritten<br/>with shifted value"]
    end

    subgraph API_LAYER["API / serialization"]
      API1["<b>Source A</b><br/>② Read<br/><code>FormInstance/Controls</code><br/>response appends Z<br/>to records created<br/>via <code>postForms</code>"]
      API2["④ Write (passthrough)"]
    end

    subgraph FORM_LAYER["③ Angular form"]
      SRC_B["<b>Source B</b><br/>Field with preset value<br/>(CurrentDate or fixed)<br/>is serialized via<br/><code>toISOString()</code><br/>producing Z-suffixed value"]
      SRC_C["<b>Source C</b><br/>Field with URL listener<br/>receives a URL param<br/>with a Z-suffixed value"]
      CONV["<code>initCalendarValueV1</code><br/>receives Z-suffixed string"]
      GATE{"time enabled<br/>+ ignoreTimezone?"}
      SKIP["Different code path;<br/>Bug does not apply"]
      STRIP["Z is stripped<br/>(attempt to ignore<br/>the stray Z marker)"]
      PARSE["The form code calls<br/><code>new Date()</code> internally<br/>to parse the Z-less string<br/>as local time, shifting<br/>by user's UTC offset"]
      DISPLAY["Form renders the Date<br/>in the user's timezone<br/>→ value looks correct<br/>(bug is silent)"]
      SAVE["Form save"]
    end

    DB -- "read" --> API1 --> CONV
    SRC_B --> CONV
    SRC_C --> CONV
    CONV --> GATE
    GATE -- No --> SKIP
    GATE -- Yes --> STRIP --> PARSE
    PARSE --> DISPLAY
    PARSE --> SAVE --> API2 -- "write (corrupted)" --> DB

    style DB_LAYER fill:#e3f2fd,stroke:#64b5f6
    style API_LAYER fill:#fff3e0,stroke:#ffb74d
    style FORM_LAYER fill:#e8f5e9,stroke:#81c784

    style PARSE fill:#ffebee,stroke:#d32f2f,stroke-width:3px
```

> **Important**:
>
> - Triggered by core VisualVault functionality — no user action on the field, no custom scripting.
> - Open triggers steps ②–③; save triggers ④–⑤, even with no edits.
> - Display looks correct during the session; corruption surfaces only when the form is reopened.

### Worked examples: user in PST (UTC−8)

Two starting values, same mechanism — Example 1 shifts time only; Example 2 rolls the date forward.

| Step      | Example 1: midnight value                                                                                   | Example 2: 8 pm value                                                                                       | What happens                                                               |
| --------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| ①         | <code style="background:#e8f5e9;color:#1b5e20;padding:2px 6px;border-radius:3px">2026-03-15 00:00:00</code> | <code style="background:#e8f5e9;color:#1b5e20;padding:2px 6px;border-radius:3px">2026-03-15 20:00:00</code> | Stored in DB (naive, no Z, no TZ metadata)                                 |
| ②         | `2026-03-15T00:00:00.000Z`                                                                                  | `2026-03-15T20:00:00.000Z`                                                                                  | Read via `FormInstance/Controls` — response appends Z                      |
| ③ɑ        | `2026-03-15T00:00:00.000`                                                                                   | `2026-03-15T20:00:00.000`                                                                                   | `initCalendarValueV1` strips the Z                                         |
| ③β        | `2026-03-15T08:00:00.000Z`                                                                                  | `2026-03-16T04:00:00.000Z`                                                                                  | Parsed as PST local time → shifted by +8h in UTC _(internal value)_        |
| _display_ | <code style="background:#e3f2fd;color:#0d47a1;padding:2px 6px;border-radius:3px">2026-03-15 00:00</code>    | <code style="background:#e3f2fd;color:#0d47a1;padding:2px 6px;border-radius:3px">2026-03-15 20:00</code>    | Form renders the Date in user's TZ → **user sees original value** (silent) |
| ④         | `2026-03-15T08:00:00.000`                                                                                   | `2026-03-16T04:00:00.000`                                                                                   | Save path passes value through (Z stripped)                                |
| ⑤         | <code style="background:#ffebee;color:#b71c1c;padding:2px 6px;border-radius:3px">2026-03-15 08:00:00</code> | <code style="background:#ffebee;color:#b71c1c;padding:2px 6px;border-radius:3px">2026-03-16 04:00:00</code> | DB overwritten — value shifted forward by user's UTC offset (+8h for PST)  |

**Net corruption**:

- **Example 1** (midnight): time shifted from `00:00` to `08:00`. Same calendar day, but the field silently gained 8 hours.
- **Example 2** (8 pm): date shifted from March 15 to March 16. Any PST field value between `16:00` and `23:59` crosses into the next calendar day on the first corrupted load.
