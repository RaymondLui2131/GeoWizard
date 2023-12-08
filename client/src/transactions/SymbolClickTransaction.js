import jsTPS from "../api/jsTPS";

export default class SymbolClickTransaction extends jsTPS {
    constructor(options) {
        super();
        Object.assign(this, options)
    }

    doTransaction() {
        const {newEdit, editsList, setEditsList, addSymbol, removeSymbol} = this
        addSymbol(newEdit, editsList, setEditsList)
    }

    undoTransaction() {
        const {newEdit, editsList, setEditsList, addSymbol, removeSymbol} = this
        removeSymbol(editsList, setEditsList)
    }
}