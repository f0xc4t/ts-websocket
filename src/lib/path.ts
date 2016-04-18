'use strict';
var path:{[key:string]:string};

path = {};

export function set(key:string, p:string, rewrite?:boolean) {
    if (!path[key] || rewrite === true) {
        path[key] = p;
    }
}

export function get(key:string) {
    return (path[key]) ? path[key] : null;
}
