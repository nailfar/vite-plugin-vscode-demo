import type { IMessage, MessageCallback } from "@easy_vscode/core/lib/types"

import { vscode } from './vscode';

// type IVscode = {
//   postMessage: (message: IMessage) => void
// }
// declare const acquireVsCodeApi: () => IVscode

// let vscode: IVscode = {
//   postMessage: () => { }
// }
// try {
//   if (!location.origin.startsWith('http')) {
//     vscode = acquireVsCodeApi()
//   }
// } catch (error) {
//   console.error('acquireVsCodeApi not exists:', error)
// }

const callbacks = {}

window.addEventListener('message', (event) => {
  const message = event.data
  switch (message.cmd) {
    case 'vscodeCallback':
      //   console.log(message.data)
      const callback = callbacks[message.callbackId]
      if (callback && typeof callback === 'function') {
        callback(message.data)
      }
      delete callbacks[message.callbackId]
      break
    default:
      break
  }
})

export const getRandomId = () => Date.now() + '_' + Math.round(Math.random() * 100000)

/**
 * post message to vscode extension
 * @param msg
 * @param callback
 */
export const callVscode = (msg: Partial<IMessage>, callback?: MessageCallback) => {
  msg.msgId = getRandomId()
  msg.postTime = new Date().toLocaleString()
  if (callback) {
    const callbackId = getRandomId()
    callbacks[callbackId] = callback
    msg.callbackId = callbackId
  }
  vscode.postMessage(msg as IMessage)
}