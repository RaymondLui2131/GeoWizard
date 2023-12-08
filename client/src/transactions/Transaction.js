import jsTPS from "../api/jsTPS";

export default class Transaction extends jsTPS {
    constructor(options, doFunc, undoFunc) {
        super();
        this.options = options;
        this.doFunc = doFunc
        this.undoFunc = undoFunc

    }

    doTransaction() {
        this.doFunc(this.options)
    }

    undoTransaction() {
        this.undoFunc(this.options)
    }
}