


export class FlowEdit {
    constructor(id, latlngs, colorRgba) {
      this.id = id  
      this.latlngs = latlngs
      this.colorRgba = colorRgba
    }
  }

export class FlowHeader {
    constructor(numHeader) {
      this.numHeader = numHeader
      this.type = 'FLOW'
    }
}
