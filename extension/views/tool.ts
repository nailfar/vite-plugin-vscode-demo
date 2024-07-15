import { exec } from 'node:child_process'
import * as fs from 'node:fs'
import * as path from 'node:path'
import type { ExtensionContext, Webview, WebviewPanel } from 'vscode'
import { Uri, WebviewView, commands, env, window } from 'vscode'
import type { IMessage, IWebview } from './types'
import * as utils from './utils'

const { logInfo } = utils

export type WebviewContainer = WebviewPanel

const panels = new Map<string, WebviewContainer>()

export const BUILTIN_MESSAGE_CMD = {
  /* Common */
  EXECUTE_SPECIFIC_COMMAND: 'executeSpecificCommand',
  EXECUTE_CHILD_PROCESS: 'executeChildProcess',
  LOG_INFO: 'logInfo', // log for debug
  REVEAL_WEBVIEW: 'revealWebview',
}
/**
 * all message handlers
 */
const messageCenter: Map<string, (message: IMessage, webview: Webview) => any> = new Map([
  [
    BUILTIN_MESSAGE_CMD.EXECUTE_SPECIFIC_COMMAND,
    (message: IMessage) => {
      commands.executeCommand(message.data.command)
    },
  ],
  [
    BUILTIN_MESSAGE_CMD.EXECUTE_CHILD_PROCESS,
    (message: IMessage) => {
      exec(message.data.command)
    },
  ],
  [
    BUILTIN_MESSAGE_CMD.LOG_INFO,
    (message: IMessage) => {
      utils.logInfo(message.data.info)
    },
  ],
])

function getEnvForWebview() {
  return {
    language: env.language,
  }
}

export function handleWebviewMessage(message: IMessage, webview: Webview) {
  logInfo(`extension 接受消息：${JSON.stringify(message)}`)
  const handler = messageCenter.get(message.cmd)
  if (handler) {
    const re = handler(message, webview);
    if (re?.then) {
      re.then((resp) => {

      })
    } else if (re) {
      // webview.postMessage({ type:})
    }
  }
  else {
    utils.showError(`Handler function "${message.cmd}" doesn't exist!`)
  }
}

export function addMessageHandler(messageHandlers: Map<string, (message: IMessage, webview: Webview) => any>) {
  messageHandlers.forEach((value, key) => {
    if (messageCenter.get(key)) {
      utils.showError(`Message handler named ${key} already exists!`)
    }
    messageCenter.set(key, value)
    logInfo(`register message handler ${key}`)
  })
}
