var expect = require('chai').expect;
var uuid = require('node-uuid');

/**
 * Note:
 *
 * This is an integration test and should not be run as part of unit tests
 * or the browser tests. Run it individually with a vanilla elastic search
 * instance sitting on your local machine
 */
describe("Elastic Search Integration Test Suite", function(){

    var config,
        save,
        query,
        metadataManager,
        testResultId = 'A7478FB8AB254F608335D1D2F6DE960F',
        testQueryId;

    before(function(done){
        config = require('../../../server/extensions/config/Config').setProfile("local-test").getConfig();

        require('../../../server/app').init({
            get:function(){},
            post:function(){},
            all:function(){},
            delete:function(){}
        });

        save = require('../../../server/extensions/elastic/save');
        query = require('../../../server/extensions/elastic/query');
        metadataManager = require('../../../server/extensions/elastic/metadata');

        // Only required the first time for the mapping
        // It would be better to properly do callbacks within the mapping function
        setTimeout(function(){
            var testUsers = [{'user':'testUser1', 'sessionId':'A7478FB8AB254F608335D1D2F6DE960F'},
                {'user':'testUser1', 'sessionId':'B7478FB8AB254F608335D1D2F6DE960F'},
                {'user':'testUser2', 'sessionId':'8DEFBAC7337475D67E6F76E76C76'},
                {'user':'testUser3', 'sessionId':'ABC6D7EFC7A6D6EF7C7EA7D7F'}];


            testUsers.forEach(function(user){

                var geoJSON = [];
                for (var i = 0; i < 5; i++){
                    geoJSON.push({
                        "type":"Feature",
                        "geometry": {
                            "type":"Point",
                            "coordinates":[7.100585,-0.326696]
                        },
                        "properties":{
                            "num":0.100585 + i,
                            "heading":5,
                            "dest":"CLASS" + (i % 2 === 0 ? "A" : "B")
                        }
                    });
                }

                save.writeGeoJSON(user.user, user.sessionId, user.sessionId, "test", geoJSON, function(err){
                    if (err) console.log(err);
                });
            });
            return done(null);
        }, 500);
    });

    it("should be able to connect to the elastic search instance", function(){
        var client = require('../../../server/extensions/elastic/client').newClient(config.client);
        expect(client).to.be.ok;
        client.ping({
            requestTimeout: 1000,
            hello: "elasticsearch!"
        }, function (error) {
            expect(error).to.be.not.ok;
        });
    });

    it("should save a result set", function(done){
        var geoJSON = [];
        for (var i = 0; i < 5; i++){
            geoJSON.push({
                "type":"Feature",
                "geometry": {
                    "type":"Point",
                    "coordinates":[7.100585,-0.326696]
                },
                "properties":{
                    "lon":7 + i,
                    "heading":10*i + (10-i),
                    "dest":"CLASS" + (i % 2 === 0 ? "A" : "B")
                }
            });
        }

//        testResultId = uuid.v4().split("-").join("");
        testQueryId = uuid.v4().split("-").join("");
        save.writeGeoJSON("testUser1", testResultId, testQueryId, "test", geoJSON, function(err){
            if (err) console.log(err);
            expect(err).to.be.not.ok;
        });

        setTimeout(done, 1500);
    });

    it("should be able to retrieve a result set (session)", function(done){
        query.executeQuery('testUser1', testResultId, {query:{"match_all":{}}}, function(err, results){
            expect(err).to.be.not.ok;
            expect(results.hits.hits.length).to.equal(10);
            done();
        });
    });

    it("should be able to retrieve a result set (queryId)", function(done){
        query.getResultsByQueryId('testUser1', testResultId, testResultId, 0, 10, function(err, results){
            expect(err).to.be.not.ok;
            expect(results.length).to.equal(5);
            done();
        });
    });

    it("should be able to retrieve a result set (queryId -- test 2)", function(done){
        query.getResultsByQueryId('testUser3', 'ABC6D7EFC7A6D6EF7C7EA7D7F',
            'ABC6D7EFC7A6D6EF7C7EA7D7F', 0, 10, function(err, results){
            expect(err).to.be.not.ok;
            expect(results.length).to.equal(5);
            done();
        });
    });

    it("should be able to retrieve a result set (queryId -- test invalid)", function(done){
        query.getResultsByQueryId('testUser3', 'ABC6D7EFC7A6D6EF7C7EA7D7F',
            'foo', 0, 10, function(err, results){
                expect(err).to.be.not.ok;
                expect(results.length).to.equal(0);
                done();
            });
    });

    it("should be able to query a result set (session) for a key/value pair", function(done){
        query.executeQuery('testUser1', testResultId, {query:{"match":{"lon":8}}}, function(err, results){
            expect(err).to.be.not.ok;
            expect(results.hits.hits.length).to.equal(1);
            done();
        });
    });

    it("should be able to page a result set (session)", function(done){
        var count = 0;

        query.streamQuery('testUser1', testResultId, {query:{"match_all":{}}}, 2, function(err, results){
            expect(err).to.be.not.ok;
            count += results.hits.hits.length;
            if (results.hits.hits.length === 0){
                expect(count).to.equal(10);
                done();
            }
        });
    });

    it("should be able to search for an arbitrary term within a result set (session)", function(done){
        query.executeQuery('testUser1', testResultId, {query:{"match":{"_all":"CLASSA"}}}, function(err, results){
            expect(err).to.be.not.ok;
            expect(results.hits.hits.length).to.equal(6);
            done();
        });
    });

    it("should be able to sort a result set (session)", function(done){
        var myQuery = {query: {"match_all": {}}, sort: {"properties.heading": "desc"}};
        query.executeQuery('testUser1', testResultId, myQuery, function(err, results){
            expect(err).to.be.not.ok;
            expect(results.hits.hits.length).to.equal(10);
            expect(results.hits.hits[0]._source.properties.heading).to.equal(46);
            expect(results.hits.hits[1]._source.properties.heading).to.equal(37);
            expect(results.hits.hits[2]._source.properties.heading).to.equal(28);
            expect(results.hits.hits[3]._source.properties.heading).to.equal(19);
            expect(results.hits.hits[4]._source.properties.heading).to.equal(10);
            done();
        });
    });

    it("should have the correct record count in a query's metadata", function(done){
        metadataManager.getMetadataByQueryId('testUser1', testQueryId, function(err, meta){
            expect(err).to.be.not.ok;
            expect(meta.getNumRecords()).to.equal(5);
            done();
        });
    });

    it("should have the correct keyset in a query's metadata", function(done){
        metadataManager.getMetadataByQueryId('testUser1', testQueryId, function(err, meta){
            expect(err).to.be.not.ok;
            expect(meta.getKeys().lon).to.be.defined;
            expect(meta.getKeys().heading).to.be.defined;
            expect(meta.getKeys().dest).to.be.defined;
            expect(meta.getKeys().featureId).to.be.defined;
            expect(meta.getKeys().queryId).to.be.defined;
            done();
        });
    });

    it("should be able to fetch metadata by session id", function(done){
        metadataManager.getMetadataBySessionId('testUser1', testResultId, function(err, meta){
            expect(err).to.be.not.ok;
            expect(meta[testQueryId]).to.be.defined;
            expect(meta[testQueryId].getKeys().lon).to.be.defined;
            expect(meta['A7478FB8AB254F608335D1D2F6DE960F']).to.be.defined;
            expect(meta['A7478FB8AB254F608335D1D2F6DE960F'].getKeys().num).to.be.defined;
            done();
        });
    });

    it("should be able to fetch metadata by user id", function(done){
        metadataManager.getMetadataByUserId('testUser1', function(err, meta){
            expect(err).to.be.not.ok;
            expect(meta[testQueryId]).to.be.defined;
            expect(meta[testQueryId].getKeys().lon).to.be.defined;
            expect(meta['A7478FB8AB254F608335D1D2F6DE960F']).to.be.defined;
            expect(meta['A7478FB8AB254F608335D1D2F6DE960F'].getKeys().num).to.be.defined;
            expect(meta['B7478FB8AB254F608335D1D2F6DE960F']).to.be.defined;
            expect(meta['B7478FB8AB254F608335D1D2F6DE960F'].getKeys().num).to.be.defined;
            done();
        });
    });

    it("should return no metadata by session id if the session doesn't belong to the user", function(done){
        metadataManager.getMetadataBySessionId('testUser2', testResultId, function(err, meta){
            expect(err).to.be.not.ok;
            expect(meta[testQueryId]).to.not.be.ok;
            expect(meta['A7478FB8AB254F608335D1D2F6DE960F']).to.not.be.ok;
            done();
        });
    });

    it("should fail to fetch metadata by query id if the query doesn't belong to the user", function(done){
        metadataManager.getMetadataByQueryId('testUser2', testQueryId, function(err, meta){
            expect(err).to.be.ok;
            expect(meta).to.be.not.ok;
            done();
        });
    });

    it("should be able to trigger a CSV download without error", function(done){
        var mockRes = {
            buffer: "",
            headers: {},
            status: function(status){
                expect(status).to.equal(200);
            },
            write: function(chunk){
                this.buffer += chunk;
            },
            end: function(chunk){
                this.buffer += chunk;
                expect(this.buffer.length).to.equal(1287);
//                expect(this.buffer.length).to.equal(1045); changed due to LAT/LON being added
                expect(this.headers['Content-Type']).to.be.defined;
                expect(this.headers['Content-Disposition']).to.be.defined;
                done();
            },
            header: function(header, value){
                this.headers[header] = value;
            }
        };

        require('../../../server/extensions/elastic/download').pipeCSVToResponse('testUser1', testResultId, mockRes);
    });
});