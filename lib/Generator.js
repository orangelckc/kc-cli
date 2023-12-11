
import { getRepoList, getTagList } from './http.js'
import ora from 'ora'
import inquirer from 'inquirer'
import util from 'util'
import path from 'path'
import downloadGitRepo from 'download-git-repo' // 不支持 Promise
import chalk from 'chalk'
import { REPO_NAME } from './constants.js'

const TEMPLATE_REPO_URL = 'https://github.com/orangelckc/bili-bot.git'

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
  constructor(name, targetDir) {
    // 目录名称
    this.name = name;
    // 创建位置
    this.targetDir = targetDir;

    // 改造 download-git-repo 支持 promise
    this.downloadGitRepo = util.promisify(downloadGitRepo);
  }

  // 获取用户选择的模板
  // 1）从远程拉取模板数据
  // 2）用户选择自己新下载的模板名称
  // 3）return 用户选择的名称

  async getRepo() {
    // 1）从远程拉取模板数据
    const repoList = await wrapLoading(getRepoList, '获取可用模板');
    if (!repoList || !repoList.length) return;

    // 过滤我们需要的模板名称
    const repos = repoList.map(item => item.name);

    // 2）用户选择自己新下载的模板名称
    const { repo } = await inquirer.prompt({
      name: 'repo',
      type: 'list',
      choices: repos,
      message: '选择要创建项目的模版'
    })

    // 3）return 用户选择的名称
    return repo;
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
  async download(repo, tag) {

    // 1）拼接下载地址
    // git clone地址，需要配合clone参数才可以下载完整文件
    // const requestUrl = `direct:${TEMPLATE_REPO_URL}`;
    // 直接使用download下载
    const requestUrl = `${REPO_NAME}/${repo}${tag ? '#' + tag : ''}`;

    // 2）调用下载方法
    await wrapLoading(
      this.downloadGitRepo, // 远程下载方法
      '下载模版...', // 加载提示信息
      requestUrl, // 参数1: 下载地址
      path.resolve(process.cwd(), this.targetDir), // 参数2: 创建位置
      // { clone: true }, // 参数3: 是否克隆
    );
  }

  // 核心创建逻辑
  // 1）获取模板名称
  // 2）获取 tag 名称
  // 3）下载模板到模板目录
  async create() {
    try {
      // 1）获取模板名称
      const repo = await this.getRepo()

      // 2) 获取 tag 名称
      const tag = await this.getTag(repo)

      // 3）下载模板到模板目录
      await this.download(repo, tag)

      console.log(`\r\n成功创建项目 ${chalk.cyan(this.name)}`)
    } catch (error) {
      console.log(`\r\n创建项目失败: ${chalk.red(error.message)} 😭`)
    }
  }
}

export default Generator