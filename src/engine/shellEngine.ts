import { Quest, zones } from '../data/quests';

type CommandResult = {
  output: string;
  status: 'ok' | 'error';
};

type Process = {
  pid: number;
  name: string;
  status: 'running' | 'sleeping';
};

type PackageManager = 'apt' | 'pacman';

export class ShellEngine {
  private env: Record<string, string> = {
    PATH: '/usr/local/bin:/usr/bin',
    HOME: '/home/quester',
    SHELL: '/bin/bash'
  };

  private history: string[] = [];
  private processes: Process[] = [
    { pid: 101, name: 'scheduler', status: 'running' },
    { pid: 202, name: 'log-watcher', status: 'sleeping' },
    { pid: 303, name: 'telemetry', status: 'running' }
  ];

  private packages = new Set<string>(['core-utils']);

  run(command: string): CommandResult {
    const trimmed = command.trim();
    if (!trimmed) {
      return { output: 'Type a command to begin.', status: 'error' };
    }

    this.history.push(trimmed);
    const [cmd, ...args] = this.tokenize(trimmed);

    switch (cmd) {
      case 'env':
        return { output: this.handleEnv(), status: 'ok' };
      case 'export':
        return this.handleExport(args.join(' '));
      case 'ps':
        return { output: this.handlePs(), status: 'ok' };
      case 'kill':
        return this.handleKill(args[0]);
      case 'history':
        return { output: this.handleHistory(), status: 'ok' };
      case 'ping':
        return { output: this.handlePing(args), status: 'ok' };
      case 'curl':
        return { output: this.handleCurl(args), status: 'ok' };
      case 'apt':
        return this.handlePackage('apt', args);
      case 'pacman':
        return this.handlePackage('pacman', args);
      default:
        return { output: this.handleBasics(trimmed), status: 'ok' };
    }
  }

  private tokenize(input: string) {
    return input.match(/(?:[^\s\"]+|"[^"]*")+/g)?.map((token) => token.replace(/"/g, '')) ?? [];
  }

  private handleEnv() {
    return Object.entries(this.env)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
  }

  private handleExport(argument: string): CommandResult {
    if (!argument.includes('=')) {
      return { output: 'Usage: export KEY=value', status: 'error' };
    }
    const [rawKey, ...rest] = argument.split('=');
    const key = rawKey.trim();
    const value = rest.join('=').trim();
    if (!key || !value) {
      return { output: 'Both key and value are required.', status: 'error' };
    }
    const previous = this.env[key];
    this.env[key] = value;
    const prefix = previous ? 'updated' : 'added';
    return { output: `Export ${prefix}: ${key}=${value}`, status: 'ok' };
  }

  private handlePs() {
    const header = 'PID   STATUS    NAME';
    const rows = this.processes
      .map((proc) => `${proc.pid.toString().padEnd(5)} ${proc.status.padEnd(9)} ${proc.name}`)
      .join('\n');
    return `${header}\n${rows}`;
  }

  private handleKill(pidArg?: string): CommandResult {
    if (!pidArg) {
      return { output: 'Usage: kill <pid>', status: 'error' };
    }
    const pid = Number(pidArg);
    if (Number.isNaN(pid)) {
      return { output: 'PID must be a number.', status: 'error' };
    }
    const index = this.processes.findIndex((proc) => proc.pid === pid);
    if (index === -1) {
      return { output: `Process ${pid} not found.`, status: 'error' };
    }
    const proc = this.processes[index];
    this.processes.splice(index, 1);
    return { output: `Process ${proc.name} (${pid}) terminated safely.`, status: 'ok' };
  }

  private handleHistory() {
    return this.history
      .map((entry, index) => `${(index + 1).toString().padStart(3)}  ${entry}`)
      .join('\n');
  }

  private handlePing(args: string[]) {
    const countIndex = args.indexOf('-c');
    let count = 4;
    if (countIndex >= 0 && args[countIndex + 1]) {
      count = Number(args[countIndex + 1]) || 4;
      args.splice(countIndex, 2);
    }
    const host = args[0] ?? 'localhost';
    const samples = Array.from({ length: count }, (_, idx) => `64 bytes from ${host}: icmp_seq=${idx + 1} time=${(Math.random() * 10 + 10).toFixed(2)} ms`);
    const stats = `${count} packets transmitted, ${count} received, 0% packet loss`;
    return ['PING simulation', ...samples, stats].join('\n');
  }

  private handleCurl(args: string[]) {
    const showHeaders = args.includes('-I');
    const url = args.find((arg) => arg.startsWith('http')) ?? 'https://example.quest';
    if (showHeaders) {
      return ['HTTP/1.1 200 OK', 'Content-Type: text/html; charset=utf-8', 'X-ShellQuest: simulated', `Request-URL: ${url}`].join('\n');
    }
    return `Simulated response from ${url}\n{ "status": "ok", "message": "hello from ShellQuest" }`;
  }

  private handlePackage(manager: PackageManager, args: string[]): CommandResult {
    const action = args[0];
    const pkg = args[1];
    if ((action === 'install' || action === '-S') && pkg) {
      const already = this.packages.has(pkg);
      this.packages.add(pkg);
      return {
        output: `${manager} ${already ? 'reinstalled' : 'installed'} ${pkg}\nPackages: ${[...this.packages].join(', ')}`,
        status: 'ok'
      };
    }
    return { output: `Usage: ${manager} install <pkg>`, status: 'error' };
  }

  private handleBasics(command: string) {
    const questMatch = this.findQuestByCommand(command);
    if (questMatch) {
      return `Quest hint: ${questMatch.title}\nObjective: ${questMatch.objective}`;
    }
    return `Command '${command}' is simulated. Try a quest command.`;
  }

  private findQuestByCommand(command: string): Quest | undefined {
    return zones
      .flatMap((zone) => zone.quests)
      .find((quest) => quest.command === command || command.startsWith(quest.command.split(' ')[0]));
  }
}
