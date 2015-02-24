(function(){
	console.log('CC has been loaded');
	
	// Create a safe reference to the cc object for use below.
	var cc = function(obj) {
    	if (obj instanceof cc) return obj;
    	if (!(this instanceof cc)) return new cc(obj);
  	};

  	cc.VERSION = '0.0.1';

  	cc.testing = function(){
  		console.log("CC function: TESTING");
  	};

  	//console.log();
  	//
  	//
  	// AMD registration happens at the end for compatibility with AMD loaders
  	// that may not enforce next-turn semantics on modules. Even though general
  	// practice for AMD registration is to be anonymous, cc registers
  	// as a named module because, like jQuery, it is a base library that can 
  	// be bundled in a third party lib, but not be part of
  	// an AMD load request. Those cases could generate an error when an
  	// anonymous define() is called outside of a loader request.
  	if (typeof define === 'function' && define.amd) {
    	define('coordinateConverter', [], function() {
      		return cc;
    	});
  	}
}).call(this);
