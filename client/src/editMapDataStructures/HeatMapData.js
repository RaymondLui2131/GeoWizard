
//Stores color information for a feature. COlor is in HSV format
export class HeatMapEdit {
    constructor(featureName, colorHLSA) {
      this.featureName = featureName;
      this.colorHLSA = colorHLSA;
    }
  }

export class HeatMapHeader {
    constructor(lower, upper, basecolorHLSA) {
      this.lower = lower;
      this.upper = upper;
      this.basecolorHLSA = basecolorHLSA
    }
  }

