/** hatom for hparse
Maps the hAtom µf1 vocabulary to µf2
*/
if (HParse) {

  HParse.defineLegacyVocabulary('h-feed', {
    root: ['hfeed'],
    properties: {
      'hentry': 'e-entry'
    }
  });

  HParse.defineLegacyVocabulary('h-entry', {
    root: ['hentry'],
    properties: {
      'entry-title': 'p-name',
      'entry-summary': 'p-summary',
      'entry-content': 'e-content',
      'author': 'p-author',
      'published': 'dt-published',
      'updated': 'dt-updated',
      'category': 'p-category'
    },
    afterParse: function (object) {
      if (object.relationships && object.relationships.bookmark) {
        object.properties.url = object.relationships.bookmark;
      }
    }
  });
}