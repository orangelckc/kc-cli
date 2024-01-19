import axios from 'axios'
import chalk from 'chalk'

import { URLS } from './constants'
import { getRepoName } from './tools'

const request = axios.create({
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

request.interceptors.response.use((res) => {
  return res.data
})

/**
 * 获取模板分支列表
 */
function getBranchList() {
  const repo = getRepoName()
  const url = URLS.branches(repo)
  return request.get<Branch[]>(url)
    .catch(() => {
      const error = `${chalk.bgRedBright(`获取模版分支列表失败，如果您配置了自定模版仓库，请检查:`)}
    ${chalk.yellow('1. 仓库地址是否正确')}
    ${chalk.yellow('2. 仓库是否有2个以上分支, 分支名不是master或main')}
    ${chalk.yellow('3. 仓库是否有权限访问')}
    `
      throw new Error(error)
    })
}
/**
 * 获取tags列表
 * ! 这里是另一种使用方式，一个模版对应一个仓库，可以创建多个tag用于版本管理
 * @param {string} repo 仓库名称
 */
function getTagList(repo: string) {
  return request.get(URLS.tags(repo))
}

export {
  getBranchList,
  getTagList,
}
