const defaultStructure = {
  type: 'dir',
  children: {
    home: {
      type: 'dir',
      children: {
        adventurer: {
          type: 'dir',
          children: {
            'notes.txt': { type: 'file', content: 'Welcome to ShellQuest!' },
            tutorials: { type: 'dir', children: {} },
            forest: { type: 'dir', children: { 'trail.txt': { type: 'file', content: 'Watch the roots.' } } },
            caves: { type: 'dir', children: { 'echo.txt': { type: 'file', content: 'echo echo echo' } } },
          },
        },
      },
    },
  },
};

export class VirtualFileSystem {
  constructor(structure = defaultStructure) {
    this.root = structuredClone(structure);
    this.cwd = ['home', 'adventurer'];
  }

  pwd() {
    return `/${this.cwd.join('/')}`;
  }

  resolve(path) {
    if (!path || path === '.') return { node: this.getNode(this.cwd), path: [...this.cwd] };
    let parts = path.startsWith('/') ? path.split('/').filter(Boolean) : [...this.cwd, ...path.split('/').filter(Boolean)];
    const cleaned = [];
    for (const part of parts) {
      if (part === '..') cleaned.pop();
      else if (part !== '.') cleaned.push(part);
    }
    return { node: this.getNode(cleaned), path: cleaned };
  }

  getNode(pathParts) {
    let node = this.root;
    const parts = pathParts.filter(Boolean);
    for (const part of parts) {
      if (!node.children || !node.children[part]) return null;
      node = node.children[part];
    }
    return node;
  }

  ls(target = '') {
    const resolved = this.resolve(target);
    const node = resolved.node;
    if (!node || node.type !== 'dir') return { error: 'Not a directory' };
    return { items: Object.keys(node.children).sort() };
  }

  cd(target) {
    const resolved = this.resolve(target);
    if (!resolved.node) return { error: 'Path not found' };
    if (resolved.node.type !== 'dir') return { error: 'Not a directory' };
    this.cwd = resolved.path;
    return { path: this.pwd() };
  }

  mkdir(name) {
    const parent = this.getNode(this.cwd);
    if (parent.children[name]) return { error: 'Already exists' };
    parent.children[name] = { type: 'dir', children: {} };
    return { ok: true };
  }

  touch(name) {
    const parent = this.getNode(this.cwd);
    parent.children[name] = parent.children[name] || { type: 'file', content: '' };
    return { ok: true };
  }

  rm(target) {
    const parts = target.split('/').filter(Boolean);
    const name = parts.pop();
    const basePath = parts.length ? parts : this.cwd;
    const parent = this.getNode(basePath);
    if (!parent || !parent.children[name]) return { error: 'Not found' };
    delete parent.children[name];
    return { ok: true };
  }

  cat(target) {
    const resolved = this.resolve(target);
    if (!resolved.node) return { error: 'Not found' };
    if (resolved.node.type !== 'file') return { error: 'Not a file' };
    return { content: resolved.node.content };
  }

  echo(content, target) {
    const parts = target.split('/').filter(Boolean);
    const name = parts.pop();
    const basePath = parts.length ? parts : this.cwd;
    const parent = this.getNode(basePath);
    if (!parent) return { error: 'Path not found' };
    parent.children[name] = { type: 'file', content };
    return { ok: true };
  }

  grep(pattern, target) {
    const resolved = this.resolve(target);
    if (!resolved.node || resolved.node.type !== 'file') {
      return { error: 'File not found' };
    }
    const lines = resolved.node.content.split('\n');
    const matched = lines.filter((line) => line.includes(pattern));
    return { matches: matched };
  }
}

export function createDefaultFS() {
  return new VirtualFileSystem();
}
