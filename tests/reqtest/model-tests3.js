

// var Test = {do: function(thing){ return "no"}
// }



describe('Upload Component message.publish channel', function() {
	  		var upload, exitBeforeEach, meridian;

		  	//Read up on hooks: there might be a way of doing this outside the describe for a cleaner look.


			//
			// 	buttonClickSuccessSpy = sinon.spy();
			//
			// //    $(document).on('buttonClickSucess', buttonClickSuccessSpy);
			// $(".successButton").on('shabbadabbadoobah', function(){console.log('yash')});





		  	beforeEach(function(done) {


		    	require(
						[
							'../../app/bower_components/jquery/dist/jquery',
        //  '../../app/bower_components/aura/lib/aura',
          //'./libs/chai.js',
        //  '../../libs/jquery-csswatch-1.2.1/jquery.csswatch',
          './libs/sinon-1.14.1.js'],
					function() {


					});//end of then

					// buttonClickSuccessSpy = sinon.spy();


				});//end of require

		  	});//end of beforeEach







// describe('Array', function(){
//   describe('#indexOf()', function(){
//     it('should return -1 when the value is not present', function(){
// 			chai.should();
// 			console.log(sinon);
// 			buttonClickSuccessSpy = sinon.spy();
//       [1,2,3].indexOf(5).should.equal(-1);
//       [1,2,3].indexOf(0).should.equal(-1);
// 			console.log(chai);
//     });
//   });
// });

describe('sinonFun', function(){
	it('should stub a method', function(){


 chai.should();
		//
 var Test = {do: function(thing){ return "no"}}
		//
		//
		//
//	   console.log(Test.do("thing"))
		//
		Test.do("thing").should.equal("no")
	  sinon.stub(Test, "do", function(){return "yes"})

	  Test.do("thing").should.equal("yes")
		Test.do.restore()
		    Test.do("thing").should.equal("no")
	})
})


//
// describe('buttonClick', function(){
//
//   Test.do("thing").should.equal("no")
//
//   sinon.stub(Test, "do", function(){return "yes"})
//   Test.do("thing").should.equal("yes")
// });
