## Microformats test suite


This test suite was built to test microformats parsers. The tests are marked up in web pages and are human readable and then converted into JavaScript mocha.js test. The test are broken into two sets: 


### Version 2 test 
* [h-adr](http://microformat2-node.jit.su/h-adr.html) 
* [h-card](http://microformat2-node.jit.su/h-card.html) 
* [h-entry](http://microformat2-node.jit.su/h-entry.html) 
* [h-event](http://microformat2-node.jit.su/h-event.html) 
* [h-geo](http://microformat2-node.jit.su/h-geo.html) 
* [h-news](http://microformat2-node.jit.su/h-news.html) 
* [h-org](http://microformat2-node.jit.su/h-org.html) 
* [h-product](http://microformat2-node.jit.su/h-product.html) 
* [h-recipe](http://microformat2-node.jit.su/h-recipe.html) 
* [h-resume](http://microformat2-node.jit.su/h-resume.html) 
* [h-review-aggregate](http://microformat2-node.jit.su/h-review-aggregate.html) 
* [h-review](http://microformat2-node.jit.su/h-review.html) 
* [rel=*](http://microformat2-node.jit.su/rel.html) 
* [url](http://microformat2-node.jit.su/url.html) 
* [include patterns](http://microformat2-node.jit.su/includes.html) 



### Version 1 test (backwards compatibility tests) 
* [mixed-versions](http://microformat2-node.jit.su/mixed-versions.html) 
* [adr](http://microformat2-node.jit.su/adr.html)
* [geo](http://microformat2-node.jit.su/geo.html)
* [hcalendar](http://microformat2-node.jit.su/hcalendars.html)
* [hcard](http://microformat2-node.jit.su/hcard.html)
* [hentry](http://microformat2-node.jit.su/hentry.html)
* [hnews](http://microformat2-node.jit.su/hnews.html)
* [hproduct](http://microformat2-node.jit.su/hproduct.html)
* [hrecipe](http://microformat2-node.jit.su/hrecipe.html)
* [hresume](http://microformat2-node.jit.su/hresume.html)
* [hreview-aggregate](http://microformat2-node.jit.su/hreview-aggregate.html)
* [hreview](http://microformat2-node.jit.su/hreview.html)

(last update on 7 Feb 2013)


### Using the test suite

You can test a browser compatibility by building a simple a simple helper.js wrapper a web API and recreating the two test html documents.

### Current parsers using the suite
[microformat-node](http://microformat2-node.jit.su/) - [v1 test](http://microformat2-node.jit.su/mocha-v1.html) and [v2 test](http://microformat2-node.jit.su/mocha-v2.html)

### Server tool for creating *-test.js files
The project contains a node.js app that can convert the html mark-up into the mocha.js test files. You need to setup simple a node.js server. You will need to install node.js and nmp. At the command line for the downloaded directory for this project excute the following:

    npm install 

then start the server with the command:

	node bin/tests

within a browser you should now be able to view the test html pages:

	http://localhost:8888/h-card.html	

finally call the web page to recreate the *.test.js files, by view the web address:

	http://localhost:8888/update/



###License
All content and code in this repo is released into the [public domain](http://en.wikipedia.org/wiki/public_domain).

