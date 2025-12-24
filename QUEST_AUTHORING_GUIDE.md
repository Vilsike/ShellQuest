# Quest Authoring Guide

This guide outlines how to create clear, reviewable quests that align with the existing quest schema and simulated command engine. Keep quests deterministic and avoid behaviors the engine cannot simulate.

## Writing Quests
- **Follow the schema**: Use the established quest fields (id, title, narrative, steps/prompts, expected commands or outputs, hints, success criteria). Validate against the schema before submitting.
- **Single learning goal**: Each quest should teach one primary concept with minimal peripheral requirements.
- **Progression tags**: Tag quests with their Zone, concepts covered, and prerequisites to support gated progression.
- **Deterministic inputs**: Provide fixed, simulated filesystem/process/network states within the quest data; avoid randomness.
- **Scaffolded steps**: Break quests into small steps when possible, escalating from observation to action to verification.
- **Terminology**: Match real shell terminology but call out when behavior differs from real Linux.

## Success Criteria Patterns
Use clear, machine-checkable criteria that map to the engine’s validation hooks:
- **Command match**: Expected command string or pattern (allowing benign variations like whitespace or flag order when appropriate).
- **Output match**: Deterministic expected stdout/stderr snippets, or structured assertions against simulated command results.
- **State change**: Validations on simulated filesystem/process/package states after actions (e.g., file exists with content, permission bits set).
- **Sequence checks**: When order matters, define ordered steps; otherwise, allow commutative actions to reduce friction.
- **Mastery checks**: Combine multiple validations across commands and state to ensure concept retention without overfitting to a single answer.

## Hints Design
- **Layered hints**: Provide 2–3 levels, from conceptual nudges to actionable guidance, without giving exact commands unless remedial.
- **Context-aware**: Tie hints to the specific step or validation that is failing to reduce ambiguity.
- **Call out simulations**: If simulated behavior differs from real shells (e.g., limited globbing), mention it in hints or narrative.
- **Avoid spoilers**: Rephrase the goal rather than presenting the final command; reserve explicit commands for final-tier hints only when necessary.

## Preventing Ambiguity
- **Define starting state**: Declare the initial simulated environment (files, processes, network state, packages) explicitly in the quest data.
- **Constrain acceptable answers**: Specify allowed command variants and flag interpretations to avoid unintended solutions.
- **Consistent outputs**: Ensure any provided sample outputs match the engine’s formatting and casing.
- **Edge cases**: Consider common learner mistakes (wrong path, missing flag, wrong user) and ensure validation errors produce actionable feedback.

## Common Pitfalls
- Under-specified environments leading to multiple valid answers the engine cannot distinguish.
- Overly strict command matching that rejects harmless variations (flag order, whitespace) without learning value.
- Hint tiers that jump from vague to fully solved in one step.
- Mastery checks that demand unmodeled behavior (real networking, arbitrary scripting, background jobs) beyond the simulation.
- Mixing multiple new concepts in one quest, leading to cognitive overload.
