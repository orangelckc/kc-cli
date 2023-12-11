import path from 'path'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import Generator from './Generator.js'

export async function init(name, options) {
  return inquirer.prompt([{
    type: 'input',
    name: 'name',
    message: '请输入项目名称：',
    default: name || 'kc-project'
  }, {
    type: 'input',
    name: 'version',
    message: '请输入项目版本号：',
    default: '1.0.0'
  }, {
    type: 'input',
    name: 'description',
    message: '请输入项目描述信息：',
    default: null
  }])
}

export async function create(name, options) {
  // 执行创建命令

  // 当前命令行选择的目录
  const cwd = process.cwd();
  // 需要创建的目录地址
  const target = path.join(cwd, name)

  // 目录是否已经存在？
  if (fs.existsSync(target)) {

    // 是否为强制创建？
    if (options.force) {
      await fs.remove(target)
    } else {
      // 询问用户是否确定要覆盖
      let { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: '目标目录已经存在，请选择一个操作：',
          choices: [
            {
              name: '覆盖',
              value: 'overwrite'
            }, {
              name: '取消',
              value: false
            }
          ]
        }
      ])

      if (!action) {
        return
      } else if (action === 'overwrite') {
        await fs.remove(target)
      }
    }
  }

  // 创建项目
  const generator = new Generator(name, target);

  // 开始创建项目
  generator.create()
}