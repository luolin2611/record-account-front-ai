#!/bin/bash

# 删除旧的构建文件
rm -rf dist

# 构建项目
yarn build

# 预览构建结果
yarn preview 