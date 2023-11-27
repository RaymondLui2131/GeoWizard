//Stores color information for a feature. COlor is in Hexformat
export class ChoroEdit {
    constructor(featureName, colorHEX) {
      this.featureName = featureName;
      this.colorHEX = colorHEX;
    }
  }

export class ChoroHeader {
    constructor(keyTable) {
      this.keyTable = keyTable   //[], each entry stored in {color:hexColor, label:label}
    }
  }