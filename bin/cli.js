#!/usr/bin/env node

import { program } from 'commander';
import figlet from 'figlet';
import chalk from 'chalk';
import { VERSION } from '../lib/constants.js';
import { create, init } from '../lib/create.js';

program
  .name('kc')
  .description('KC-CLI 脚手架工具')
  .version(`v${VERSION}`)
  .usage('<command> [option]')

program
  .on('--help', () => {
    console.log('\r\n' + figlet.textSync('KC-CLI', {
      font: 'Ghost',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true
    }));
    console.log(`\r\n输入 ${chalk.cyan(`kc <command> --help`)} 查看对应命令使用说明\r\n`)
  })

program
  .command('create')
  .alias('new')
  .description('新建一个项目')
  .argument('[name]', '项目名称（英文）', 'kc-project')
  .option('-f, --force', '创建时强制删除已存在同名的文件夹')
  .action(async (name, options) => {
    await init(name, options)
    create(name, options)
  })

// 解析用户执行命令传入参数
program.parse(process.argv);