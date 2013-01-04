# hparse-js

`hparse` is a [Microformats 2](http://microformats.org/wiki/microformats2) DOM parser written in JavaScript.

It natively supports the new prefix-based parsing rules of µf2, and provides a mechanism to
important old, known µf1 vocabularies and parse them according to the rules of µf2.

## Supported Parser Features

Struckthrough items are not implemented yet.

* Microformats v2 parsing rules
* Microformats v2 singleton objects
* HTML5 `pubdate` as `dtpublished` mapping
* HTML5 `time` element
* HTML5 `data` element
* Date-Time Pattern
* Separated Date-Time Pattern
* Value-Title Pattern
* Parsing of image `alt` text
* Markdown conversion for plain-text values.
* <del>Include Pattern</del>
* <del>Include Pattern via Microdata `itemref`</del>
* <del>Support for HTML tables</del>

## Requirements

* `hparse` requires a Browser-DOM compatible object `Node`, `DOMElement`, etc, but
given that should function in both Browser and standalone environments.
* `hparse` requires a number of ECMAScript 5 features (`[].forEach`, `Object.keys`, `[].map`, `Node.nodeType` enumeration) so will not function in Internet Explorer without also include an appropriate polyfill.
* `hparse` does not require any additional JavaScript framework.

## Usage

### Instance Methods

#### `new HParse(node)`

Create a new instance of the parser.

#### `HParse.parse()`

Run the parser against the condifured node. Returns `Results`.

#### `Results.getAllObjects()`

Returns all microformats parsed from the tree.

#### `Results.getStandaloneObjects()`

Returns only those microformats that standalone, and are not also a property value for a parent microformat. e.g. An element with root `h-event` would be returned, but the object for `h-card p-organizer` contained within would not.

#### `Results.getObjectById(id)`

Get a parsed microformat object by its `id` from the original document.

#### `Results.getObjectsByMicroformat(type, includeSubProperties)`

Returns all microforamts with a matching type (e.g. `h-card`, `h-event`). Pass `true` to also include microformats that are property values in other microformat objects.

### Static Functions

#### `HParse.parse(node)`

Shorthand to instantiate a parser and return all standalone microformats from an object tree; returns `Results`.

#### `HParse.defineLegacyVocabulary`

Add a legacy microformat vocabulary to HParse to parse old, unprefixed microformats as if they were using the new syntax. See `src/vocabularies` for example mapping files.

#### `HParse.settings(opts)`

Returns the current global parser settings. Change them by passing in an object with alternate values.

#### Others

There are some other publicly exposed parsing and text converstion methods that are presently undocumented since they might change.

### Settings

Global setting names, functions, show here with default values. To change a setting, use `HParse.settings({ settingOne: true, settingTwo: false });`. Settings are all boolean.

#### Parser Behvaiour Settings

* `parseSingletonRootNodes`: `true`. Enable parsing of  `<a class=h-card ...><img src=#photo alt="Ben Ward"></a>` as a full microformat with `name`, `url` and `photo` properties.
* `parsePubDateAttr`: `true`. Enable parsing of the HTML `<time>` element `pubdate` attribute as `.dt-published`.
* `parseRelAttr`: `true`: Enable parsing of `rel` attributes to the `relationships` collection.
* `parseItemRefAttr`: `true`. Enable use of microdata's `itemref` attribute as per the include-pattern. Not implemented yet.
* `parseV1Microformats`: `false`. Enable parsing of legacy syntax microformats as per microformats-2. Requires adding individual vocabularies with `HParse.defineLegacyVocabulary`.

#### Property Validation Settings

* `forceValidUrls`: `true`. Filters `u-` URL property values for valid URLs only.
* `forceValidDates`: `true`. Filtes `dt-` date time property values for valid ISO8610 dates only.

#### Text Output Settings

* `expandPlainTextUrls`: `true`. When converting an `<a>` element to plain text in property output, include the URL in parantheses.
* `markdownPlainTextUrls`: `false`. When `expandPlainTextUrls` is `true`, output URLs in plaintext using [Markdown](http://daringfireball.net/projects/markdown/) syntax, `[Text](http://example.com "Title")`.
* `expandPlainTextAbbreviations`: `false`. When converting an `<abbr>` to plain text, append the `title` expansion in parantheses.
* `markdownPlainTextPhrases`: `true`. When converting `<b>`, `<i>`, `<strong>`, `<em>` and `<code>` phrases to plaintext, wrap in markdown syntax.
* `markdownPlainTextImages`: `false`. When converting inline images to text, using [Markdown](http://daringfireball.net/projects/markdown/) syntax, `![Alt Text](http://example.com/foo.jpg "Title")` instead of the raw `alt` text.

