import axios from 'axios'

import { URLS } from './constants'

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
  return request.get<Branch[]>(URLS.branches)
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
