import fs from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import ora from 'ora'

import { REPO_NAME, URLS } from './constants'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const pkgPath = resolve(__dirname, '../package.json')
const repoPath = resolve(__dirname, '../.repo')

/**
 * loading 执行动画
 * @param fn 执行函数
 * @param message 显示的提示信息
 * @param args 函数参数
 */
export async function wrapLoading<T>(fn: Function, message: string, ...args: any[]) {
  const spinner = ora(message)

  spinner.start()

  try {
    const result = await fn(...args)
    spinner.succeed()

    return result as T
  }
  catch (error) {
    spinner.fail(`${message}执行失败:`)
    throw error
  }
}

/**
 * 获取package.json文件
 */
export function getPackageJson() {
  try {
    return JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
  }
  catch (error) {
    throw new Error('读取package.json文件失败')
  }
}

/**
 * 获取自定义仓库名称
 */
export function getRepoName() {
  try {
    const CUSTOM_REPO = fs.readFileSync(repoPath, 'utf-8').trim()
    if (!CUSTOM_REPO)
      throw new Error('未配置自定义仓库地址')

    // 提取repo名称
    const reg = /^https:\/\/github\.com\/[\w-]+\/[\w-]+$/
    const repo = CUSTOM_REPO.match(reg)?.[0].split('/').slice(-2).join('/')
    if (!repo)
      throw new Error('未配置自定义仓库地址')

    return repo
  }
  catch (error) {
    return REPO_NAME // 默认仓库地址
  }
}

/**
 * 写入.repo文件
 * @param url 仓库链接
 */
export function writeRepo(url: string) {
  try {
    fs.writeFileSync(repoPath, url, 'utf-8')
  }
  catch (error) {
    throw new Error('写入.repo文件失败')
  }
}

/**
 * 读取.repo文件
 * @returns 仓库链接
 */
export function readRepo() {
  const repo = getRepoName()
  return URLS.origin(repo)
}

/**
 * 校验github仓库链接是否合法
 * @param url 仓库链接
 */
export function checkUrl(url: string) {
  const reg = /^https:\/\/github\.com\/[\w-]+\/[\w-]+$/

  return reg.test(url)
}

/**
 * 重置.repo文件
 */
export function resetRepo() {
  try {
    if (fs.existsSync(repoPath))
      fs.rmSync(repoPath)
  }
  catch (error) {
    throw new Error('重置仓库地址失败')
  }
}
