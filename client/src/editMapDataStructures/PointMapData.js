import { p1, p2, p3, p4, p5, p6, p7, p8, p9 } from '../../assets/EditMapAssets/pointerImages/index.js'

//Stores color information for a feature. COlor is in Hlsa format
const points = [p1, p2, p3, p4, p5, p6, p7, p8, p9]


export class PointEdit {
    constructor(id, points, bounds, lat, long, address) {
      this.id = id  
      this.symbol = points
      this.bounds = bounds  //bounds of ne and sw corners
      this.lat = lat
      this.long = long
      this.address = address
    }
  }

export class PointHeader {
    constructor(numHeader) {
      this.numHeader = numHeader
    }
  }
