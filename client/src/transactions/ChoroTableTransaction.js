import jsTPS from "../api/jsTPS";

export default class ChoroTableTransaction extends jsTPS {
    constructor(color, keyTable, editsList, setKeyTable, setEditsList, removeTableEntry, addTableEntry, label) {
        super();
        this.color = color;
        this.keyTable = keyTable;
        this.editsList = editsList;
        this.setKeyTable = setKeyTable;
        this.setEditsList = setEditsList;
        this.removeTableEntry = removeTableEntry;
        this.addTableEntry = addTableEntry;
    }


    doTransaction() {
        this.removeTableEntry(this.color, this.keyTable, this.editsList, this.setKeyTable, this.setEditsList)
    }

    undoTransaction() {
        this.addTableEntry(this.color, this.keyTable, this.editsList, this.setKeyTable, this.setEditsList)
    }
}