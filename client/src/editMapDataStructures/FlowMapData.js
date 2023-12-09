


export class FlowEdit {
    constructor(id, latlngs, colorRgba, label) {
      this.id = id  
      this.latlngs = latlngs
      this.colorRgba = colorRgba
      this.label = label
    }
  }

export class FlowHeader {
    constructor(numHeader, keyTable) {
      this.keyTable = keyTable
      this.numHeader = numHeader
      this.type = 'FLOW'
    }
}
