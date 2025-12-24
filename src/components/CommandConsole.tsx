import React, { useState } from 'react';
import { ShellEngine } from '../engine/shellEngine';

interface CommandConsoleProps {
  engine: ShellEngine;
}

const CommandConsole: React.FC<CommandConsoleProps> = ({ engine }) => {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState('Ready to simulate commands.');

  const runCommand = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = engine.run(command);
    setOutput(result.output);
    setCommand('');
  };

  return (
    <section className="console">
      <h2>Shell Simulator</h2>
      <form className="console__form" onSubmit={runCommand}>
        <input
          aria-label="Command"
          className="console__input"
          placeholder="Try env, ps, ping, curl, apt, pacman..."
          value={command}
          onChange={(event) => setCommand(event.target.value)}
        />
        <button className="primary-button" type="submit">
          Run
        </button>
      </form>
      <pre className="console__output" aria-live="polite">
        {output}
      </pre>
    </section>
  );
};

export default CommandConsole;
