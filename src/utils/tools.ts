import fs from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import ora from 'ora'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const pkgPath = resolve(__dirname, '../package.json')

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
    spinner.fail(`${message}执行失败原因`)
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
