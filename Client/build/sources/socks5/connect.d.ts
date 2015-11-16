import * as net from 'net';
import { RequestOptions } from './localServer';
import { IPluginGenerator } from './interfaces';
export declare class Socks5Connect {
    cipherAlgorithm: string;
    password: string;
    dstAddr: string;
    dstPort: number;
    serverAddr: string;
    serverPort: number;
    clientSocket: net.Socket;
    timeout: number;
    connectPlugin: IPluginGenerator;
    constructor(plugin: IPluginGenerator, args: RequestOptions, isLocal?: boolean);
    connectServer(): void;
}