import { exec } from 'child_process'
import { ViewColumn, Webview } from 'vscode'
import { utils, webviewUtils } from '@easy_vscode/core'
import { IWebview, IWebviewProps, IMessage } from '@easy_vscode/core/lib/types'
import { getAllImgs, getImageBase64, getImageSize } from './imgUtils'
import { readLocalConfigFile, writeLocalConfigFile } from './imgConfig'
import { MESSAGE_CMD, WEBVIEW_NAMES } from "./constant"

const { deleteFile, getProjectPath, renameFile } = utils
const { successResp } = webviewUtils
const viewType = WEBVIEW_NAMES.PreviewImages

const invokeCallback = (webview: Webview, message, response) => {
  webview.postMessage({ cmd: 'vscodeCallback', callbackId: message.callbackId, data: response })
}

export const messageHandlers = new Map([
  [
    MESSAGE_CMD.GET_ALL_IMGS,
    (message: IMessage, webview: Webview) => {
      const imgs = getAllImgs(webview)
      invokeCallback(webview, message, { imgs, projectPath: getProjectPath() })
    }
  ],
  [
    MESSAGE_CMD.RENAME_FILE,
    (message: IMessage, webview: Webview) => {
      renameFile(message.data.filePath, message.data.newName)
      invokeCallback(webview, message, successResp)
    }
  ],
  [
    MESSAGE_CMD.DELETE_FILE,
    (message: IMessage, webview: Webview) => {
      deleteFile(message.data.filePath)
      invokeCallback(webview, message, successResp)
    }
  ],
  [
    MESSAGE_CMD.OPEN_IMAGE_DIRECTORY,
    (message: IMessage) => {
      exec(`open ${getProjectPath()}/${message.data.path}`)
    }
  ],
  [
    MESSAGE_CMD.GET_IMAGE_BASE64,
    (message: IMessage, webview: Webview) => {
      const strBase64 = getImageBase64(message.data.filePath)
      invokeCallback(webview, message, strBase64)
    }
  ],
  [
    MESSAGE_CMD.GET_IMAGE_SIZE,
    (message: IMessage, webview: Webview) => {
      const dimensions = getImageSize(message.data.filePath)
      invokeCallback(webview, message, dimensions)
    }
  ],
  [
    MESSAGE_CMD.SAVE_CONFIG,
    (message: IMessage, webview: Webview) => {
      writeLocalConfigFile(message.data)
      invokeCallback(webview, message, successResp)
    }
  ],
  [
    MESSAGE_CMD.GET_CONFIG,
    (message: IMessage, webview: Webview) => invokeCallback(webview, message, readLocalConfigFile())
  ],
  [
    MESSAGE_CMD.OCR,
    (message: IMessage, webview: Webview) => {
      console.info(message, '文字识别')
    }
  ]
])