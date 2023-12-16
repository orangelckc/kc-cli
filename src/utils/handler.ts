import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import chalk from 'chalk'
import inquirer from 'inquirer'

import { URLS } from './constants'
import { getBranchList } from './http'
import { wrapLoading } from './tools'

/**
 * 创建项目获取命令行输入
 * @param name 项目名称
 * @returns 项目基础信息
 */
export function getStdIn(name = 'my-project') {
  return inquirer.prompt<CreateOptions>([{
    type: 'input',
    name: 'name',
    message: '请输入项目名称：',
    default: name,
  }, {
    type: 'input',
    name: 'version',
    message: '请输入项目版本号：',
    default: '1.0.0',
  }, {
    type: 'input',
    name: 'description',
    message: '请输入项目描述信息：',
    default: null,
  }])
}

/**
 * 是否已存在相同名称的项目
 * @param name 项目名称
 * @param targetDir 项目路径
 * @param force 是否强制创建
 */
export async function isExistProject(name: string, targetDir: string, force: boolean) {
  if (fs.existsSync(targetDir) && force) {
    fs.rmSync(targetDir, { recursive: true })
    return
  }

  if (fs.existsSync(targetDir)) {
    // 询问用户是否确定删除已存在的项目
    const { action } = await inquirer.prompt([
      {
        name: 'action',
        type: 'list',
        message: `目标目录 ${chalk.underline.red(name)} 已存在，请确认操作：`,
        choices: [
          {
            name: '删除',
            value: 'delete',
          },
          {
            name: '取消',
            value: 'cancel',
          },
        ],
      },
    ])

    if (action === 'delete')
      fs.rmSync(targetDir, { recursive: true })
    else
      process.exit(1)
  }
}

/**
 * 拉取可使用的模版列表
 * @returns 模版名称
 */
export async function getTemplates() {
  const branchList = await wrapLoading<Branch[]>(getBranchList, '获取可用模板')

  if (!branchList || !branchList.length)
    return

  const branches = branchList.filter(item => item.name !== 'main').map(item => item.name)

  // 获取要下载的模板名称（对应模版的分支名）
  const { branch } = await inquirer.prompt({
    name: 'branch',
    type: 'list',
    choices: branches,
    message: '选择要创建的项目模版',
  })

  return branch
}

/**
 * 克隆模版到新项目
 * @param targetDir 项目路径
 * @param target 模版名称
 * @param _options 命令行参数
 */
export function create(targetDir: string, target: string, _options?: Record<string, any>) {
  const _arg1 = [
    `clone --branch ${target}`,
    `--single-branch ${URLS.origin}`,
    targetDir,
  ]
  spawnSync('git', _arg1, { shell: true, stdio: 'inherit' })
}

/**
 * 写入package.json文件
 * @param targetDir 项目路径
 * @param content 写入的数据
 */
export function writePackageJson(targetDir: string, content: Record<string, any>) {
  const pkgPath = path.join(targetDir, 'package.json')

  return new Promise<void>((resolve, reject) => {
    try {
      const pkgContent = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
      Object.assign(pkgContent, content)
      fs.writeFileSync(pkgPath, JSON.stringify(pkgContent, null, '\t'))
      resolve()
    }
    catch (error) {
      reject(new Error('写入package.json文件失败'))
    }
  })
}
