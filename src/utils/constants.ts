const REPO_URL = 'https://github.com'
const REPO_API = 'https://api.github.com/repos'
export const REPO_NAME = 'orangelckc/cli-starter'

export const URLS = {
  // 仓库地址
  origin: (repo: string) => `${REPO_URL}/${repo}`,
  // 克隆地址
  clone: (repo: string) => `${REPO_URL}/${repo}.git`,
  // 仓库 issue 地址
  issue: `${REPO_URL}/orangelckc/kc-cli/issues`,
  // 获取仓库分支列表
  branches: (repo: string) => `${REPO_API}/${repo}/branches`,
  // 获取仓库 tag 列表
  tags: (repo: string) => `${REPO_API}/${repo}/tags`,
  // 克隆仓库某个 tag
  downloadRepo: (repo: string, tag: string) => `${REPO_NAME}/${repo}${tag ? `#${tag}` : ''}`,
}
