import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf-8'));

const VERSION = pkg.version;
const REPO_URL = 'https://github.com/'
const REPO_API = 'https://api.github.com/repos'
const REPO_NAME = 'orangelckc/cli-starter'

const URLS = {
  origin: `${REPO_URL}/${REPO_NAME}.git`,
  branches: `${REPO_API}/${REPO_NAME}/branches`,
  tags: `${REPO_API}/${REPO_NAME}/tags`
}

export {
  URLS,
  REPO_NAME,
  VERSION
}
