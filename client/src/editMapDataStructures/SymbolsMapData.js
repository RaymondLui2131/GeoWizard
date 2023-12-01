//Stores color information for a feature. COlor is in Hlsa format
const symbols = ['circle', //valid symbol types
'hexagon',
'pentagon',
'square',
'star',
'triangle']


export class SymbolEdit {
    constructor(id, symbol,colorHLSA, bounds) {
      this.id = id  
      this.symbol = symbol
      this.colorHLSA = colorHLSA
      this.bounds = bounds  //bounds of ne and sw corners
    }
  }

export class SymbolHeader {
    constructor(numHeader) {
      this.numHeader = numHeader
    }
  }
