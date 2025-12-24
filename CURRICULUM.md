# ShellQuest Curriculum

A staged learning progression that maps Zones to quests and concepts across simulated Linux fundamentals. Each Zone should include 3–5 quests plus a mastery check that uses the existing quest schema and command simulations.

## Navigation & Files
- **Zone**: "Paths & Listings"
- **Quests**
  - Q1: Move between directories (`cd`, `pwd` equivalents) in the simulated file tree.
  - Q2: List contents with flags (hidden files, sort modes) via simulated `ls` behaviors.
  - Q3: Read files with `cat`/`less` analogues; interpret relative vs absolute paths.
  - Q4: Create, copy, and move files (simulated `touch`, `cp`, `mv`).
- **Concepts**: path resolution, relative vs absolute, globbing basics, file creation/movement semantics.
- **Mastery checks**: Multi-step navigation puzzle requiring correct paths and file manipulations without direct hints.

## Text Processing
- **Zone**: "Filters & Streams"
- **Quests**
  - Q1: Use simulated `head`/`tail` for file inspection.
  - Q2: Filter lines with `grep` patterns (literal, basic regex) against provided logs.
  - Q3: Chain commands via pipes to transform text (e.g., `grep | sort | uniq`).
  - Q4: Redirect output to files and append logs using `>` and `>>` semantics.
- **Concepts**: standard input/output flow, pipes, redirection, pattern matching, command composability.
- **Mastery checks**: Given a log corpus, produce a specific filtered result using minimal commands.

## Permissions & Ownership (Simulated)
- **Zone**: "Access Rules"
- **Quests**
  - Q1: Read file metadata via simulated `ls -l` output.
  - Q2: Adjust permissions with `chmod`-like masks and symbolic modes (simulated enforcement).
  - Q3: Interpret user/group ownership and apply `chown`/`chgrp` equivalents within sandbox constraints.
- **Concepts**: permission bits, execute vs read/write, user/group roles, umask-style defaults.
- **Mastery checks**: Reconfigure a set of files to match a target permission table without breaking constraints.

## Processes (Simulated)
- **Zone**: "Running Tasks"
- **Quests**
  - Q1: Inspect running simulated processes via `ps`-style output.
  - Q2: Use filters and sort flags to find heavy processes.
  - Q3: Send signals with `kill`/`pkill` analogues to manage runaway tasks.
- **Concepts**: PIDs, process states, foreground/background notions, signals, graceful vs forceful termination.
- **Mastery checks**: Resolve a misbehaving process scenario using the correct signal and verification steps.

## Networking Basics (Simulated Commands)
- **Zone**: "Connections"
- **Quests**
  - Q1: Query host/network info via `ip`/`ifconfig`-style outputs.
  - Q2: Inspect connections using `ss`/`netstat` equivalents.
  - Q3: Perform simulated reachability checks with `ping`/`traceroute`-like commands.
- **Concepts**: interfaces, addresses, ports, connection states, latency vs loss interpretation.
- **Mastery checks**: Diagnose a connectivity issue given mock interface and routing data.

## Package Management (Simulated)
- **Zone**: "Packages & Repos"
- **Quests**
  - Q1: Search for packages with an `apt`/`yum`-like simulator and interpret results.
  - Q2: Install/remove/update packages within sandbox constraints and read simulated dependency prompts.
  - Q3: Inspect installed package metadata and versions.
- **Concepts**: repositories, dependencies, versioning, update vs upgrade, cache refresh.
- **Mastery checks**: Bring a system to a specified package state using correct commands and order.

## Scripting Concepts (Patterns, No Real Execution)
- **Zone**: "Automation Seeds"
- **Quests**
  - Q1: Build command sequences that resemble shell scripts using here-doc–style inputs or chained commands.
  - Q2: Introduce variables and parameter substitution in a simulated environment (string substitution only).
  - Q3: Use conditionals/loops conceptually via structured prompts (e.g., pick the right pattern for the outcome).
- **Concepts**: command grouping, variables, quoting, exit codes, control flow patterns.
- **Mastery checks**: Design a pseudo-script to accomplish a multi-step task, evaluated via schema-driven checks rather than real execution.

## Mastery Progression Map
- Zones should unlock sequentially but allow remedial backtracking.
- Each mastery check gates advancement; failing triggers hint pathways and recommended review quests.
- Progress should be tracked via existing engine state (no new schema needed), with metadata tags marking Zone and concept alignment.
