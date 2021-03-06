/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Platform } from './platform';

export type PythonProjectType = 'django' | 'flask' | 'general';

export const PythonFileExtension = ".py";
export const PythonDefaultDebugPort: number = 5678;
export const PythonDefaultPorts: Map<PythonProjectType, number> = new Map<PythonProjectType, number>([
    ['django', 8000],
    ['flask', 5000],
]);

export type PythonTarget = PythonFileTarget | PythonModuleTarget;
export interface PythonFileTarget {
    file: string;
}

export interface PythonModuleTarget {
    module: string;
}

export function inferPythonArgs(projectType: PythonProjectType, ports: number[]): string[] | undefined {
    switch (projectType) {
        case 'django':
            return [
                'runserver',
                `0.0.0.0:${ports !== undefined ? ports[0] : PythonDefaultPorts[projectType]}`,
                '--nothreading',
                '--noreload'
            ];
        default:
            return undefined;
    }
}

export function getPythonProjectType(platform: Platform): PythonProjectType | undefined {
    switch (platform) {
        case 'Python: Django':
            return 'django';
        case 'Python: Flask':
            return 'flask';
        case 'Python: General':
            return 'general';
        default:
            return undefined;
    }
}
