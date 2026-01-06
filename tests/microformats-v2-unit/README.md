# Microformats v2 unit tests

This directory contains a set of "unit tests" for microformats parsers. Where other tests seek to demonstrate correct behaviour for real-world documents, these tests are purely synthetic, and aim to test individual parsing features in detail.

## Design principles

Tests adhere to the following design principles. New additions to this test series should follow these principles wherever possible, and document deviations in HTML comments where applicable.

- As much as possible each file should test only one parsing feature. Due to the requirements of microformats parsing this can often be difficult to accomplish. In particular, the following should be avoided in test output:
  - Implied properties: where the parser would imply a `p-name` or other property, add an explicit one
  - Text trimming: Any text output should avoid inner or outer whitespace which the traditional or [more aggressive](https://microformats.org/wiki/textcontent-parsing) triming algorithms would remove. At the very least, tests should pass regardless of which algorithm is used
  - URL normalization: URLs should be kept simple, as the details of expected normalization are undefined as of this writing
- Where the specification is silent or unclear as to the expected behaviour of a feature but most implementations agree, tests should be placed into a file named beginning with `tentative-` e.g. `tentative-some-feature.html` to allow implementations to easily skip these tests if they do not implement the majority behaviour. Such files should include HTML comments with explanatory details and references to any relevant GitHub issues or other discussion
- Top-level microformat types should include "test" within their name. For example, use `h-test-explicit` rather than `h-explicit`
- Top-level microformat types should be unique per file, so that failing tests can have unique identifiers. In other words, do not use `h-test` for every microformat; instead use `h-1-test` and `h-2-test`, or even better `h-test-with-feature` and `h-test-without-feature`
- Test failure should be indicated with the inclusion of "Invalid" in the output, wherever possible. Test success may be indicated with the inclusion of the text "Valid", but other text may be used where suitable
- Where the parser is expected to trim attribute values, the text "Do Trim" should be used in the output. Conversely, where the parser is expected not to trim attribute values, the text " No Trim " should be used in the output
- The implied base URL is `http://example.test`. The `example.test` domain is used instead of `example.com` as in other tests since `example.com` is an actual host on the Internet and implementations might conceivably communicate with it automatically. This may change if consensus emerges that `example.com` is nevertheless preferred

## Setting up the tests

Test set-up is the same as for the other test sets, with the exception that the base URL is `http://example.test`. Partial parser implementations may wish to execute tests in a particular orderto test basic features before more complex ones:

1. Microformat tests in `names`
2. Property tests in `names`
3. Tests in `properties`
4. Tests in `implied`
5. Tests in `value`
6. Tests in `nested`