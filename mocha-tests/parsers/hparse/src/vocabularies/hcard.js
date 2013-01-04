/** hcard for hparse
Maps the hcard µf1 vocabulary to µf2
*/
if (HParse) {
  HParse.defineLegacyVocabulary('h-card', {
    root: ['hcard', 'vcard'],
    properties: {
      'fn': 'p-name',
      'family-name': 'p-family-name',
      'given-name': 'p-given-name',
      'additional-name': 'p-additional-name',
      'honorific-prefix': 'p-honorific-prefix',
      'honorific-suffix': 'p-honorific-suffix',
      'nickname': 'p-nickname',
      'photo': 'u-photo',
      'bday': 'dt-bday',
      'adr': 'p-adr',
      'post-office-box': 'p-post-office-box',
      'extended-address': 'p-extended-address',
      'street-address': 'p-street-address',
      'locality': 'p-locality',
      'region': 'p-region',
      'postal-code': 'p-postal-code',
      'country-name': 'p-country-name',
      'type': 'p-type',
      'label': 'p-label',
      'tel': 'p-tel',
      'email': 'u-email',
      'mailer': 'p-mailer',
      'tz': 'p-tz',
      'geo': 'p-geo',
      'latitude': 'p-latitude',
      'longitude': 'p-longitude',
      'title': 'p-title',
      'org': 'p-org',
      'organization-name': 'p-organization-name',
      'organization-unit': 'p-organization-unit',
      'category': 'p-category',
      'note': 'e-note',
      'rev': 'dt-rev',
      'sort-string': 'p-sort-string',
      'sound': 'u-sound',
      'uid': 'u-uid',
      'url': 'u-url',
      'class': 'p-class',
      'key': 'p-key'
    }
  });
}