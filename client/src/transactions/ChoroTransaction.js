import jsTPS from "../api/jsTPS";

export default class ChoroTransaction extends jsTPS {
    constructor(choroColor, areaClicked, setAreaClicked, keyTable, setKeyTable, editsList, setEditsList, addChoroColor, removeChoroColor) {
        super();
        this.choroColor = choroColor;
        this.areaClicked = areaClicked;
        this.setAreaClicked = setAreaClicked;
        this.keyTable = keyTable;
        this.setKeyTable = setKeyTable;
        this.editsList = editsList;
        this.setEditsList = setEditsList;
        this.addChoroColor = addChoroColor;
        this.removeChoroColor = removeChoroColor;
        
    }

    doTransaction() {
        this.addChoroColor(this.choroColor, this.areaClicked, this.setAreaClicked, this.keyTable, this.setKeyTable, this.editsList, this.setEditsList)
    }

    undoTransaction() {
        this.removeChoroColor(this.areaClicked, this.keyTable, this.setKeyTable, this.editsList, this.setEditsList)
    }
}