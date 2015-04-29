//var chai = require('chai')
//chai.should()

//var sinon = require('sinon')

// define(function (require) {
//     var sinon = require('sinon');
// });

// require(['sinon'], function (sinon) {
//     //foo is now loaded.
// });



var Test = {do: function(thing){ return "no"}
}

describe('buttonClick', function(){


//  var buttonClickSuccessSpy;
//  var chai = require('./chai');
// var expect = chai.expect;


/*
  beforeEach(function(){
    buttonClickSuccessSpy = sinon.spy();

//    $(document).on('buttonClickSucess', buttonClickSuccessSpy);
$(".successButton").on('shabbadabbadoobah', function(){console.log('yash')});


  });



*/

// it('should stub a method', function(){
//   console.log(Test.do("thing"));
//
//   sinon.stub(Test, "do", function(){return "yes"})
//   console.log(Test.do("thing"));





  Test.do("thing").should.equal("no")

  sinon.stub(Test, "do", function(){return "yes"})
  Test.do("thing").should.equal("yes")
  //
  // Test.do.restore()
  // Test.do("thing").should.equal("no")
})


/*

  it('should fire a buttonClickSuccess event with correct data', function(){

  //$(".successButton").click();
$(".successButton").trigger('shabbadabbadoobah');

  //make sure our spy was fired once and only once
  expect(buttonClickSuccessSpy.callCount).to.equal(1);

  //get the data from our spy call
  var spyCall = buttonClickSuccessSpy.getCall(0);

  //make sure 'foo' on the data argument is set to 'bar'

  expect(spyCall.args[1].foo).to.equal('bar');
});

*/

afterEach(function(){
//  $(document).off('buttonClickSuccess');
});
