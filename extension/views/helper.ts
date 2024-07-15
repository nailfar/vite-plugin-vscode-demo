import { Disposable, ExtensionContext, Webview, window } from 'vscode';
import { IMessage } from './types';
import { addMessageHandler, handleWebviewMessage } from './tool';
import { messageHandlers } from './handlers';

export class WebviewHelper {
  public static setupHtml(webview: Webview, context: ExtensionContext) {
    return process.env.VITE_DEV_SERVER_URL
      ? __getWebviewHtml__(process.env.VITE_DEV_SERVER_URL)
      : __getWebviewHtml__(webview, context);
  }

  public static setupWebviewHooks(webview: Webview, disposables: Disposable[]) {

    addMessageHandler(messageHandlers); // 注册事件处理

    const handleReceiveMessage = (msg: IMessage) => handleWebviewMessage(msg, webview)

    webview.onDidReceiveMessage(
      handleReceiveMessage,
      undefined,
      disposables,
    );
  }
}
