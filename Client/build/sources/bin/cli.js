#!/usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, Promise, generator) {
    return new Promise(function (resolve, reject) {
        generator = generator.call(thisArg, _arguments);
        function cast(value) { return value instanceof Promise && value.constructor === Promise ? value : new Promise(function (resolve) { resolve(value); }); }
        function onfulfill(value) { try { step("next", value); } catch (e) { reject(e); } }
        function onreject(value) { try { step("throw", value); } catch (e) { reject(e); } }
        function step(verb, value) {
            var result = generator[verb](value);
            result.done ? resolve(result.value) : cast(result.value).then(onfulfill, onreject);
        }
        step("next", void 0);
    });
};
var program = require('commander');
var app_1 = require('../app');
var fs = require('fs');
var logger = require('winston');
var path = require('path');
var child = require('child_process');
// Same with Shadowsocks https://shadowsocks.com/doc.html
program
    .usage('[options]')
    .option('-s, --server <addr|domain>', 'Server Address', String)
    .option('-p, --port <number>', 'Server Port Number', Number.parseInt)
    .option('-l, --localport <number>', 'Local Port Number', Number.parseInt)
    .option('-m, --method <algorithm>', 'Cipher Algorithm', String)
    .option('-k, --password <password>', 'Password', String)
    .option('-c, --config <path>', 'Configuration File Path', String)
    .option('-a, --any', 'Listen Any Connection')
    .option('-t, --timeout [number]', 'Timeout (second)')
    .option('-f, --fork', 'Run as Background')
    .option('-u, --socsk5username [name]', 'Socks5 Proxy Username', String)
    .option('-w, --socks5password [password]', 'Socks5 Proxy Password', String)
    .option('-i, --plugin [name]', 'Plugin Name', String)
    .parse(process.argv);
var args = program;
function parseFile(path) {
    if (!path)
        return;
    if (!fs.existsSync(path))
        return;
    var content = fs.readFileSync(path).toString();
    try {
        return JSON.parse(content);
    }
    catch (ex) {
        logger.warn('Configuration file error');
        logger.warn(ex.message);
    }
}
var fileOptions = parseFile(args.config) || {};
var argsOptions = {
    addr: args.any ? '0.0.0.0' : 'localhost',
    port: args.localport,
    serverAddr: args.server,
    serverPort: args.port,
    cipherAlgorithm: args.method,
    password: args.password,
    socks5Username: args.socks5username,
    socks5Password: args.socks5password,
    timeout: args.timeout,
    plugin: args.plugin
};
console.log(JSON.stringify(process.argv));
if (args.fork && !process.env.__daemon) {
    logger.info('Run as daemon');
    console.log(process.argv[1], process.execPath);
    process.env.__daemon = true;
    var cp = child.spawn(process.argv[1], process.argv.skip(2).toArray(), { detached: true, stdio: 'ignore', env: process.env, cwd: process.cwd() });
    cp.unref();
    console.log('Child PID: ', cp.pid);
    process.exit(0);
}
Object.getOwnPropertyNames(argsOptions).forEach(n => argsOptions[n] = argsOptions[n] || fileOptions[n]);
process.title = process.env.__daemon ? path.basename(process.argv[1]) + 'd' : 'LightSword Client';
new app_1.App(argsOptions);
//# sourceMappingURL=cli.js.map