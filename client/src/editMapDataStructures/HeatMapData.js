
//Stores color information for a feature. COlor is in Hlsa format
export class HeatMapEdit {
    constructor(featureName, colorHLSA) {
      this.featureName = featureName;  //feature is labeled with key
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

