/** adr for hparse
Maps the adr µf1 vocabulary to µf2
*/
if (HParse) {
  HParse.defineLegacyVocabulary('h-adr', {
    root: ['adr'],
    properties: {
      'post-office-box': 'p-post-office-box',
      'extended-address': 'p-extended-address',
      'street-address': 'p-street-address',
      'locality': 'p-locality',
      'region': 'p-region',
      'postal-code': 'p-postal-code',
      'country-name': 'p-country-name'
    }
  });
}