"use strict";
/// <reference path="../../typings/node/node.d.ts" />
const crypto = require('crypto');
const orm = require('./orm');
const path = require('./path');
class Token {
    constructor(encode) {
        if (!encode) {
            encode = 'md5';
        }
        this.encode = encode;
    }
    create(data) {
        let obj = crypto.createHash(this.encode);
        return obj.update(data).digest('hex');
    }
}
exports.Token = Token;
class User {
    constructor() {
        this.path = path.get('origin') + 'user/';
        this.file = new orm.File(this.path);
        this.token = new Token();
        this.users = {};
    }
    get(token) {
        if (!token) {
            return {};
        }
        if (!this.users[token]) {
            try {
                this.users[token] = this.file.get(token);
            }
            catch (e) {
                return {};
            }
        }
        return this.users[token];
    }
    create(name, data) {
        let time = new Date().getTime() / 1000 | 0;
        let token = this.token.create(name + '-' + time);
        if (data['name']) {
            try {
                data["token"] = token;
                data["create_at"] = time;
                this.file.set(token, data);
                this.users[token] = data;
            }
            catch (e) {
                return false;
            }
            return token;
        }
        return false;
    }
}
exports.User = User;
