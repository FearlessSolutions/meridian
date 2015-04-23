var kmltogeojsonExt =  require('../../../server/extensions/kmltogeojson/main'),
expect = require('chai').expect;

describe("KML To GeoJSON Test Suite", function() {

    var kmlString;

    before(function(done){
        kmlString = require('fs').readFileSync('time-stamp-point.kml', 'utf8');
        done();
    });

    it("should convert kml to geojson", function(done) {
        kmltogeojsonExt.convertKmlToGeoJSON(kmlString, function(err, resp){
            expect(err).to.be.not.ok;
            expect(resp.features.length).to.equal(361);
            done();
        });
    });
});
