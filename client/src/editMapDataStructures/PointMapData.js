
export class PointEdit {
    constructor(id, description, point, bounds, lat, long, address) {
      this.id = id
      this.description = description
      this.point = point //which point img
      this.bounds = bounds  //bounds of ne and sw corners
      this.lat = lat
      this.long = long
      this.address = address
    }
  }

export class PointHeader {
    constructor(numHeader) {
      this.numHeader = numHeader
      this.type = 'POINT'
    }
  }
