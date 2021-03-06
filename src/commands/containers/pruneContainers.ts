/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { window } from 'vscode';
import { IActionContext } from 'vscode-azureextensionui';
import { ext } from '../../extensionVariables';
import { callDockerodeWithErrorHandling } from '../../utils/callDockerodeWithErrorHandling';
import { convertToMB } from '../../utils/convertToMB';

export async function pruneContainers(context: IActionContext): Promise<void> {
    const confirmPrune: string = "Are you sure you want to remove all stopped containers?";
    // no need to check result - cancel will throw a UserCancelledError
    await ext.ui.showWarningMessage(confirmPrune, { modal: true }, { title: 'Remove' });

    /* eslint-disable-next-line @typescript-eslint/promise-function-async */
    const result = await callDockerodeWithErrorHandling(() => ext.dockerode.pruneContainers(), context);

    const numDeleted = (result.ContainersDeleted || []).length;
    const mbReclaimed = convertToMB(result.SpaceReclaimed);
    let message = `Removed ${numDeleted} container(s) and reclaimed ${mbReclaimed}MB of space.`;
    // don't wait
    /* eslint-disable-next-line @typescript-eslint/no-floating-promises */
    window.showInformationMessage(message);
}
