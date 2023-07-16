#### pnpm
1. 子项目安装第三方依赖
`pnpm add <pkg-name> --filter <project-name>`

2. 子项目安装其他本地依赖的子项目
`pnpm add <sub-project-name1> --filter <sub-project-name2>`

3. 启动单个子项目
+ package.json中配置
```package.json
    "start:pkg1": "pnpm run -C packages/pkg1 <script commend>"
```
+ 执行
`pnpm run start:pkg1`

4. 同时启动所有子项目
`pnpm run -r start`


#### package.json
```json
    "lint": "eslint --ext .js,.ts,.tsx packages"
```