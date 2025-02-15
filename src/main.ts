import * as vscode from "vscode";
import {
  isolateFolder_isolate,
  revealInExplorer,
  workbench_files_action_collapseExplorerFolders,
  workbench_view_explorer,
} from "./commands";

/**
 * the main function to perform, it could have been placed to the entry file `extension.ts` file, but I didn't want to clutter the entry file, and keep the entry file as neat and clean as possible.
 */
export function main(context: vscode.ExtensionContext) {
  // push subscription for the command to dispose
  context.subscriptions.push(
    vscode.commands.registerCommand(
      isolateFolder_isolate,
      /**
       * @param resource is the file `Uri` from where the command is invoked
       */
      async (resource: vscode.Uri | undefined) => {
        const workspaceFolders = vscode.workspace.workspaceFolders;

        // if no workspace is present
        if (!workspaceFolders || workspaceFolders.length === 0) {
          vscode.window.showErrorMessage("No workspace is open.");
          return;
        }

        if (!resource) {
          vscode.window.showWarningMessage(
            "No folder/file is selected. Collapsing all folders."
          );
          // collapse all folders.
          await vscode.commands.executeCommand(
            workbench_files_action_collapseExplorerFolders
          );

          return;
        }

        // if workspace is present and command is fired from an resource/context-menu-item
        const targetedWorkspace = workspaceFolders.find((workspace) =>
          resource.path.startsWith(workspace.uri.path)
        );

        // if command is not fired from a resource within workspace
        if (!targetedWorkspace) {
          vscode.window.showErrorMessage(
            "Target file/folder does not live in any workspace."
          );

          return;
        }

        // collapse other folder keeping the target folder open.
        await vscode.commands.executeCommand(
          workbench_files_action_collapseExplorerFolders
        );
        await vscode.commands.executeCommand(workbench_view_explorer);
        await vscode.commands.executeCommand(revealInExplorer, resource);
      }
    )
  );
}
