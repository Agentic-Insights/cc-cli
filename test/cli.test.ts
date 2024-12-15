import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execAsync = promisify(exec);

console.log('Running tests...');

const cliPath = path.resolve(__dirname, '../src/index.js');
const testDir = path.resolve(__dirname, 'test-context');

describe('CLI', () => {
  beforeEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
    await fs.mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('should initialize a new context directory', async () => {
    const { stdout } = await execAsync(`node ${cliPath} init`, { cwd: testDir });
    expect(stdout).toContain('✅ Created .context directory');
    expect(stdout).toContain('✅ Generated index.md with default content');
    expect(stdout).toContain('✅ Generated .contextignore with default patterns');

    const contextDirExists = await fs.access(path.join(testDir, '.context')).then(() => true).catch(() => false);
    expect(contextDirExists).toBe(true);

    const indexFileExists = await fs.access(path.join(testDir, '.context', 'index.md')).then(() => true).catch(() => false);
    expect(indexFileExists).toBe(true);

    const ignoreFileExists = await fs.access(path.join(testDir, '.contextignore')).then(() => true).catch(() => false);
    expect(ignoreFileExists).toBe(true);
  });

  it('should not re-initialize if context directory already exists', async () => {
    await execAsync(`node ${cliPath} init`, { cwd: testDir });
    const { stdout } = await execAsync(`node ${cliPath} init`, { cwd: testDir });
    expect(stdout).toContain('✅ Context structure already exists');
  });
});