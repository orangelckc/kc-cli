const REPO_URL = 'https://github.com/'
const REPO_API = 'https://api.github.com/repos'
const REPO_NAME = 'orangelckc/cli-starter'

export const URLS = {
  // 仓库地址
  origin: `${REPO_URL}/${REPO_NAME}.git`,
  // 仓库 issue 地址
  issue: `${REPO_URL}/${REPO_NAME}/issues`,
  // 获取仓库分支列表
  branches: `${REPO_API}/${REPO_NAME}/branches`,
  // 获取仓库 tag 列表
  tags: (repo: string) => `${REPO_API}/${repo}/tags`,
  // 克隆仓库某个 tag
  downloadRepo: (repo: string, tag: string) => `${REPO_NAME}/${repo}${tag ? `#${tag}` : ''}`,
}
