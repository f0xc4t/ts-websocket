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
const mux = require('./lib/mux');
path.set('config', __dirname + '/../config/');
path.set('origin', __dirname + '/../');
var app = express();
var httpServer = http.createServer(app);
var user = new auth.User();
var muxobj = new mux.Mux();
var count = 0;
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
muxobj.register("register", function (data) {
    let token;
    if ("name" in data) {
        token = user.create(data['name'], data);
    }
    if (!token) {
        throw 'token error';
    }
    return user.get(token);
}).register("login", function (data) {
    if ("token" in data) {
        return user.get(data["token"]);
    }
    return {};
});
wsServer.on('connection', function (ws) {
    count++;
    console.log("user count:" + count);
    ws.on('message', function (message) {
        let data;
        try {
            console.log('input data: ' + message);
            data = JSON.parse(message);
        }
        catch (e) {
            ws.close();
        }
        for (let key in data) {
            try {
                let ret = JSON.stringify(muxobj.do(key, data[key]));
                console.log('return data: ' + ret);
                ws.send(ret);
            }
            catch (e) {
                count--;
                ws.close();
            }
        }
    });
});
httpServer.listen(config.port, function () {
    console.log((new Date()) + ' listen to ' + config.port);
});
