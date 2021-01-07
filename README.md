# uni-xyt

## 因为uniapp打包的局限性，使用make编译文件 做的文件版本和cdn统一

### 编译线上版本
make prod

### 编译测试版本
make watch

## 注意index.css  文件名可能需要手动修改 echoapp的index模板文件

## 注意线上版本需要修改 config.js 的baseUrl版本

./src/config.js 
- API_BASE_URL  指定url请求的根路径

./src/manifest.json
- publicPath 指定静态资源加载的根路径