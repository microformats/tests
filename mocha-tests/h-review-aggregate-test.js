/*
Mocha integration test from: h-review-aggregate.html
The test was built on Tue Jan 15 2013 14:11:31 GMT+0000 (GMT)
*/

var assert = chai.assert;


describe('Minimum properties (h-review-aggregate parsing test)', function() {
   var htmlFragment = "\n<div class=\"h-review-aggregate\">\n    <h3 class=\"p-item h-item\">Mediterranean Wraps</h3>\n     <span class=\"p-summary\">\n        Customers flock to this small restaurant for their \n        tasty falafel and shawerma wraps and welcoming staff.\n    </span>\n    <span class=\"p-rating\">4.5</span> out of 5 \n</div>   \n"
   var found = helper.parseHTML(htmlFragment,'http://example.com/')
   var expected = {"items":[{"type":["h-review-aggregate"],"properties":{"item":[{"value":"Mediterranean Wraps","type":["h-item"],"properties":{"name":["Mediterranean Wraps"]}}],"summary":["Customers flock to this small restaurant for their tasty falafel and shawerma wraps and welcoming staff."],"rating":["4.5"],"name":["Mediterranean Wraps Customers flock to this small restaurant for their tasty falafel and shawerma wraps and welcoming staff. 4.5 out of 5"]}}]}

   it("found.items[0].type[0]", function(){
      assert.equal(found.items[0].type[0].toString(), "h-review-aggregate");
   })

   it("found.items[0].properties['item'][0].value", function(){
      assert.equal(found.items[0].properties["item"][0].value, "Mediterranean Wraps");
   })

   it("found.items[0].properties['item'][0].type[0]", function(){
      assert.equal(found.items[0].properties["item"][0].type[0].toString(), "h-item");
   })

   it("found.items[0].properties['item'][0].properties['name'][0]", function(){
      assert.equal(found.items[0].properties["item"][0].properties["name"][0].toString(), "Mediterranean Wraps");
   })

   it("found.items[0].properties['summary'][0]", function(){
      assert.equal(found.items[0].properties["summary"][0].toString(), "Customers flock to this small restaurant for their tasty falafel and shawerma wraps and welcoming staff.");
   })

   it("found.items[0].properties['rating'][0]", function(){
      assert.equal(found.items[0].properties["rating"][0].toString(), "4.5");
   })

   it("found.items[0].properties['name'][0]", function(){
      assert.equal(found.items[0].properties["name"][0].toString(), "Mediterranean Wraps Customers flock to this small restaurant for their tasty falafel and shawerma wraps and welcoming staff. 4.5 out of 5");
   })

})




describe('Broken into properties (h-review-aggregate parsing test)', function() {
   var htmlFragment = "\n<div class=\"hreview-aggregate\">\n    <div class=\"item vcard\">\n        <h3 class=\"p-name\">Mediterranean Wraps</h3>\n        <p>\n            <span class=\"p-street-address\">433 S California Ave</span>, \n            <span class=\"p-locality\">Palo Alto</span>, \n            <span class=\"p-region\">CA</span> - \n            <span class=\"p-tel\">(650) 321-8189</span>\n        </p>\n    </div> \n    <span class=\"p-summary\">Customers flock to this small restaurant for their \n    tasty falafel and shawerma wraps and welcoming staff.</span>\n    <span class=\"p-rating h-rating\">\n        <span class=\"p-average\">9.2</span> out of \n        <span class=\"p-best\">10</span> \n        based on <span class=\"p-count\">17</span> reviews\n    </span>\n</div>\n"
   var found = helper.parseHTML(htmlFragment,'http://example.com/')
   var expected = {"items":[{"type":["h-review-aggregate"],"properties":{"item":[{"value":"Mediterranean Wraps 433 S California Ave, Palo Alto, CA - (650) 321-8189","type":["h-card"],"properties":{"name":["Mediterranean Wraps"],"street-address":["433 S California Ave"],"locality":["Palo Alto"],"region":["CA"],"tel":["(650) 321-8189"]}}],"summary":["Customers flock to this small restaurant for their tasty falafel and shawerma wraps and welcoming staff."],"rating":[{"value":"9.2 out of 10 based on 17 reviews","type":["h-rating"],"properties":{"average":["9.2"],"best":["10"],"count":["17"],"name":["9.2 out of 10 based on 17 reviews"]}}],"name":["Mediterranean Wraps 433 S California Ave, Palo Alto, CA - (650) 321-8189 Customers flock to this small restaurant for their tasty falafel and shawerma wraps and welcoming staff. 9.2 out of 10 based on 17 reviews"]}}]}

   it("found.items[0].type[0]", function(){
      assert.equal(found.items[0].type[0].toString(), "h-review-aggregate");
   })

   it("found.items[0].properties['item'][0].value", function(){
      assert.equal(found.items[0].properties["item"][0].value, "Mediterranean Wraps 433 S California Ave, Palo Alto, CA - (650) 321-8189");
   })

   it("found.items[0].properties['item'][0].type[0]", function(){
      assert.equal(found.items[0].properties["item"][0].type[0].toString(), "h-card");
   })

   it("found.items[0].properties['item'][0].properties['name'][0]", function(){
      assert.equal(found.items[0].properties["item"][0].properties["name"][0].toString(), "Mediterranean Wraps");
   })

   it("found.items[0].properties['item'][0].properties['street-address'][0]", function(){
      assert.equal(found.items[0].properties["item"][0].properties["street-address"][0].toString(), "433 S California Ave");
   })

   it("found.items[0].properties['item'][0].properties['locality'][0]", function(){
      assert.equal(found.items[0].properties["item"][0].properties["locality"][0].toString(), "Palo Alto");
   })

   it("found.items[0].properties['item'][0].properties['region'][0]", function(){
      assert.equal(found.items[0].properties["item"][0].properties["region"][0].toString(), "CA");
   })

   it("found.items[0].properties['item'][0].properties['tel'][0]", function(){
      assert.equal(found.items[0].properties["item"][0].properties["tel"][0].toString(), "(650) 321-8189");
   })

   it("found.items[0].properties['summary'][0]", function(){
      assert.equal(found.items[0].properties["summary"][0].toString(), "Customers flock to this small restaurant for their tasty falafel and shawerma wraps and welcoming staff.");
   })

   it("found.items[0].properties['rating'][0].value", function(){
      assert.equal(found.items[0].properties["rating"][0].value, "9.2 out of 10 based on 17 reviews");
   })

   it("found.items[0].properties['rating'][0].type[0]", function(){
      assert.equal(found.items[0].properties["rating"][0].type[0].toString(), "h-rating");
   })

   it("found.items[0].properties['rating'][0].properties['average'][0]", function(){
      assert.equal(found.items[0].properties["rating"][0].properties["average"][0].toString(), "9.2");
   })

   it("found.items[0].properties['rating'][0].properties['best'][0]", function(){
      assert.equal(found.items[0].properties["rating"][0].properties["best"][0].toString(), "10");
   })

   it("found.items[0].properties['rating'][0].properties['count'][0]", function(){
      assert.equal(found.items[0].properties["rating"][0].properties["count"][0].toString(), "17");
   })

   it("found.items[0].properties['rating'][0].properties['name'][0]", function(){
      assert.equal(found.items[0].properties["rating"][0].properties["name"][0].toString(), "9.2 out of 10 based on 17 reviews");
   })

   it("found.items[0].properties['name'][0]", function(){
      assert.equal(found.items[0].properties["name"][0].toString(), "Mediterranean Wraps 433 S California Ave, Palo Alto, CA - (650) 321-8189 Customers flock to this small restaurant for their tasty falafel and shawerma wraps and welcoming staff. 9.2 out of 10 based on 17 reviews");
   })

})




