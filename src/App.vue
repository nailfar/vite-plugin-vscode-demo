<script setup lang="ts">
import { ref } from "vue";

import {
  allComponents,
  provideVSCodeDesignSystem,
} from "@vscode/webview-ui-toolkit";
import { callVscode, formatBytes } from "./utils";
import { MESSAGE_CMD } from "../extension/views/constant";

interface IImage {
  /**
   * 盘符 c:\\
   */
  root?: string;
  /**
   * 所在文件夹
   */
  dir?: string;
  /**
   *
   */
  relativeDir: string;
  /**
   * 名称带类型 xxxx.png
   */
  base?: string;
  /**
   * 名称不带类型 xxxx
   */
  name?: string;
  /**
   * 后缀带.
   */
  ext?: string;
  /**
   * 相对打开目录的路径,包含文件名字,后缀
   */
  path?: string;
  /**
   * 全路径
   */
  filePath?: string;
  /**
   * vscode 显示使用的path
   */
  vscodePath?: string;
  /**
   * 文件大小
   */
  size?: number;
  /**
   * 格式化后的文件大小
   */
  formatSize?: string;
  /**
   * 打开的目录
   */
  projectPath?: string;
  /**
   * ocr识别的文本内容
   */
  ocrString?: string;
  /**
   * ocr 要识别的图片内容 base64
   */
  ocrImg?: "";
}

provideVSCodeDesignSystem().register(allComponents);

const allImgAsts = ref<IImage[]>([]);

function onPostMessage() {
  console.info(MESSAGE_CMD);
  callVscode(
    {
      cmd: MESSAGE_CMD.GET_ALL_IMGS,
      data: { msg: "vscode 获取当前打开文件夹里的图片,webview.asWebviewUri路径转化为可访问的地址" },
    },
    (e) => {
      // e.g. https://file%2B.vscode-resource.vscode-cdn.net/Users/user_name/project_dir/src/favicon.ico
      const { imgs, projectPath } = e || {};
      allImgAsts.value = imgs.map((img) => {
        const relativeDir = img.dir?.replace(projectPath || "", "") || "/";
        const newImg = {
          ...img,
          projectPath,
          formatSize: formatBytes(img.size),
          relativeDir: relativeDir,
          ocrString: "",
          ocrImg: "",
        };
        console.info(JSON.stringify(newImg, null, 2));
        return newImg;
      });
    }
  );
}

onPostMessage();
</script>

<template>
  <div>
    <div
      v-for="img in allImgAsts"
      :key="img.filePath"
      class="flex flex-col relative of-hideen"
    >
      <img :src="img.vscodePath" alt="" class="w-200px h-200px" />
      <vscode-text-field :value="img.vscodePath" class="mt-5px">
        
      </vscode-text-field>
    </div>
  </div>
</template>

<style>
#app,
html,
body {
  width: 100%;
  height: 100%;
  padding: 0 !important;
}
</style>
