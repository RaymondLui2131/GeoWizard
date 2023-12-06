import jsTPS from "../api/jsTPS";

export default class HeatSwapTransaction extends jsTPS {
    constructor(options) {
        super();
        Object.assign(this, options)
    }

    doTransaction() {
        const { heatColor, hslaForm, hue, editsList, setEditsList, setBaseColor, setHlsa, addColorSwap } = this
        addColorSwap(hslaForm, hue, editsList, setEditsList, setBaseColor, setHlsa)
    }

    undoTransaction() {
        const { heatColor, hslaForm, hue, editsList, setEditsList, setBaseColor, setHlsa, removeColorSwap } = this
        removeColorSwap(editsList, heatColor, setBaseColor, setHlsa, setEditsList)
    }
}