## version
VERSION=v1.1.9
## 线上访问(使用CDN 速度快 但是需要上传)
PUBLIC_PATH_PROD=http://data.xytschool.com/m/$(VERSION)

## 线上测试环境访问(未使用CDN 速度慢)
PUBLIC_PATH_DEV=http://m.xytschool.com/dev/public

## 只能本机电脑访问(资源都在本地速递最快)
PUBLIC_PATH_LOCAL=/dev/public

UNI_OUTPUT_ROOT_DIR=/Users/mac/code/go/src/github.com/gw123/echo-app/resources/public/m
UNI_OUTPUT_DIR_PROD=$(UNI_OUTPUT_ROOT_DIR)/$(VERSION)
UNI_OUTPUT_DIR_DEV=$(UNI_OUTPUT_ROOT_DIR)/dev

API_BASE_ROOT_URL=http://m.xytschool.com
API_BASE_URL_PROD=$(API_BASE_ROOT_URL)/$(VERSION)
API_BASE_URL_DEV=$(API_BASE_ROOT_URL)/dev

ifeq "$(BUILD_TAG)" ""
	BUILD_TAG = $(DEFAULT_BUILD_TAG)
endif

prod:
	sed 's@{publicPath}@$(PUBLIC_PATH_PROD)@' ./src/manifest_tpl.json > ./src/manifest.json &&\
	sed 's@{API_BASE_URL}@$(API_BASE_URL_PROD)@' ./src/config_tpl.js > ./src/config.js &&\
	export UNI_OUTPUT_DIR=$(UNI_OUTPUT_DIR_PROD) && npm run build:h5\

watch:
	sed 's@{publicPath}@$(PUBLIC_PATH_DEV)@' ./src/manifest_tpl.json > ./src/manifest.json &&\
	sed 's@{API_BASE_URL}@$(API_BASE_URL_DEV)@' ./src/config_tpl.js > ./src/config.js &&\
	export  UNI_OUTPUT_DIR=$(UNI_OUTPUT_DIR_DEV) && npm run watch

upload-sh2:
	scp -r $(UNI_OUTPUT_DIR_PROD) root@sh2:/data/apps/echoapp/resources/public/m

upload-qiniu:
	 qshell qupload qiniu.conf

all: prod upload-sh2 upload-qiniu

