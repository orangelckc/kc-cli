# @btrl/cli
基于vue3生态的个人脚手架工具（2023版）

## 技术栈
- [x] vite
- [x] unplugin-auto-import/vite
- [x] vue3
- [x] vue-router
- [x] pinia
- [x] unocss
- [x] eslint
- [x] stylelint
- [x] typescript
- [x] sass
- [x] simple-git-hooks
- [x] alova
  - 封装更实用的ajax请求库，支持小程序端

## 支持的模板
- [x] vue3 SPA起手模版
- [x] nuxt3 SSR起手模版
- [x] vue3 + tauri桌面应用起手模版
- [x] vue3 + uniapp 小程序起手模版
  - 内置uview-plus组件库
- [x] vue3 油猴脚本起手模版

## 全局安装

```shell
$ npm install -g @btrl/cli
```

## 使用

### 创建项目

```shell
$ kc [create|new] [project-name]
```

#### 参数

- `-f, --force`: 如果目录存在，强制删除后再创建
- `-p, --path`: 指定创建路径，默认为当前路径

### 查看帮助

```shell
$ kc --help
```

### 查看版本

```shell
$ kc --version
```
### 查看命令详情
```shell
$ kc [command] --help
```

## License

[MIT](./LICENSE) License &copy; 2023
