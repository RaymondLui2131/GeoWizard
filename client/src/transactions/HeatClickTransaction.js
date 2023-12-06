import jsTPS from "../api/jsTPS";

export default class HeatClickTransaction extends jsTPS {
    constructor(options) {
        super();
        Object.assign(this, options)
    }

    doTransaction() {
        const { newEdit, areaClicked, setSelected, editsList, setEditsList, setAreaClicked, addHeatArea } = this
        addHeatArea(newEdit, areaClicked, setSelected, editsList, setEditsList, setAreaClicked)
    }

    undoTransaction() {
        const { newEdit, editsList, setEditsList, removeHeatArea } = this
        removeHeatArea(newEdit, editsList, setEditsList)
    }
}