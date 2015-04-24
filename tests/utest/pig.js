// pig.js

(function(exports) {
  "use strict";


  function Horse(name) {

    this.watusi = "watusi";

    this.name = name || "Anon Horse";
  }
  exports.Horse = Horse;



  Horse.prototype = {
    greets: function(target) {
      if (!target)
        throw new Error("missing target");
      return this.name + " greets " + target;
    }
    
  };
})(this);
