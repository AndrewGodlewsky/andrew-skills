# Native GT updates and GT archive — selected simplification

> **Later simplification:** The owner now selects a [create-only personal-copy handoff](skill-personal-copy-direction.md), with a preferred version-suffixed name. The archive-plugin packaging below is historical; it is not a current implementation requirement.

**Accepted:** the owner selected normal native GT updates with separately invoked historical copies and chose the name **`gt-archive`**. [Canonical resolution](https://github.com/AndrewGodlewsky/andrew-skills/issues/4#issuecomment-5674810009).

| Main GT collection | GT archive |
| --- | --- |
| Native plugin install/update | Optional locally registered archive |
| Whole bundle updates; independent skill versions and notes | Complete historical copies change only by explicit user action |
| Intended `/gt:grill-me` | Intended `/gt-archive:grill-me` |
| Team supports latest | User-owned copies outside normal updates/support |

The archive does not automatically override the main command. Current behavior is available through the main command even while an archived copy exists. Prefix routing is an accepted design target, with cross-client validation deferred.

The earlier `gt-saved` name was a discussion placeholder and is superseded. Managed pins, selective main-bundle updates, pin-upgrade reminders, and a full mixed-version installation manager are removed from scope. Node was not selected; the narrow archive exporter design owns runtime/delivery.

See [the current behavior and acceptance scenarios](skill-versioning-decisions.md) and [architecture](skill-distribution-proposal.md). The prior proposals and original answers remain in the question rounds and [historical manager proposal](history/skill-distribution-managed-proposal.md). No new answers are requested here.

