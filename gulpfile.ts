/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// tslint:disable:no-implicit-dependencies
import * as cp from 'child_process';
import * as fse from 'fs-extra';
import * as gulp from 'gulp';
import * as path from 'path';
import { gulp_installAzureAccount, gulp_webpack } from 'vscode-azureextensiondev';

const env = process.env;

function test(): cp.ChildProcess {
    env.DEBUGTELEMETRY = '1';
    env.CODE_TESTS_WORKSPACE = path.join(__dirname, 'test/test.code-workspace');
    env.MOCHA_timeout = String(10 * 1000);
    env.CODE_TESTS_PATH = path.join(__dirname, 'dist/test');
    return spawn('node', ['./node_modules/vscode/bin/test'], { stdio: 'inherit', env });
}

function spawn(command: string, args: string[], options: {}): cp.ChildProcess {
    if (process.platform === 'win32') {
        if (fse.pathExistsSync(command + '.exe')) {
            command = command + '.exe';
        } else if (fse.pathExistsSync(command + '.cmd')) {
            command = command + '.cmd';
        }
    }

    return cp.spawn(command, args, options);
}

async function sortPackageJson(): Promise<void> {
    const fsPath = path.join(__dirname, 'package.json');
    console.log(fsPath);
    // tslint:disable: no-any no-unsafe-any
    const packageJson: any = await fse.readJSON(fsPath);
    packageJson.activationEvents.sort();
    packageJson.contributes.menus["view/item/context"].sort((a, b) => {
        if (a.group === b.group) {
            return a.command.localeCompare(b.command);
        } else {
            return a.group.localeCompare(b.group);
        }
    });
    packageJson.contributes.commands.sort((a, b) => a.command.localeCompare(b.command));
    await fse.writeFile(fsPath, JSON.stringify(packageJson, undefined, 4));
    // tslint:enable: no-any no-unsafe-any
}

exports.sortPackageJson = sortPackageJson;
exports['webpack-dev'] = () => gulp_webpack('development');
exports['webpack-prod'] = () => gulp_webpack('production');
exports.test = gulp.series(gulp_installAzureAccount, test);
