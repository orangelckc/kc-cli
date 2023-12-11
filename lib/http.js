import axios from 'axios'
import { URLS } from './constants.js'

axios.interceptors.response.use(res => {
  return res.data;
})


/**
 * 获取模板列表
 * @returns Promise
 */
function getBranchList() {
  return axios.get(URLS.branches)
}

/**
 * 获取版本信息
 * @param {string} repo 模板名称
 * @returns Promise
 */
function getTagList(repo) {
  return axios.get(URLS.tags(repo))
}

export {
  getBranchList,
  getTagList
}