/// <reference path="../typings/ws/ws.d.ts" />
/// <reference path="../typings/express/express.d.ts" />
/// <reference path="./lib/config.ts" />
/// <reference path="./lib/orm.ts" />
/// <reference path="./lib/auth.ts" />
/// <reference path="./lib/path.ts" />
"use strict";
const express = require("express");
const http = require("http");
const ws = require("ws");
const configss = require("./lib/config");
const auth = require('./lib/auth');
const path = require('./lib/path');
path.set('config', __dirname + '/../config/');
path.set('origin', __dirname + '/../');
var app = express();
var httpServer = http.createServer(app);
var user = new auth.User();
try {
    var configz = configss.getConfig(path.get('config'));
    configz.load('server.json');
    var config = configz.get('server');
}
catch (e) {
    console.log(e.getMessage());
}
var WebSocketServer = ws.Server;
var wsServer = new WebSocketServer({
    host: config.host,
    server: httpServer
});
function broadcast(wss, data) {
    for (let i in wss.clients) {
        wss.clients[i].send(data);
    }
}
wsServer.on('connection', function (ws) {
    ws.on('message', function (message) {
        let data = JSON.parse(message);
        // TODO 紀錄log
        console.log(data);
        // TODO 修改此處邏輯
        if (data['login']) {
            let userData = data['login'];
            let token = (userData['token']) ? userData['token'] : null;
            if (!token && userData['name']) {
                try {
                    user.create(userData['name'], userData);
                }
                catch (e) {
                    ws.close();
                    // TODO 紀錄log
                    console.log(e);
                }
            }
            ws.send(JSON.stringify(user.get(token)));
        }
    });
});
httpServer.listen(config.port, function () {
    console.log((new Date()) + ' listen to ' + config.port);
});
