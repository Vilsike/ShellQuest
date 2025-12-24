import { z } from 'zod';

export type Quest = z.infer<typeof questSchema>;
export type Zone = z.infer<typeof zoneSchema>;

const questSchema = z.object({
  id: z.string(),
  zone: z.number().int(),
  title: z.string(),
  summary: z.string(),
  objective: z.string(),
  command: z.string(),
  challenge: z.boolean().default(false)
});

const zoneSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  theme: z.string(),
  quests: z.array(questSchema)
});

const zonesData: Zone[] = [
  {
    id: 1,
    name: 'Foundations',
    theme: 'navigation + inspection',
    quests: [
      {
        id: 'z1-q1',
        zone: 1,
        title: 'Waking Up',
        summary: 'Learn how to print your working directory.',
        objective: 'Use pwd to find out where you are.',
        command: 'pwd',
        challenge: false
      },
      {
        id: 'z1-q2',
        zone: 1,
        title: 'First Steps',
        summary: 'Move around the file system.',
        objective: 'Use cd to enter the workshop directory.',
        command: 'cd workshop',
        challenge: false
      },
      {
        id: 'z1-q3',
        zone: 1,
        title: 'Look Around',
        summary: 'List visible items.',
        objective: 'Use ls to see available files.',
        command: 'ls',
        challenge: false
      },
      {
        id: 'z1-q4',
        zone: 1,
        title: 'Secret Corners',
        summary: 'Reveal hidden files.',
        objective: 'Run ls -a to find hidden artifacts.',
        command: 'ls -a',
        challenge: false
      },
      {
        id: 'z1-q5',
        zone: 1,
        title: 'Manual Reading',
        summary: 'Use the manual for help.',
        objective: 'Open man ls to read flags.',
        command: 'man ls',
        challenge: false
      },
      {
        id: 'z1-q6',
        zone: 1,
        title: 'Copycat',
        summary: 'Copy files safely.',
        objective: 'Use cp to duplicate starter.txt to notes.txt.',
        command: 'cp starter.txt notes.txt',
        challenge: false
      },
      {
        id: 'z1-q7',
        zone: 1,
        title: 'Moving Day',
        summary: 'Move items into place.',
        objective: 'Use mv to relocate notes.txt into /logs.',
        command: 'mv notes.txt logs/',
        challenge: false
      },
      {
        id: 'z1-q8',
        zone: 1,
        title: 'Trash Duty',
        summary: 'Remove unwanted files.',
        objective: 'Use rm to delete scratch.tmp.',
        command: 'rm scratch.tmp',
        challenge: false
      },
      {
        id: 'z1-q9',
        zone: 1,
        title: 'Searcher',
        summary: 'Find text inside files.',
        objective: 'Use grep to locate the word "artifact" in notes.',
        command: 'grep "artifact" notes.txt',
        challenge: false
      },
      {
        id: 'z1-q10',
        zone: 1,
        title: 'Trailblazer',
        summary: 'Chain commands to solve a puzzle.',
        objective: 'Use pipes to count log entries containing WARN.',
        command: 'cat logs/app.log | grep WARN | wc -l',
        challenge: true
      }
    ]
  },
  {
    id: 2,
    name: 'Filesmiths',
    theme: 'editing + permissions',
    quests: [
      {
        id: 'z2-q1',
        zone: 2,
        title: 'Echo Chamber',
        summary: 'Write quick notes with echo.',
        objective: 'Create a quicknote.txt with echo.',
        command: 'echo "remember the flag" > quicknote.txt',
        challenge: false
      },
      {
        id: 'z2-q2',
        zone: 2,
        title: 'Appendix',
        summary: 'Append without overwriting.',
        objective: 'Use >> to add a line to quicknote.txt.',
        command: 'echo "second clue" >> quicknote.txt',
        challenge: false
      },
      {
        id: 'z2-q3',
        zone: 2,
        title: 'Stream Watcher',
        summary: 'Follow file changes live.',
        objective: 'Use tail -f on the mission.log.',
        command: 'tail -f mission.log',
        challenge: false
      },
      {
        id: 'z2-q4',
        zone: 2,
        title: 'Head Start',
        summary: 'Preview top lines quickly.',
        objective: 'Use head -n 5 to see the opening of diary.txt.',
        command: 'head -n 5 diary.txt',
        challenge: false
      },
      {
        id: 'z2-q5',
        zone: 2,
        title: 'Permission Slip',
        summary: 'Change permissions cautiously.',
        objective: 'Use chmod u+x scripts/run.sh to make it executable.',
        command: 'chmod u+x scripts/run.sh',
        challenge: false
      },
      {
        id: 'z2-q6',
        zone: 2,
        title: 'Owner Transfer',
        summary: 'Simulate ownership changes.',
        objective: 'Use chown engineer logs',
        command: 'chown engineer logs',
        challenge: false
      },
      {
        id: 'z2-q7',
        zone: 2,
        title: 'Linksmith',
        summary: 'Create symbolic links.',
        objective: 'Use ln -s reports/summary.txt latest-report.txt',
        command: 'ln -s reports/summary.txt latest-report.txt',
        challenge: false
      },
      {
        id: 'z2-q8',
        zone: 2,
        title: 'Archiver',
        summary: 'Bundle files together.',
        objective: 'Use tar -czf backups/day1.tar.gz backups/day1',
        command: 'tar -czf backups/day1.tar.gz backups/day1',
        challenge: false
      },
      {
        id: 'z2-q9',
        zone: 2,
        title: 'Checksum Guardian',
        summary: 'Verify file integrity.',
        objective: 'Use sha256sum to confirm installer.bin.',
        command: 'sha256sum installer.bin',
        challenge: false
      },
      {
        id: 'z2-q10',
        zone: 2,
        title: 'Reliquary Keeper',
        summary: 'Combine permissions and archiving in one run.',
        objective: 'Set execute bit then archive scripts folder in a single line.',
        command: 'chmod -R u+x scripts && tar -czf scripts.tar.gz scripts',
        challenge: true
      }
    ]
  },
  {
    id: 3,
    name: 'Process Grounds',
    theme: 'processes + environment',
    quests: [
      {
        id: 'z3-q1',
        zone: 3,
        title: 'Variable Scout',
        summary: 'Inspect your environment.',
        objective: 'Use env to list variables.',
        command: 'env',
        challenge: false
      },
      {
        id: 'z3-q2',
        zone: 3,
        title: 'Export Duty',
        summary: 'Add a temporary variable.',
        objective: 'Use export CODE_NAME=nebula',
        command: 'export CODE_NAME=nebula',
        challenge: false
      },
      {
        id: 'z3-q3',
        zone: 3,
        title: 'Process Rollcall',
        summary: 'See what is running.',
        objective: 'Use ps to view simulated processes.',
        command: 'ps',
        challenge: false
      },
      {
        id: 'z3-q4',
        zone: 3,
        title: 'Gentle Stop',
        summary: 'End a noisy task.',
        objective: 'Use kill 202 to stop the log-watcher process.',
        command: 'kill 202',
        challenge: false
      },
      {
        id: 'z3-q5',
        zone: 3,
        title: 'History Lesson',
        summary: 'Recall what you typed.',
        objective: 'Use history to review prior commands.',
        command: 'history',
        challenge: false
      },
      {
        id: 'z3-q6',
        zone: 3,
        title: 'Scoped Export',
        summary: 'Update an existing variable.',
        objective: 'Use export PATH=/sim/bin:$PATH',
        command: 'export PATH=/sim/bin:$PATH',
        challenge: false
      },
      {
        id: 'z3-q7',
        zone: 3,
        title: 'Process Filter',
        summary: 'Find a process by name.',
        objective: 'Use ps | grep watcher to locate a watcher task.',
        command: 'ps | grep watcher',
        challenge: false
      },
      {
        id: 'z3-q8',
        zone: 3,
        title: 'Silence the Storm',
        summary: 'Combine history and kill to tame the system.',
        objective: 'Review history, then terminate the highest PID safely.',
        command: 'history && kill 999',
        challenge: true
      }
    ]
  },
  {
    id: 4,
    name: 'Network Frontier',
    theme: 'networking + packages',
    quests: [
      {
        id: 'z4-q1',
        zone: 4,
        title: 'Pulse Check',
        summary: 'Send a ping to a friendly host.',
        objective: 'Use ping station',
        command: 'ping station',
        challenge: false
      },
      {
        id: 'z4-q2',
        zone: 4,
        title: 'Latency Watch',
        summary: 'Measure packet timing.',
        objective: 'Use ping -c 3 relay',
        command: 'ping -c 3 relay',
        challenge: false
      },
      {
        id: 'z4-q3',
        zone: 4,
        title: 'Service Peek',
        summary: 'Fetch a quick status page.',
        objective: 'Use curl https://status.quest.local',
        command: 'curl https://status.quest.local',
        challenge: false
      },
      {
        id: 'z4-q4',
        zone: 4,
        title: 'Header Hunter',
        summary: 'Inspect response headers.',
        objective: 'Use curl -I https://status.quest.local',
        command: 'curl -I https://status.quest.local',
        challenge: false
      },
      {
        id: 'z4-q5',
        zone: 4,
        title: 'Package Runway',
        summary: 'Install a tool with apt.',
        objective: 'Use apt install tracer',
        command: 'apt install tracer',
        challenge: false
      },
      {
        id: 'z4-q6',
        zone: 4,
        title: 'Dual Package',
        summary: 'Try the pacman workflow.',
        objective: 'Use pacman -S monitor',
        command: 'pacman -S monitor',
        challenge: false
      },
      {
        id: 'z4-q7',
        zone: 4,
        title: 'Mesh Mastery',
        summary: 'Combine network probes and installs.',
        objective: 'Ping a host, curl a service, and ensure tracer is installed.',
        command: 'ping mesh && curl https://mesh.quest.local && apt install tracer',
        challenge: true
      }
    ]
  }
];

const zonesSchema = z
  .array(zoneSchema)
  .min(4)
  .superRefine((zones, ctx) => {
    const allQuests = zones.flatMap((zone) => zone.quests);
    if (allQuests.length !== 35) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Expected 35 quests, found ${allQuests.length}`
      });
    }
    const ids = new Set<string>();
    allQuests.forEach((quest) => {
      if (ids.has(quest.id)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Duplicate quest id ${quest.id}` });
      }
      ids.add(quest.id);
    });
    const zoneMap = new Map<number, number>();
    allQuests.forEach((quest) => {
      zoneMap.set(quest.zone, (zoneMap.get(quest.zone) ?? 0) + 1);
    });
    zones.forEach((zone) => {
      if (!zoneMap.has(zone.id)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Zone ${zone.id} has no quests` });
      }
    });
  });

export const zones = zonesSchema.parse(zonesData);

export const getQuestsByZone = (zoneId: number) =>
  zones.find((zone) => zone.id === zoneId)?.quests ?? [];

export const masteryAchieved = (zone: Zone, completed: Set<string>) =>
  zone.quests.every((quest) => completed.has(quest.id)) &&
  zone.quests.some((quest) => quest.challenge);

export const totalQuestCount = zones.reduce((sum, zone) => sum + zone.quests.length, 0);
