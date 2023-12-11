
import { getBranchList, getTagList } from './http.js'
import ora from 'ora'
import inquirer from 'inquirer'
import util from 'util'
import path from 'path'
import downloadGitRepo from 'download-git-repo' // 不支持 Promise
import chalk from 'chalk'
import { URLS } from './constants.js'
import fs from 'fs';

// 添加加载动画
async function wrapLoading(fn, message, ...args) {
  // 使用 ora 初始化，传入提示信息 message
  const spinner = ora(message);
  // 开始加载动画
  spinner.start();

  try {
    // 执行传入方法 fn
    const result = await fn(...args);
    // 状态为修改为成功
    spinner.succeed();
    return result;
  } catch (error) {
    spinner.fail(`请求失败，失败原因：${error.message}`)
    throw error;
  }
}

class Generator {
  constructor(targetDir, name, version, description) {
    // 目录名称
    this.name = name;
    // 创建位置
    this.targetDir = targetDir;
    // 模板信息
    this.version = version;
    this.description = description;

    // 改造 download-git-repo 支持 promise
    this.downloadGitRepo = util.promisify(downloadGitRepo);
  }

  // 获取用户选择的模板
  // 1）从远程拉取模板数据
  // 2）用户选择自己新下载的模板名称
  // 3）return 用户选择的名称

  async getBranches() {
    // 1）从远程拉取模板数据
    const branchList = await wrapLoading(getBranchList, '获取可用模板');
    if (!branchList || !branchList.length) return;

    // 过滤我们需要的模板名称
    const branches = branchList.filter(item => item.name !== 'main').map(item => item.name);

    // 2）用户选择自己新下载的模板名称
    const { branch } = await inquirer.prompt({
      name: 'branch',
      type: 'list',
      choices: branches,
      message: '选择要创建项目的模版'
    })

    // 3）return 用户选择的名称
    return branch;
  }

  // 获取用户选择的版本
  // 1）基于 repo 结果，远程拉取对应的 tag 列表
  // 2）用户选择自己需要下载的 tag
  // 3）return 用户选择的 tag

  async getTag(repo) {
    // 1）基于 repo 结果，远程拉取对应的 tag 列表
    const tags = await wrapLoading(getTagList, '获取可用模版tag', repo);
    if (!tags) return;

    // 过滤我们需要的 tag 名称
    const tagsList = tags.map(item => item.name);
    console.log('tagsList', tagsList)

    // 2）用户选择自己需要下载的 tag
    const { tag } = await inquirer.prompt({
      name: 'tag',
      type: 'list',
      choices: tagsList,
      message: '选择一个 tag 创建项目'
    })

    // 3）return 用户选择的 tag
    return tag
  }

  // 下载远程模板
  // 1）拼接下载地址
  // 2）调用下载方法
  async download(branch, tag) {

    // 1）拼接下载地址
    // 带有tag的下载地址
    // const requestUrl = `${REPO_NAME}/${repo}${tag ? '#' + tag : ''}`;
    const requestUrl = `direct:${URLS.origin}#${branch}`;

    // 2）调用下载方法
    await wrapLoading(
      this.downloadGitRepo, // 远程下载方法
      '下载模版中...', // 加载提示信息
      requestUrl, // 参数1: 下载地址
      path.resolve(process.cwd(), this.targetDir), // 参数2: 创建位置
      { clone: true }, // 参数3: 是否克隆
    );
  }

  // 核心创建逻辑
  // 1）获取模板名称
  // 2）获取 tag 名称
  // 3）下载模板到模板目录
  async create() {
    try {
      // 1）获取模板名称
      const branch = await this.getBranches()

      // 2) 获取 tag 名称
      // const tag = await this.getTag(repo)

      // 3）下载模板到模板目录
      await this.download(branch)

      // 4）修改 package.json
      const pkg = path.resolve(this.targetDir, 'package.json');
      const pkgContent = JSON.parse(fs.readFileSync(pkg, 'utf-8'));

      pkgContent.name = this.name;
      pkgContent.version = this.version;
      pkgContent.description = this.description;
      fs.writeFileSync(pkg, JSON.stringify(pkgContent, null, '\t'), 'utf-8');

      console.log(`\r\n成功创建项目 ${chalk.cyan(this.name)}`)
    } catch (error) {
      console.log(`\r\n创建项目失败: ${chalk.red(error.message)} 😭`)
    }
  }
}

export default Generator