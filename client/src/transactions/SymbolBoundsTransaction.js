import jsTPS from "../api/jsTPS";

export default class SymbolBoundsTransaction extends jsTPS {
    constructor(options) {
        super();
        Object.assign(this, options)
    }

    doTransaction() {
        const { foundMapping, oldBounds, newBounds, setBounds, editsList, setEditsList, addUpdateBounds, removeUpdateBounds } = this
        addUpdateBounds(foundMapping, newBounds, setBounds, editsList, setEditsList)
    }

    undoTransaction() {
        const { foundMapping, oldBounds, newBounds, setBounds, editsList, setEditsList, addUpdateBounds, removeUpdateBounds } = this
        removeUpdateBounds(foundMapping, oldBounds, setBounds, editsList, setEditsList)        
    }
}