class Vec3 {
    constructor(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
    }
  
    min() {
      return Math.min(this.x, this.y, this.z);
    }
  
    mid() {
      let arr = [this.x, this.y, this.z];
      arr.sort(function(a, b) { return a - b; });
      return arr[1];
    }
  
    max() {
      return Math.max(this.x, this.y, this.z);
    }
  }