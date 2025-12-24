export class HistoryManager {
  constructor(limit = 50) {
    this.limit = limit;
    this.entries = [];
    this.index = -1;
  }

  push(command) {
    if (!command.trim()) return;
    this.entries = [...this.entries.slice(-(this.limit - 1)), command];
    this.index = this.entries.length;
  }

  previous() {
    if (!this.entries.length) return '';
    this.index = Math.max(0, this.index - 1);
    return this.entries[this.index];
  }

  next() {
    if (!this.entries.length) return '';
    this.index = Math.min(this.entries.length, this.index + 1);
    return this.entries[this.index] ?? '';
  }
}

export function buildCompletionCatalog(commands, fileTree) {
  const paths = new Set();
  function walk(base, node) {
    Object.entries(node).forEach(([name, value]) => {
      const current = base ? `${base}/${name}` : name;
      paths.add(current);
      if (typeof value === 'object') {
        walk(current, value);
      }
    });
  }
  walk('', fileTree);
  return {
    commands,
    paths: Array.from(paths),
  };
}

export function getCompletions(input, catalog) {
  const trimmed = input.trimStart();
  const tokens = trimmed.split(/\s+/);
  const activeToken = tokens[tokens.length - 1] ?? '';
  const candidates = tokens.length === 1 ? catalog.commands : catalog.paths;
  const matches = candidates.filter((item) => item.startsWith(activeToken));
  if (matches.length === 1) {
    const completion = matches[0];
    tokens[tokens.length - 1] = completion;
    return { type: 'complete', value: tokens.join(' '), matches };
  }
  if (matches.length > 1) {
    return { type: 'suggest', value: input, matches };
  }
  return { type: 'none', value: input, matches: [] };
}
