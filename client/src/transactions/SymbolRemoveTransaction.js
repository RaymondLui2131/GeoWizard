import jsTPS from "../api/jsTPS";

export default class SymbolRemoveTransaction extends jsTPS {
    constructor(options) {
        super();
        Object.assign(this, options)
    }

    doTransaction() {
        const { id, editsList, setEditsList, removeSymbol, addSymbol } = this
        removeSymbol(id, editsList, setEditsList)
    }

    undoTransaction() {
        const { id, editsList, setEditsList, removeSymbol, addSymbol } = this
        addSymbol(editsList, setEditsList)
    }
}