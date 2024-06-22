#!/usr/bin/env node
import path from 'node:path'
import process from 'node:process'

import chalk from 'chalk'
import { program } from 'commander'
import figlet from 'figlet'

import { URLS } from './utils/constants'
import { create, getStdIn, getTemplates, isExistProject, reInitGit, writePackageJson } from './utils/handler'
import { checkUrl, getPackageJson, readRepo, resetRepo, writeRepo } from './utils/tools'

const { version } = getPackageJson()

program
  .configureOutput({
    // 使输出变得容易区分
    writeOut: str => process.stdout.write(`${chalk.magenta(str)}`),
    writeErr: str => process.stdout.write(`${chalk.magenta(str)}`),
    // 将错误高亮显示
    outputError: (str, write) => write(chalk.redBright(str)),
  })

program
  .name('kc')
  .description('KC-CLI 脚手架工具')
  .usage('<command> [option]')
  .helpOption('-h, --help', '查看帮助')
  .version(`v${version}`, '-v, --version', '查看版本号')
  .addHelpText('after', `
  ${figlet.textSync('KC - CLI', {
    font: 'Big',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 80,
    whitespaceBreak: true,
  })}
  输入${chalk.yellow(` kc <command> --help `)}查看对应命令使用说明

  如有问题或使用反馈请访问 ${chalk.underline.dim(URLS.issue)} 提交 issue
  `)

// 默认提示隐藏 help 命令
program
  .command('help', { hidden: true })

// 创建命令
program
  .command('create', { isDefault: true })
  .alias('new')
  .description('新建项目')
  .argument('[name]', '项目名称（英文）', 'my-project')
  .option('-f, --force', '创建时强制删除已存在同名的文件夹')
  .option('-p, --path <path>', '指定项目创建路径')
  .action(async (name: string, options: Record<string, any>) => {
    const cwd = process.cwd()
    const targetPath = options.path ? options.path : cwd
    let targetDir: string

    try {
      if (name) {
        targetDir = path.join(targetPath, name)
        await isExistProject(name, targetDir, options.force)
      }

      const answers = await getStdIn(name)
      targetDir = path.join(targetPath, answers.name)
      await isExistProject(answers.name, targetDir, options.force)
      const target = await getTemplates()
      await create(targetDir, target, options)
      await writePackageJson(targetDir, answers)
      await reInitGit(targetDir)

      console.log(`\n${chalk.green('✔')} 已成功创建项目: ${chalk.underline.green(answers.name)}`)
      console.log('\n请执行以下命令进行开发：')
      console.log(`  ${chalk.yellow(`cd ${targetDir}`)}`)
      console.log(`  ${chalk.yellow('(p)npm install')}\n`)
    }
    catch (error) {
      console.error(chalk(error))
    }
  })

program
  .command('set')
  .description('设置模版仓库地址')
  .argument('[url]', '模版仓库地址', '')
  .action(async (url: string) => {
    try {
      if (!url)
        throw new Error('请输入仓库地址')

      if (!checkUrl(url))
        throw new Error('仓库地址格式不正确, 目前只支持github仓库')

      writeRepo(url)
      console.log(`${chalk.green('✔')} 已成功设置模版仓库地址: ${chalk.underline.green(url)}`)
      console.log(`${chalk.bgYellowBright('请确保模版仓库有2个以上分支, 脚手架会自动忽略 master 分支和 main 分支')} `)
    }
    catch (error) {
      console.error(chalk.bgRed(error))
    }
  })

program
  .command('current')
  .description('查看当前模版仓库地址')
  .action(() => {
    try {
      const url = readRepo()
      console.log(`${chalk.green('✔')} 当前模版仓库地址: ${chalk.underline.cyan(url)}`)
    }
    catch (error) {
      console.error(chalk.bgRed(error))
    }
  })

program
  .command('reset')
  .description('重置模版仓库地址')
  .action(() => {
    try {
      resetRepo()
      console.log(`${chalk.green('✔ 已成功重置模版仓库地址')} `)
    }
    catch (error) {
      console.error(chalk.bgRed(error))
    }
  })

// 解析用户执行命令传入参数
try {
  program.parse(process.argv)
}
catch (error) {
  console.error(chalk.bgRed(error))
  program.outputHelp()
}
