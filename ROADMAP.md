# ShellQuest Roadmap

## MVP (done)
- **Goals**
  - Deliver a playable core loop of shell-based quests with simulated command evaluation.
  - Provide a minimal set of quests that teach basic navigation and command usage.
  - Ensure stable quest loading, validation, and completion tracking.
- **Non-goals**
  - Full coverage of Linux fundamentals beyond introductory topics.
  - Real system-side effects; all actions remain simulated.
  - Multiplayer, modding, or extensive analytics.
- **Risks**
  - Player confusion if simulated behavior differs from real shells without clear messaging.
  - Limited telemetry makes it hard to tune quest difficulty.
  - Quest authorship bottleneck if tooling is manual.
- **Acceptance criteria**
  - Players can start the game, view quests, submit answers, and see completion feedback.
  - At least one end-to-end learning path for basic navigation is available.
  - Core quest schema validated at load time and enforced in the engine.

## v0.2 — Content + Polish
- **Goals**
  - Expand quest library to cover navigation/files, text processing, permissions, processes, networking, package management, and scripting concepts at introductory depth.
  - Improve onboarding, hints, and in-quest guidance to reduce ambiguity.
  - Add UX polish: clearer feedback, progress indicators, and error messaging aligned with the schema.
- **Non-goals**
  - Real command execution; simulations remain deterministic.
  - Complex branching narratives; quests stay linear or lightly gated.
  - Deep system administration topics beyond fundamentals.
- **Risks**
  - Content volume could outpace review capacity, introducing inconsistent difficulty or terminology.
  - Hint design may inadvertently reveal answers or remain too vague.
  - UX polish work could introduce regressions in quest validation if not covered by tests.
- **Acceptance criteria**
  - Each learning domain has at least one Zone with 3–5 quests and mastery checks.
  - Hints follow authoring guidelines and are consistent across quests.
  - UI provides clear success/failure states and progress milestones without breaking existing schema.

## v0.3 — Meta Systems
- **Goals**
  - Introduce meta-progression such as achievements, streaks, or badges tied to quest completion events.
  - Add lightweight analytics for quest difficulty insights (anonymous, event-based).
  - Enable dynamic difficulty suggestions (e.g., recommend remedial quests when mastery checks fail).
- **Non-goals**
  - Competitive leaderboards or PvP features.
  - Personal data collection; keep analytics minimal and privacy-safe.
  - Real-time collaboration features.
- **Risks**
  - Analytics events might drift from schema/engine changes if not versioned.
  - Meta systems could distract from learning goals if reward loops are poorly tuned.
  - Additional state may complicate quest save/restore flows.
- **Acceptance criteria**
  - Achievement and streak logic integrates with existing quest completion events without schema changes to quests.
  - Analytics events defined and emitted at key milestones with opt-out capability.
  - Difficulty suggestions can be surfaced based on player performance without blocking progression.

## v0.4 — Community / Modding
- **Goals**
  - Provide tooling and docs for community-authored quests packaged against the existing quest schema.
  - Support curated mod packs (Zones or quest bundles) that can be safely loaded and validated.
  - Establish contribution review guidelines and compatibility checks.
- **Non-goals**
  - Arbitrary code execution or scripting inside quests; all behavior remains within the simulated engine.
  - Automatic publishing pipelines without review.
  - Cross-game social features beyond sharing quest packs.
- **Risks**
  - Community content quality variance could harm learning outcomes.
  - Schema drift could break older community quests if compatibility layer is absent.
  - Security concerns if validation is bypassed in custom packs.
- **Acceptance criteria**
  - Documented quest pack format aligned to current schema with validation tooling.
  - Loader can ingest community packs with clear error reporting for invalid data.
  - Contribution guidelines exist for authors and reviewers, including success criteria and hint standards.
