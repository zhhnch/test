let path = require('path');
let fs = require('fs');
const APP_ROOT = path.normalize(`${__dirname}${path.sep}..`);
// const DIST_PATH = path.normalize(`${APP_ROOT}${path.sep}dist`);
// const COMMON_JS_PATH = path.normalize(`${DIST_PATH}${path.sep}common.js`);
// const INDEX_PATH = path.normalize(`${APP_ROOT}${path.sep}index.html`);
const REG_TPL_APP_VERSION = /%appVersion%/;
const FILE_ENCODE = 'utf-8';
const ASSETS_ORIGIN = '//cdn.mms.ukelink.com:3008';
const REG_TPL_ASSETS_ORIGIN = /%assetsOrigin%/;
let realAppVersion = 'v1.0.01';

class TplCompiler {

    constructor() {

    }

    inputTpl() {

    }

    compileTpl() {

    }

    outputTpl() {

    }

}

class TplReader {

}

class TplWriter {

}


let conf = {
    assetsOrigin: '//cdn.mms.ukelink.com:3008',
    appVersion: 'v1.0.01'
};

const DEFAULT_WRITE_OPTIONS = {
    flags: 'w',
    encoding: 'utf8',
    fd: null,
    mode: 0o666,
    autoClose: true
};
compileTplVars(
    [
        [
            REG_TPL_APP_VERSION, realAppVersion],
        [
            REG_TPL_ASSETS_ORIGIN, ASSETS_ORIGIN
        ]
    ], INDEX_PATH, INDEX_PATH);
compileTplVars(
    [
        [
            REG_TPL_ASSETS_ORIGIN, ASSETS_ORIGIN
        ]
    ], COMMON_JS_PATH, COMMON_JS_PATH
);
function compileTplVars(ruleList, sourceFile, targetPath) {
    fs.exists(sourceFile, function (exists) {
        if (!exists) {
            console.log(`File ${sourceFile} not exists.`);
        } else {
            fs.readFile(sourceFile, FILE_ENCODE, function (err, file) {
                if (err) {
                    console.log(`Read file ${sourceFile} error.`);
                } else {
                    if (ruleList instanceof Array && ruleList.length) {
                        try {
                            ruleList.forEach(function (ruleMap) {
                                let [reg, target] = ruleMap;
                                if (reg && reg instanceof RegExp) {
                                    file = file.replace(new RegExp(reg.source, 'gi'), target);
                                }
                            });
                            fs.writeFile(targetPath, file, FILE_ENCODE, function (err) {
                                if (err) {
                                    console.log(`FAILED`);
                                } else {
                                    console.log(`SUCCESS`);
                                }
                            });
                        } catch (e) {
                            console.log(`Parse rule failed.`);
                        }
                    } else {
                        console.log("Not rule settle");
                    }
                }
            });
        }
    });
}

/**
 *
 * @param {{srcFile:string, tagFile:string, encode:string, data:Object}} options
 */
function compileTplConf(options) {
    let {srcFile, tagFile, encode, data} = options;
    if (!tagFile) {
        tagFile = srcFile;
    }
    if (!encode) {
        encode = FILE_ENCODE;
    }
    _readFile(srcFile, encode).then(fileContent => {
        return _saveFile(_replaceTpl(fileContent, data), tagFile);
    }).then(rs => {

    }, err => {

    })
}

/**
 *
 * @param {String} srcFile
 * @param {String} encode
 * @return {Promise}
 * @private
 */
function _readFile(srcFile, encode) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(srcFile)) {
            reject({
                code: '',
                msg: ''
            });
            return void(0);
        }
        fs.readFile(srcFile, encode, function (err, file) {
            if (err) {
                reject({
                    code: '',
                    msg: ''
                });
            } else {
                resolve(file);
            }
        });
    });


}

function _replaceTpl(tpl, data, patternMode) {
    let keys = Object.keys(data);
    keys.forEach(k => {
        let keyPattern = _genPatternKey(k);
        tpl = tpl.replace(keyPattern, data[k]);
    });
    return tpl;
}

function _genPatternKey(str, patternMode) {

}

function _createFile(filePath) {
    let dir = path.dirname(filePath);
    let dirExists = fs.existsSync(dir);
    if (!dirExists) {
        dirExists = fs.mkdirSync();
    }
    return new Promise((resolve, reject) => {
        if (!dirExists) {
            reject({
                code: '',
                msg: '',
                context: ''
            });
            return void(0);
        }

    });
}


function _writeFile(filePath, fileContent, encode) {
    let fileEncode = encode || FILE_ENCODE;
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, fileContent, fileEncode, function (err) {
            if (err) {
                reject({
                    code: '',
                    msg: '',
                    context: ''
                });
            } else {
                resolve();
            }
        });
    });

}



const TEST_PATH = path.normalize(`${APP_ROOT}${path.sep}test.txt`);
readFile(TEST_PATH).then(fileContent => {
    console.log("readfile succ ==:\n", fileContent);
}, err => {
    console.error('readfile err', err);
});
function readFile(filePath, options){
    let opts = Object.assign({
        flags: 'r',
        encoding: 'utf8',
        fd: null,
        mode: 0o666,
        autoClose: true,
        start: 0
    }, options);
    let stream = fs.createReadStream(filePath, opts);
    return new Promise((resolve, reject)=>{
        let chunkArr = [];
        stream.on('data', function(chunk) {
            chunkArr.push(chunk);
        });
        stream.on('error', (err) => {
            reject(err);
        });
        stream.on('open', ()=>{
            console.log(`=== open file ${filePath} ===`);
        });
        stream.on('end', () => {
            resolve(chunkArr.join(''));
        });
    });
}

function writeFile(filePath, fileContent = '', options = {}) {
    let opts = Object.assign({
        flags: 'w',
        encoding: 'utf8',
        fd: null,
        mode: 0o666,
        autoClose: true
    }, options);
    let stream = fs.createWriteStream(filePath, opts);
    return new Promise((resolve, reject)=>{
        stream.on('open', () => {
            const blockSize = 128;
            const nbBlocks = Math.ceil(fileContent.length / blockSize);
            for (let i = 0; i < nbBlocks; i ++) {
                let currentBlock = fileContent.slice(
                    blockSize * i,
                    Math.min(blockSize * (i + 1), fileContent.length)
                );
                stream.write(currentBlock);
            }
            stream.end();
        });

        stream.on('error', (err) => {
            reject(err);
        });

        stream.on('finish', () => {
            resolve(true);
        });
    });

}
