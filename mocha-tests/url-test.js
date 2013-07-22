/*
Mocha integration test from: url.html
The test was built on Mon Jul 22 2013 14:08:50 GMT+0100 (BST)
*/

var assert = chai.assert;


describe('Expanding URLs in u-* properties (h-entry parsing test)', function() {
   var htmlFragment = "\n<div class=\"h-entry\">\n    <h1><a class=\"p-name u-url\" href=\"http://example.org\">http://example.org</a></h1>\n    <div class=\"e-content\">\n        <ul>\n            <li><a href=\"http://www.w3.org/\">Should not change: http://www.w3.org/</a></li>\n            <li><a href=\"http://example.org/\">Should not change: http://example.org/</a></li>\n            <li><a href=\"test.html\">File relative: test.html = http://example.org/test.html</a></li>\n            <li><a href=\"/test/test.html\">Directory relative: /test/test.html = http://example.org/test/test.html</a></li>\n            <li><a href=\"./test.html\">Relative to root: ./test.html = http://example.org/test.html</a></li>\n            <li><img src=\"http://www.w3.org/2008/site/images/logo-w3c-mobile-lg\"></li>\n            <li><img src=\"/images/test.gif\"></li>\n        </ul>\n    </div>  \n</div>\n"
   var found = helper.parseHTML(htmlFragment,'http://example.com/')
   var expected = {"items":[{"type":["h-entry"],"properties":{"name":["http://example.org"],"url":["http://example.org"],"content":["\n        <ul>\n            <li><a href=\"http://www.w3.org/\">Should not change: http://www.w3.org/</a></li>\n            <li><a href=\"http://example.org/\">Should not change: http://example.org/</a></li>\n            <li><a href=\"http://example.org/test.html\">File relative: test.html = http://example.org/test.html</a></li>\n            <li><a href=\"http://example.org/test/test.html\">Directory relative: /test/test.html = http://example.org/test/test.html</a></li>\n            <li><a href=\"http://example.org/test.html\">Relative to root: ./test.html = http://example.org/test.html</a></li>\n            <li><img src=\"http://www.w3.org/2008/site/images/logo-w3c-mobile-lg\"></li>\n            <li><img src=\"http://example.org/images/test.gif\"></li>\n        </ul>\n    "]}}]}

   it("found.items[0].type[0]", function(){
      assert.equal(found.items[0].type[0].toString(), "h-entry");
   })

   it("found.items[0].properties['name'][0]", function(){
      assert.equal(found.items[0].properties["name"][0].toString(), "http://example.org");
   })

   it("found.items[0].properties['url'][0]", function(){
      assert.equal(found.items[0].properties["url"][0].toString(), "http://example.org");
   })

   it("found.items[0].properties['content'][0]", function(){
      assert.equal(found.items[0].properties["content"][0].toString(), "\n        <ul>\n            <li><a href=\"http://www.w3.org/\">Should not change: http://www.w3.org/</a></li>\n            <li><a href=\"http://example.org/\">Should not change: http://example.org/</a></li>\n            <li><a href=\"http://example.org/test.html\">File relative: test.html = http://example.org/test.html</a></li>\n            <li><a href=\"http://example.org/test/test.html\">Directory relative: /test/test.html = http://example.org/test/test.html</a></li>\n            <li><a href=\"http://example.org/test.html\">Relative to root: ./test.html = http://example.org/test.html</a></li>\n            <li><img src=\"http://www.w3.org/2008/site/images/logo-w3c-mobile-lg\"></li>\n            <li><img src=\"http://example.org/images/test.gif\"></li>\n        </ul>\n    ");
   })

})




