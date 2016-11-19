# 一套基于gulp+nodejs的前端自动化工具 [![Build Status](https://travis-ci.org/dsky1990/gulp-task.svg?branch=master)](https://travis-ci.org/dsky1990/gulp-task)

解决雪碧图的生成，sass验证，sass to css，css、js压缩，js验证，js去除console、alert、and debugger，图片压缩，游览器自动刷新

## 目录结构
```
+ build(开发目录)
  - css(sass编译后的输出文件夹)
  - js
  - images
  - icon(图标文件夹)
  - sass
+ dist(发布目录)
  - css
  - js
  - images
```

## 环境

### 安装环境

[nodejs](https://nodejs.org/en/)v4.4.2 LTS

[gulpjs](http://gulpjs.com/)


### 安装方法
- 安装gulp
```js
npm install gulp --save-dev
```

## 使用

### 指令

- 安装依赖包(基于package.json里面的依赖关系)
```js
npm install
```

- 运行所有任务
```js
gulp
```
- css sprite
```js
gulp css-sprite
```
- 图片压缩
```js
gulp imagemin
```
- sass to css
```js
gulp sass-to-css
```
- 压缩css
```js
gulp minify-css
```
- sass验证
```js
gulp scss-lint
```

- js验证
```js
gulp eslint
```
- js压缩
```js
gulp jscompress
```
- 文件监控
```js
gulp watch
```

- 游览器刷新
```js
browser-sync
```