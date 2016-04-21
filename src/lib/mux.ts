/// <reference path="../../typings/node/node.d.ts" />

export class Mux {
    private cb:{[key:string]:any};
    
    constructor() {
       this.cb = {}; 
    }
    
    register(key:string, callback:(data:any, view?:any) => void):this {
        if (typeof callback === 'function') {
            this.cb[key] = callback;
        }
        
        return this;
    }
    
    do(key:string, data:any, view?:any) {
        if (key in this.cb) {
            return this.cb[key].call(this, data, view);
        }
    }
}
