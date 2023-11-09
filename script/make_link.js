import { existsSync, symlinkSync } from 'fs';
import { createInterface } from 'node:readline';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';


//************************************ Write you dir here ************************************

let targetDir = '';
let name = 'Lite';

//********************************************************************************************

const log = console.log;

async function getSiYuanDir() {
    let url = 'http://127.0.0.1:6806/api/system/getWorkspaces';
    try {
        let response = await fetch(url, {
            method: 'POST'
        });
        if (response.ok) {
            const conf = await response.json();
            return conf.data;
        } else {
            log(`HTTP-Error: ${response.status}`);
            return null;
        }
    } catch (e) {
        log("Error:", e);
        log("Please make sure SiYuan is running!!!");
        return null;
    }
}

async function chooseTarget(workspaces) {
    let count = workspaces.length;
    log(`Got ${count} SiYuan ${count > 1 ? 'workspaces' : 'workspace'}`)
    for (let i = 0; i < workspaces.length; i++) {
        log(`[${i}] ${workspaces[i].path}`);
    }

    if (count == 1) {
        return `${workspaces[0].path}\\conf\\appearance\\themes`;
    } else {
        const rl = createInterface({
            input: process.stdin,
            output: process.stdout
        });
        let index = await new Promise((resolve, reject) => {
            rl.question(`Please select a workspace[0-${count-1}]: `, (answer) => {
                resolve(answer);
            });
        });
        rl.close();
        return `${workspaces[index].path}\\conf\\appearance\\themes`;
    }
}

function getPackageDirectory() {
    const moduleURL = import.meta.url;
    const modulePath = fileURLToPath(moduleURL);
    const packagePath = path.join(dirname(modulePath), '../package.json');
    const directoryName = path.dirname(packagePath);
    return directoryName;
}

if (targetDir === '') {
    log('"targetDir" is empty, try to get SiYuan directory automatically....')
    let res = await getSiYuanDir();

    if (res === null) {
        log('Failed! You can set the plugin directory in scripts/make_link.js and try again');
        process.exit(1);
    }

    targetDir = await chooseTarget(res);
    log(`Got target directory: ${targetDir}`);
}

//Check
if (!existsSync(targetDir)) {
    log(`Failed! plugin directory not exists: "${targetDir}"`);
    log(`Please set the plugin directory in scripts/make_dev_link.js`);
    process.exit(1);
}

const targetPath = `${targetDir}\\${name}`;
//如果已经存在，就退出
if (existsSync(targetPath)) {
    log(`Failed! Target directory  ${targetPath} already exists`);
} else {
    //创建软链接
    symlinkSync(`${process.cwd()}`, targetPath, 'junction');
    log(`Done! Created symlink ${targetPath}`);
}
