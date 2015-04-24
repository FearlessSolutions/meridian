var stone = 10;
console.log (stone);

var MODULE = (function () {
	var my = {},
		privateVariable = 1;

	function privateMethod() {
		// ...
	}

	my.moduleProperty = 1;
	my.moduleMethod = function () {
		// ...
    console.log(5);
	};


	return my;
}());

var MODULE = (function (my) {
	my.anotherMethod = function () {
console.log ("Another");
	};

	return my;
}(MODULE));

MODULE.moduleMethod();
console.log (MODULE.moduleProperty);
MODULE.anotherMethod();
