
  var fs          = require('fs'),
      path        = require('path'),
      request     = require('request'),
      cheerio     = require('cheerio'),
      Parser      = require('microformat-node').Parser,
      parser      = new Parser();

      urls = ['http://localhost:8888/h-adr.html',
              'http://localhost:8888/h-card.html',
              'http://localhost:8888/h-event.html',
              'http://localhost:8888/h-entry.html',
              'http://localhost:8888/h-geo.html',
              'http://localhost:8888/h-news.html',
              'http://localhost:8888/h-org.html',
              'http://localhost:8888/h-product.html',
              'http://localhost:8888/h-recipe.html',
              'http://localhost:8888/h-resume.html',
              'http://localhost:8888/h-review-aggregate.html',
              'http://localhost:8888/h-review.html',
              'http://localhost:8888/rel.html',
              'http://localhost:8888/includes.html',

              'http://localhost:8888/adr.html',
              'http://localhost:8888/geo.html',
              'http://localhost:8888/hcalendar.html',
              'http://localhost:8888/hcard.html',
              'http://localhost:8888/hnews.html',
              'http://localhost:8888/hproduct.html',
              'http://localhost:8888/hentry.html',
              'http://localhost:8888/hresume.html',
              'http://localhost:8888/hreview-aggregate.html',
              'http://localhost:8888/hreview.html',
              'http://localhost:8888/mixed-versions.html']


  function updateTests(){

    var i  = urls.length,
    x   = 0;
    while (x < i) {
      var testUrl = urls[x];

       function writeTest(testUrl) {
          var url = testUrl;

          getTextFromRepo(url, function(err, html){
            if(html){
                var parts = url.split('/'),
                  fileName = parts[parts.length-1],
                  json = parseTestFixtures(html, url),
                  date = new Date().toString()
                  out = '/*\r\nMocha integration test from: ' + fileName + '\r\nThe test was built on ' + date + '\r\n*/\r\n\r\n';

                out += "var assert = chai.assert;\r\n\r\n\r\n" 
                var tests = getTests(json);
                out += tests;        

                // write the test file for node and the browser
                //var filePath1 = '../test/' + fileName.replace('.html','-test.js');
                var filePath = '../mocha-tests/' + fileName.replace('.html','-test.js');
                console.log(filePath)
                writeFile(path.resolve(__dirname, filePath), out);
                
              }else{
                console.log(err)
            }
          });

        }
        writeTest(testUrl);

  
        x++;
    }

  }


  function getTextFromRepo(url, callback){
    request({uri: url}, function(requestErrors, response, body){
      if(!requestErrors && response.statusCode === 200){
          callback(null, body)
        }else{
          callback(requestErrors, null)
      }  
    });
  }


  function parseTestFixtures(html, url){
    var dom, rootNode, options;
    options = {
      baseUrl: url,
      filters: ['h-x-test-fixture'],
      includes: false
    }
    dom = cheerio.load(html);
    rootNode = dom.root();

    return parser.get(dom, rootNode, options).data;
  }


  function parseFragment(htmlFragment){
    var dom, rootNode, options;
    options = {
      baseUrl: 'http://example.com/'
    }
    dom = cheerio.load(html);
    rootNode = dom.root();

    return parser.get(dom, rootNode, options).data;
  }


  function writeFile(path, content){
    fs.writeFile(path, content, 'utf8', function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log('The file: ' + path + ' was saved');
      }
    }); 
  }


  function getTests(json){
      var out = []
      // While loop
      var i = json.items.length;
      var x = 0;
      while (x < i) {
          out.push(getTest(json.items[x]))
          x++;
      }
      return out.join('');
  }


  function getTest(testFixture){
      var out = '';
      if(testFixture && testFixture.properties){
        var p = testFixture.properties
        console.log('writing test: ' + p.name)

        if(p['x-output'] && p['x-microformat']){
          var json = p['x-output'][0];
          var html = p['x-microformat'][0];
          var expected = JSON.parse( json );

          var out = "describe('" + p.name  + "', function() {\r\n"
          out += "   var htmlFragment = " + JSON.stringify(html) + "\r\n";
          out += "   var found = helper.parseHTML(htmlFragment,'http://example.com/')\r\n";
          out += "   var expected = " + JSON.stringify(expected) + "\r\n\r\n"

          out += getAssertsForRootUF(expected.items[0], 'found.items[0]') + "})\r\n\r\n\r\n\r\n\r\n";
        }
      }else{
        console.log('test-fixture is empty')
      }
      return out;
  }



  function getAssertsForRootUF(expected, path){
    var out = '';

    if(expected){

      if(expected.value){
        out += getAssertsStr(expected.value, path + '.value');
      } 

      if(expected.type){
        out += getAssertsArr(expected.type, path + '.type');
      }

      if(expected.properties){
        out += getAssertsObj(expected.properties, path + '.properties');
      }
    }

    if(expected.children){

      if(expected.children.value){
        out += getAssertsStr(expected.children[0].value, path + '.children[0].value');
      }

      if(expected.children.type){
        out += getAssertsArr(expected.children[0].type, path + '.children[0].type');
      }

      if(expected.children.properties){
        out += getAssertsObj(expected.children[0].properties, path + '.children[0].properties');
      }
    }

    return out;
  }



  // creates all the asserts for an object of properties
  function getAssertsObj(properties, path){
    var out = '';
    for (var key in properties) {
       var  arr = properties[key]
            i  = arr.length,
            x   = 0;
        while (x < i) {
          // if item has an array of string i.e. is not an embedded microformat
          if(isString(arr[x])){
            var pathRef = path.replace(/"/g, "'") + "['" + key + "'][" + x + "]";
            var assert =  '   it("' + pathRef + '", function(){\r\n' +
                          '      assert.equal(' + path + '["' + key + '"][' +  x  + '].toString(), "' + escapeText(arr[x]) + '");\r\n' +
                          '   })\r\n'
              out += assert + '\r\n';
          }else{
            // if its an embeded microformat 
            out +=  getAssertsForRootUF(arr[x], path + '["' + key + '"][' +  x  + ']');
          }
          x++;
        }
    }
    return out;
  }


  // creates all the asserts for an array
  function getAssertsArr(arr, path){
    var out = '',
        i   = arr.length,
        x   = 0;

        while (x < i) {
            var pathRef = path.replace(/"/g, "'") + "[" + x + "]";
            var assert =  '   it("' + pathRef + '", function(){\r\n' +
                          '      assert.equal(' + path + '[' +  x  + '].toString(), "' + escapeText(arr[x]) + '");\r\n' +
                          '   })\r\n'
              out += assert + '\r\n';
          x++;
        }
    return out;
  }


  // creates an assert for a string
  function getAssertsStr(str, path){
    var out = '';
        
    var pathRef = path.replace(/"/g, "'");
    var assert =  '   it("' + pathRef + '", function(){\r\n' +
                  '      assert.equal(' + path + ', "' + escapeText(str) + '");\r\n' +
                  '   })\r\n'
      out += assert + '\r\n';
  
    return out;
  }



  // replaces quotes and return chars to escape string for javascript
  function escapeText(str){
      var out = JSON.stringify(str);
      return out.substr(1,out.length-2);
  }



  function isString(obj) {
      return typeof (obj) == 'string';
  };

  exports.updateTests = updateTests;
