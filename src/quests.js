export const zones = [
  { id: 'zone1', name: 'Terminal Plains', requirement: () => true },
  {
    id: 'zone2',
    name: 'Filewood Forest',
    requirement: (state) => (state.stats.completedQuestsByZone['zone1'] || 0) >= 6,
  },
  {
    id: 'zone3',
    name: 'Grep Caves',
    requirement: (state) => (state.stats.completedQuestsByZone['zone2'] || 0) >= 6,
  },
];

function commandUsed(state, commandStartsWith) {
  return state.stats.commandLog.some((entry) => entry.command.startsWith(commandStartsWith));
}

function pathVisited(state, path) {
  return state.stats.commandLog.some((entry) => entry.output.includes(path));
}

export const quests = [
  // Zone 1
  {
    id: 'plains-help',
    zone: 'zone1',
    title: 'Meet the Shell',
    intro: 'Explore the basics of ShellQuest.',
    goal: 'Use the help command to see available actions.',
    hints: ['Type `help` and press enter.'],
    successCriteria: ({ state }) => commandUsed(state, 'help'),
    rewards: { xp: 15, coins: 5, skill: 'navigation' },
  },
  {
    id: 'plains-clear',
    zone: 'zone1',
    title: 'Fresh Screen',
    intro: 'A clear view is a calm mind.',
    goal: 'Clear the terminal.',
    hints: ['Type `clear` to wipe the log.'],
    successCriteria: ({ state }) => commandUsed(state, 'clear'),
    rewards: { xp: 15, coins: 5, skill: 'navigation' },
  },
  {
    id: 'plains-pwd',
    zone: 'zone1',
    title: 'Where am I?',
    intro: 'Location matters in the Plains.',
    goal: 'Check your working directory.',
    hints: ['Use `pwd` to print the working directory.'],
    successCriteria: ({ state }) => commandUsed(state, 'pwd'),
    rewards: { xp: 20, coins: 6, skill: 'navigation' },
  },
  {
    id: 'plains-ls',
    zone: 'zone1',
    title: 'Survey the Fields',
    intro: 'List what is around you.',
    goal: 'Run ls to list the contents of the Plains.',
    hints: ['`ls` shows files and folders.'],
    successCriteria: ({ state }) => commandUsed(state, 'ls'),
    rewards: { xp: 20, coins: 6, skill: 'navigation' },
  },
  {
    id: 'plains-cd',
    zone: 'zone1',
    title: 'Step into Tutorials',
    intro: 'Move between locations.',
    goal: 'Change directory into the tutorials folder.',
    hints: ['`cd tutorials` should do it.'],
    successCriteria: ({ state }) => pathVisited(state, '/home/adventurer/tutorials'),
    rewards: { xp: 25, coins: 7, skill: 'navigation' },
  },
  {
    id: 'plains-mkdir',
    zone: 'zone1',
    title: 'Make Space',
    intro: 'You can build your own corners.',
    goal: 'Create a directory named practice.',
    hints: ['`mkdir practice` while in your home folder.'],
    successCriteria: ({ fs }) => !!fs.getNode(['home', 'adventurer', 'practice']),
    rewards: { xp: 25, coins: 8, skill: 'files' },
  },
  {
    id: 'plains-touch',
    zone: 'zone1',
    title: 'First Note',
    intro: 'Create your own file.',
    goal: 'Use touch to create start.txt.',
    hints: ['`touch start.txt`'],
    successCriteria: ({ fs }) => !!fs.getNode(fs.cwd)?.children?.['start.txt'],
    rewards: { xp: 25, coins: 8, skill: 'files' },
  },
  {
    id: 'plains-cat',
    zone: 'zone1',
    title: 'Read the Welcome',
    intro: 'The Plains have simple lore.',
    goal: 'Read notes.txt using cat.',
    hints: ['`cat notes.txt` from your home folder.'],
    successCriteria: ({ state }) => commandUsed(state, 'cat notes.txt'),
    rewards: { xp: 30, coins: 10, skill: 'text' },
  },

  // Zone 2
  {
    id: 'forest-cat-trail',
    zone: 'zone2',
    title: 'Follow the Trail',
    intro: 'Stories are etched into the woods.',
    goal: 'Read forest/trail.txt.',
    hints: ['Try `cat forest/trail.txt`.'],
    successCriteria: ({ state }) => commandUsed(state, 'cat forest/trail.txt'),
    rewards: { xp: 30, coins: 12, skill: 'text' },
  },
  {
    id: 'forest-touch-log',
    zone: 'zone2',
    title: 'Write a Log',
    intro: 'Record your travels.',
    goal: 'Create travel.log with touch.',
    hints: ['`touch travel.log`'],
    successCriteria: ({ fs }) => !!fs.getNode(fs.cwd)?.children?.['travel.log'],
    rewards: { xp: 30, coins: 12, skill: 'files' },
  },
  {
    id: 'forest-mkdir',
    zone: 'zone2',
    title: 'Build a Camp',
    intro: 'Prepare a base in the woods.',
    goal: 'Make a directory named camp.',
    hints: ['`mkdir camp`'],
    successCriteria: ({ fs }) => !!fs.getNode(fs.cwd)?.children?.['camp'],
    rewards: { xp: 30, coins: 12, skill: 'files' },
  },
  {
    id: 'forest-echo',
    zone: 'zone2',
    title: 'Leave a Message',
    intro: 'Trees remember what you write.',
    goal: 'Use echo to create camp/todo.txt with text.',
    hints: ['`echo "gather wood" > camp/todo.txt`'],
    successCriteria: ({ fs }) => {
      const node = fs.getNode(['home', 'adventurer', 'camp', 'todo.txt']);
      return node?.type === 'file' && node.content.includes('gather');
    },
    rewards: { xp: 35, coins: 14, skill: 'text' },
  },
  {
    id: 'forest-rm',
    zone: 'zone2',
    title: 'Clear the Path',
    intro: 'Remove obstacles when needed.',
    goal: 'Delete travel.log.',
    hints: ['Create it with touch if you have not.'],
    successCriteria: ({ fs }) => !fs.getNode(fs.cwd)?.children?.['travel.log'],
    rewards: { xp: 35, coins: 14, skill: 'files' },
  },
  {
    id: 'forest-cat-plan',
    zone: 'zone2',
    title: 'Read the Plan',
    intro: 'Plans guide your steps.',
    goal: 'Read camp/todo.txt.',
    hints: ['`cat camp/todo.txt`'],
    successCriteria: ({ state }) => commandUsed(state, 'cat camp/todo.txt'),
    rewards: { xp: 35, coins: 14, skill: 'text' },
  },
  {
    id: 'forest-cd-camp',
    zone: 'zone2',
    title: 'Enter the Camp',
    intro: 'Move into your new base.',
    goal: 'cd into camp directory.',
    hints: ['`cd camp`'],
    successCriteria: ({ state }) => pathVisited(state, '/home/adventurer/camp'),
    rewards: { xp: 35, coins: 14, skill: 'navigation' },
  },
  {
    id: 'forest-ls-grep',
    zone: 'zone2',
    title: 'Filter the Underbrush',
    intro: 'Use a pipe to find files.',
    goal: 'Run ls piped to grep for txt.',
    hints: ['`ls | grep txt`'],
    successCriteria: ({ state }) => state.stats.commandLog.some((c) => c.command.includes('ls') && c.command.includes('|') && c.command.includes('grep')), 
    rewards: { xp: 40, coins: 16, skill: 'text' },
  },
  {
    id: 'forest-grep-roots',
    zone: 'zone2',
    title: 'Search the Roots',
    intro: 'Find mentions of roots.',
    goal: 'Use grep to find "roots" in forest/trail.txt.',
    hints: ['`grep roots forest/trail.txt`'],
    successCriteria: ({ state }) => commandUsed(state, 'grep roots forest/trail.txt'),
    rewards: { xp: 40, coins: 16, skill: 'text' },
  },

  // Zone 3
  {
    id: 'caves-echo-repeat',
    zone: 'zone3',
    title: 'Echoes in the Cave',
    intro: 'Find the repeating voice.',
    goal: 'Read caves/echo.txt with grep to find echo.',
    hints: ['`grep echo caves/echo.txt`'],
    successCriteria: ({ state }) => commandUsed(state, 'grep echo caves/echo.txt'),
    rewards: { xp: 45, coins: 18, skill: 'text' },
  },
  {
    id: 'caves-touch-journal',
    zone: 'zone3',
    title: 'Document the Echoes',
    intro: 'Create a journal.',
    goal: 'Create journal.txt and add a line to it.',
    hints: ['`touch journal.txt` then echo into it.'],
    successCriteria: ({ fs }) => {
      const node = fs.getNode(fs.cwd)?.children?.['journal.txt'];
      return node?.type === 'file' && node.content?.length >= 0;
    },
    rewards: { xp: 45, coins: 18, skill: 'files' },
  },
  {
    id: 'caves-echo-lines',
    zone: 'zone3',
    title: 'Layered Notes',
    intro: 'Add multiple lines to a file and search them.',
    goal: 'Create lines in journal.txt and grep for cave.',
    hints: ['Use echo with >> simulation (rewrite is fine).'],
    successCriteria: ({ fs, state }) => {
      const node = fs.getNode(fs.cwd)?.children?.['journal.txt'];
      const grepped = commandUsed(state, 'grep cave journal.txt');
      return node?.type === 'file' && grepped;
    },
    rewards: { xp: 50, coins: 20, skill: 'text' },
  },
  {
    id: 'caves-cd-depths',
    zone: 'zone3',
    title: 'Change Levels',
    intro: 'Move deeper while keeping bearings.',
    goal: 'cd into caves and back out.',
    hints: ['`cd ../caves` then `cd ..`'],
    successCriteria: ({ state }) => pathVisited(state, '/home/adventurer/caves'),
    rewards: { xp: 45, coins: 18, skill: 'navigation' },
  },
  {
    id: 'caves-ls-grep',
    zone: 'zone3',
    title: 'Pipe Scout',
    intro: 'Use a pipe to search listing output.',
    goal: 'Use ls | grep echo',
    hints: ['`ls | grep echo`'],
    successCriteria: ({ state }) => state.stats.commandLog.some((c) => c.command.includes('ls | grep echo')),
    rewards: { xp: 50, coins: 20, skill: 'text' },
  },
  {
    id: 'caves-rm-clean',
    zone: 'zone3',
    title: 'Clean Slate',
    intro: 'Remove a file you created.',
    goal: 'Remove journal.txt.',
    hints: ['Use `rm journal.txt`.'],
    successCriteria: ({ fs }) => !fs.getNode(fs.cwd)?.children?.['journal.txt'],
    rewards: { xp: 45, coins: 18, skill: 'files' },
  },
  {
    id: 'caves-echo-story',
    zone: 'zone3',
    title: 'Tell a Cave Story',
    intro: 'Write a story file.',
    goal: 'Use echo to create story.txt with the word "grep" inside.',
    hints: ['`echo "grep adventure" > story.txt`'],
    successCriteria: ({ fs }) => {
      const node = fs.getNode(fs.cwd)?.children?.['story.txt'];
      return node?.type === 'file' && node.content.includes('grep');
    },
    rewards: { xp: 55, coins: 22, skill: 'text' },
  },
  {
    id: 'caves-grep-story',
    zone: 'zone3',
    title: 'Search Your Tale',
    intro: 'Use grep on your own writing.',
    goal: 'Run grep to find grep inside story.txt.',
    hints: ['`grep grep story.txt`'],
    successCriteria: ({ state }) => commandUsed(state, 'grep grep story.txt'),
    rewards: { xp: 55, coins: 22, skill: 'text' },
  },
];

export function availableQuests(state, zoneId) {
  return quests.filter((q) => q.zone === zoneId);
}

export function isQuestComplete(state, questId) {
  return !!state.questStatus[questId]?.completed;
}

export function zoneUnlocked(state, zoneId) {
  const zone = zones.find((z) => z.id === zoneId);
  return zone?.requirement ? zone.requirement(state) : true;
}
