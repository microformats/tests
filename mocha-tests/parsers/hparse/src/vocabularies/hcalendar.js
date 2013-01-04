/** hcalendar for hparse
Maps the hcalendar µf1 vocabulary to µf2
*/
if (HParse) {

  HParse.defineLegacyVocabulary('h-calendar', {
    root: ['vcalendar', 'hcalendar'],
    properties: {
      'vevent': 'p-event'
    }
  });

  HParse.defineLegacyVocabulary('h-event', {
    root: ['vevent', 'hevent'],
    properties: {
      'dtstart': 'dt-start',
      'dtend': 'dt-end',
      'duration': 'p-duration',
      'summary': 'p-name',
      'uid': 'p-uid',
      'dtstamp': 'dt-stamp',
      'method': 'p-method',
      'category': 'p-category',
      'location': 'p-location',
      'url': 'u-url',
      'description': 'e-description',
      'last-modified': 'dt-last-modified',
      'status': 'p-status',
      'class': 'p-class',
      'attendee': 'p-attendee',
      'contact': 'p-contact',
      'organizer': 'p-organizer',
      'attach': 'u-photo'
    }
  });

  // Handle the nested properties of attendees: In uf-2 land these will merge
  // into with hCards. Adding this as a vocabulary enables that with the property
  // matching of the fallback parser.
  HParse.defineLegacyVocabulary('h-attendee', {
    root: ['attendee'],
    properties: {
      'partstat': 'p-partstat',
      'role': 'p-role'
    }
  });
}