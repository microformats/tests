/** h-parse
A microformats-2 DOM parser
Also supports mapping of µf1 vocabularies to µf2 parsing rules

MIT License
(c) Ben Ward, 2012
*/

(function (exports) {

  exports = exports || {};

  var version = 'v0.0.1';
  var regexen = {
    OBJECT: /\b(h\-[\w\-]+)\b/g,
    PROPERTY: /\b(p|u|dt|e)-([\w\-]+)\b/g,
    VALUE: /\bvalue\b/g,
    VALUETITLE: /\bvalue\-title\b/g,
    URL: /\b(?:(?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\((?:[^\s()<>]+|(\(?:[^\s()<>]+\)))*\))+(?:\((?:[^\s()<>]+|(?:\(?:[^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i,
    // URL regex by John Gruber:
    //   http://daringfireball.net/2010/07/improved_regex_for_matching_urls
    // via JavaScript port by Alan Moore on Stack Overflow:
    //   http://stackoverflow.com/a/4929179
  };
  regexen.ISODATE = /\d{4}\-?((\d{2}\-?(\d{2})?|\d{3})?)?/g,
  //                YEAR     MONTH    DATE OR DOY
  regexen.ISOTIME = /\d{2}\:?(\d{2}\:?(\d{2}\:?(\d{2})?)?)?/g,
  //                HOUR     MIN      SEC      MS
  regexen.ISOTZ = /([\+\-]\d{2}\:?\d{2}|Z)/g,
  //              TIMEZONE
  regexen.ISOFULL = new RegExp(['^',
    regexen.ISODATE.source, '(T',
    regexen.ISOTIME.source, '(',
    regexen.ISOTZ.source, ')?)?$'].join(''));
  // A regex that matches the pattern of an ISO 8610 date. Note that it
  // does not attempt to validate it as a real date.
  // Should accept anything from "2011" to "2011-10-10T01:34:00:00-0800"
  // Should also accept dates on tantek.com: e.g. 2010-245.

  var settings = {
    // Options affecting the parser:
    parseSingletonRootNodes: true, // parse <a class=h-card ...><img src=#photo alt="Ben Ward"></a> as full hcard.
    parsePubDateAttr: true, // parse time/@pubdate as .dt-published
    parseRelAttr: true, // parse @rel attributes
    parseItemRefAttr: true, // use microdata's itemref as per the include-pattern
    // Options for legacy microformats
    parseV1Microformats: false, // parse v1 microformats as microformats-2 (TODO: requires extension with vocabulary mappings)
    // Options for data format enforcement:
    forceValidUrls: true, // validate and filter URL properties against a valid regex
    forceValidDates: true, // validate and filter DT properties against a valid regex
    // Options for plain text formatting:
    expandPlainTextUrls: true, // when converting an link to plain text, append the URL in parantheses.
    markdownPlainTextUrls: false, // modifier on the previous; use Markdown link syntax.
    expandPlainTextAbbreviations: false, // when converting an abbr to plain text, append the URL in parantheses.
    markdownPlainTextPhrases: true, // when converting B, I, STRONG, EM to plaintext, wrap in markdown.
    markdownPlainTextImages: false // use Markdown syntax when inlining images
  };

  // Legacy microformat mapping vocabs:
  var vocabularies = {};
  var vocabularyRoots = {};

  // iterate on every node
  // find h-*
  // objects[] = allObjects[] += ParseFormat(node)
    // iterate every node.children
    // find p-, dt-, e-, i-, h- etc
    // if p- + h-
    // {}.p-whatever = allObjects[] += ParseFormat(childNode)
    // Put format into parent microformat, and into root index of all microformats.

  var propertyParsers = {
    p: function (el) {
      var extractedValue;
      if ('DATA' == el.nodeName && el.value) {
        return el.value;
      }
      if ((extractedValue = Parser.parseValueTitlePattern(el))) {
        return extractedValue;
      }
      if ('ABBR' == el.nodeName && el.title) {
        return el.title;
      }
      if ((extractedValue = Parser.parseValueTitlePattern(el))) {
        return extractedValue;
      }
      return Parser.flattenText(el);
    },
    u: function (el) {
      var url;
      if ('A' == el.nodeName && el.href) {
        url = el.href;
      }
      else if ('IMG' == el.nodeName) {
        url = el.src;
      }
      else if ('OBJECT' == el.nodeName && el.data) {
        url = el.data;
      }
      else {
        url = propertyParsers.p(el);
      }

      if(settings.validateUrlFormats && !matches(url, regexen.URL)) {
        return undefined;
      }
      else {
        return url;
      }
    },
    dt: function (el, bypassValidation) {
      var dt;
      if('TIME' == el.nodeName) {
        dt = el.getAttribute('datetime') || getTextContent(el);
      }
      else {
        dt = Parser.parseDateTimeValuePattern(el) || propertyParsers.p(el);
      }
      // TODO: clean up ISO format? Is there anything that can be done for this?
      if (!bypassValidation && settings.forceValidDates && !matches(dt, regexen.ISOFULL)) {
        return undefined;
      }
      else {
        return dt;
      }
    },
    e: function (el) {
      return el.innerHTML;
    },
    rel: function (el) {
      return el.href;
    }
  };

  function getTextContent (el) {
    return el.textContent || el.innerText;
  }

  function matches (str, regex) {
    regex.lastIndex = 0;
    return regex.test(str);
  }

  // Walk an element tree for properties
  // But, there's special behaviour to skip pieces of the tree if they are
  // themselves microformats.
  // el: Root element to start from
  // indexes:
  // obj: the object to write properties to
  // depth: are we at the root of a format?
  // legacyVocab: The vocabulary mapping for the current v1 microformat of `obj`
  // legacyRegex: The regular expression matching properties of `legacyVocab`
  function parseObjectTree (el, results, obj, depth, legacyVocab, legacyRegex) {

    var n = el;
    var className;
    var matchedProperties;
    var relValues;
    var values;
    var subobject;
    var types;
    var relCounter;

    results = results || { standalone: [], all: [], byId: {} };
    depth = depth || 0;

    // If we're parsing µf1, create the dynamic property regex:
    if (settings.parseV1Microformats && legacyVocab && !legacyRegex) {
      legacyRegex = new RegExp([
        '\\b(',
        Object.keys(legacyVocab).join('|').replace(/\-/g, '\\-'),
        ')\\b'].join(''), "g"
      );
    }

    while (n) {

      if (n.nodeType !== Node.ELEMENT_NODE) {
        n = depth && n.nextSibling;
        continue;
      }

      className = n.className || "";
      values = {}; // already parsed values (by type) (saves doing p- twice for two properties)
      subobject = undefined;

      matchedProperties = matches(className, regexen.PROPERTY);

      // If a new microformat, parse it as an opaque blob:
      if ((types = className.match(regexen.OBJECT))) {
        subobject = parseObjectTree(n.firstChild, results, createObject(types), depth + 1);

        // IF: No explicit properties declared, imply format 'name' from content.
        if (!Object.keys(subobject.properties).length && settings.parseSingletonRootNodes) {
          // Infer the name:
          assignValue(subobject, 'name', propertyParsers.p(n));
          // URL
          if (n.nodeName == 'A') {
            assignValue(subobject, 'url', propertyParsers.u(n));
          }
          // Single image/obj child parses as 'photo'
          if (n.children.length === 1 &&
              ~['IMG', 'OBJECT'].indexOf(n.children[0].nodeName)) {
            assignValue(subobject, 'photo', propertyParsers.u(n.children[0]));
          }
        }

        if (!Object.keys(subobject.properties).length) {
          subobject = undefined;
        }
      }
      else if (settings.parseV1Microformats && (types = className.match(vocabularyRoots))) {
        subobject = parseObjectTree(
          n.firstChild,
          results,
          createObject(types.map(function (format) {
            return vocabularies[format].root;
          })),
          depth + 1,
          mergeObjects.apply(
            this,
            [{}].concat(types.map(function (format) {
              return vocabularies[format].properties;
            }
          )))
        );
        // If the format defines a post-parse processor:
        types.forEach(function (format) {
          if (vocabularies[format].afterParse) {
            vocabularies[format].afterParse(subobject);
          }
        });
      }

      // Index the newly parsed object:
      if (types && subobject) {
        results.all.push(subobject);

        // If this didn't match any properties, and doesn't have a container
        // microformat, add it to the standalone microformats index:
        if (!obj || !matchedProperties) results.standalone.push(subobject);

        // Also index objects by ID (used by itemref and include-pattern)
        if (el.id) results.byID[el.id] = subobject;
      }

      if (obj) {
        // Continue: Property assignments
        if (legacyRegex) {
          legacyRegex.lastIndex = 0;
          while (className && (match = legacyRegex.exec(className))) {
            match = legacyVocab[match[1]].split('-', 2);
            parseProperty(obj, match[0], match[1], n, values, subobject);
          }
        }
        else {
          regexen.PROPERTY.lastIndex = 0; // reset regex mach position
          while (className && (match = regexen.PROPERTY.exec(className))) {
            parseProperty(obj, match[1], match[2], n, values, subobject);
          }
        }

        // Parse pubdate as dt-published, if not already parsed
        if (settings.parsePubDateAttr && 'TIME' == n.nodeName &&
            n.getAttribute('pubdate') && !obj.properties['published']) {
          assignValue(obj, 'published', propertyParsers['dt'].call(this, n));
        }

        // Continue: Parse rel values and collect globally:
        if (settings.parseRelAttr && n.rel) {
          assignRelationships(
            obj,
            (n.rel || "").split(" "),
            propertyParsers['rel'].call(this, n)
          );
        }
      }

      // unless we parsed an opaque microformat as a property, continue parsing down the tree:
      if (!subobject && n.firstChild) {
        parseObjectTree(n.firstChild, results, obj, depth + 1);
      }

      // don't crawl siblings of the initial root element
      n = depth && n.nextSibling;
    }

    // If we're deep, return the object for nested assignment, if we're back
    // at the surface, return all the results.
    return depth ? obj : results;
  }

  function createObject (types) {
    var o = {
      type: types,
      properties: {}
    };
    if (settings.parseRelAttr) {
      o.relationships = {};
    }
    return o;
  }

  // Handle a parsed type/property pair, and assign it
  function parseProperty (obj, type, property, n, knownValues, subobject) {

    // If we haven't already extracted a value for this type:
    if (!knownValues[type]) {
      // All properties themselves need to be arrays.
      knownValues[type] = propertyParsers[type] && propertyParsers[type].call(this, n);
    }

    if (knownValues[type]) {
      if ('p' == type) {
        // For any p- objects, extract text value (from p handler) AND append the mfo
        assignValue(obj, property, knownValues[type], subobject);
      }
      else {
        assignValue(obj, property, knownValues[type]);
      }
    }
  }

  // Add a new value to an object property. Handle multiple values for the same
  // property name (e.g. multiple URLs), and handle assigning literal values
  function assignValue (o, property, literal, struct) {
    if (struct) {
      struct.value = literal;
    }
    o.properties[property] = o.properties[property] || [];
    o.properties[property].push(struct || literal);
  }

  function assignRelationships (o, rels, value) {
    rels.forEach(function (rel) {
      if (!rel) return;
      o.relationships[rel] = o.relationships[rel] || [];
      o.relationships[rel].push(value);
    });
  }

  function mergeObjects (target) {
    var i = 1;
    var o;
    var key;

    for (; (o = arguments[i]); i++) {
      for (key in o) if (o.hasOwnProperty(key)) {
        target[key] = o[key];
      }
    }
    return target;
  }

  function Parser (rootElement) {
    this.element = rootElement;
  }

  Parser.prototype.parse = function () {
    return new Results(parseObjectTree(this.element));
  };

  Parser.defineLegacyVocabulary = function (mapTo, format) {
    format.root.forEach(function (className) {
      vocabularies[className] = {
        properties: format.properties,
        root: mapTo,
        afterParse: format.afterParse
      };
    });

    // Rebuild Legacy Root Node Regex
    vocabularyRoots = new RegExp([
      '\\b(',
      Object.keys(vocabularies).join('|').replace('-', '\\-'),
      ')\\b'].join('')
    );
  };

  // Find all p-value children and return them
  Parser.parseValuePattern = function (el, parseAs) {
    var values = [];
    var n = el.firstChild;
    parseAs = propertyParsers.hasOwnProperty(parseAs) ? parseAs : 'p';

    while (n) {
      if (n.nodeType !== Node.ELEMENT_NODE) {
        n = n.nextSibling;
        continue;
      }
      // If class="value"
      if (matches(n.className, regexen.VALUE)) {
        values.push(propertyParsers[parseAs](n, true));
      }
      // If this itself isn't another property, then continue down the
      // tree for values
      else if (!matches(n.className, regexen.PROPERTY)) {
        values.concat(Parser.parseValuePattern(n, parseAs));
      }
      n = n.nextSibling;
    }
    return values;
  };

  // Parse first-child-value-title
  Parser.parseValueTitlePattern = function (el) {
    var vt = el.children.length && el.children[0];
    return vt && matches(vt.className, regexen.VALUETITLE) && vt.title;
  };

  // Collects value class pattern descendents, and concatinates them to make an
  // ISO date string.
  Parser.parseDateTimeValuePattern = function (el) {
    var date;
    var time;
    var tz;
    var timestamp;

    Parser.parseValuePattern(el, 'dt').forEach(function (v) {
      if (matches(v, regexen.ISODATE)) {
        date = date || v;
      }
      else if (matches(v, regexen.ISOTIME)) {
        time = time || v;
      }
      else if (matches(v, regexen.ISOTZ)) {
        tz = tz || v;
      }
    });

    if (date) {
      timestamp = date;
      if (time) {
        timestamp += "T" + time;
        if (tz) {
          timestamp += tz;
        }
      }
    }
    return timestamp;
  };

  // Get flattened text value of a node, ALT-text fallbacks.
  Parser.flattenText = function (el) {
    var n = el && el.firstChild;
    var str = [];
    while (n) {
      if (n.nodeType == Node.TEXT_NODE) {
        str.push(n.nodeValue);
      }
      else if (n.nodeType == Node.ELEMENT_NODE) {
        if (settings.expandPlainTextUrls && 'A' == n.nodeName) {
          if (settings.markdownPlainTextUrls) {
            str.push('[' + Parser.flattenText(n) + '](' + n.href + ((n.title) ? ' "' + n.title + '"' : '') + ')');
          }
          else {
            str.push(Parser.flattenText(n) + ' (' + n.href + ')');
          }
        }
        else if (settings.expandPlainTextAbbreviations && ~['ABBR', 'ACRONYM]'].indexOf(n.nodeName) && n.title) {
          str.push(Parser.flattenText(n) + ' (' + n.title + ')');
        }
        else if (settings.markdownPlainTextPhrases && ~['B', 'I', 'EM', 'STRONG', 'CODE'].indexOf(n.nodeName)) {
          if ('CODE' == n.nodeName) {
            str.push('`' + Parser.flattenText + '`');
          }
          else if (~['I', 'EM'].indexOf(n.nodeName)) {
            str.push('*' + Parser.flattenText(n) + '*');
          }
          else {
            str.push('*' + Parser.flattenText(n) + '*');
          }
        }
        else if ('IMG' == n.nodeName) {
          if (settings.markdownPlainTextImages) {
            str.push('![' + n.alt + '](' + n.src + ((n.title) ? ' "' + n.title + '"' : '') + ')');
          }
          else {
            str.push(" " + n.alt + " ");
          }
        }
        else {
          str.push(Parser.flattenText(n));
        }
      }
      n = n.nextSibling;
    }
    return str.join('').replace(/ +/, ' ').trim();
  };

  // Shorthand method to parse a provided tree
  Parser.parse = function (root) {
    return new Parser(root).parse().getAllObjects();
  };

  // Override global parser settings, return representation of current settings
  Parser.settings = function (override) {
    var clone = {};
    var key;

    for (key in settings) if (settings.hasOwnProperty(key)) {
      if (override && undefined !== override[key]) {
        settings[key] = !!override[key];
      }
      clone[key] = settings[key];
    }
    return clone;
  };

  function Results (indexedResults) {
    var all = indexedResults.all;
    var standalone = indexedResults.standalone;
    var ids = indexedResults.ids;

    this.getAllObjects = function () {
      return all;
    };

    this.getStandaloneObjects = function () {
      return standalone;
    };

    this.getObjectById = function (id) {
      return ids[id];
    };

    this.getObjectsByMicroformat = function (format, includeSubProperties) {
      return (includeSubProperties ? all : standalone).filter(function (i) {
        return i && i.type && ~i.type.indexOf(format);
      });
    };
  }

  exports.HParse = Parser;

})(window || global || (module && module.exports) || {});