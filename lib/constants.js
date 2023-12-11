import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf-8'));

const VERSION = pkg.version;
const REPO_URL = 'https://api.github.com'
const REPO_NAME = 'zhurong-cli'

const URLS = {
  repos: `${REPO_URL}/orgs/${REPO_NAME}/repos`,
  tags: (repo) => `${REPO_URL}/repos/${REPO_NAME}/${repo}/tags`
}

export {
  URLS,
  REPO_NAME,
  VERSION
}
