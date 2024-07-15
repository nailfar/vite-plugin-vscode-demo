import { commands, ExtensionContext } from 'vscode';
import { MainPanel } from './views/panel';

export function activate(context: ExtensionContext) {

  console.log('注册命令');
  context.subscriptions.push(
    commands.registerCommand('hello-world.showHelloWorld', async () => {
      MainPanel.render(context);
    }),
  );

  commands.executeCommand('hello-world.showHelloWorld')
}

export function deactivate() { }
