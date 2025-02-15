import * as vscode from "vscode";
import { main } from "./main";

export function activate(context: vscode.ExtensionContext) {
  main(context);
}

export function deactivate() {}
