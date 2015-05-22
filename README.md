## Microformats test suite
This group of tests was built to test microformats parsers. The individual tests are files containing fragments of HTML.  There is also a second a corresponding JSON file, which contains the expected output. 

The tests are broken into sets within the tests directory of this project. They are first grouped by version. Some parsers only support a single version of microformats. They are then subdivided by the type of microformat i.e. h-card.

### NPM
The test have been added to npm (Node Package Manager) and the latest version can be add to a project using the following command:

    npm i microformats-tests --save

###License
All content and code in this repo is released into the [public domain](http://en.wikipedia.org/wiki/public_domain).

