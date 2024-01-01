import {COLORS, UNI} from '../_constants';

/**
 * @param {string} text
 * @param {SectionMap} sectionsMap
 * @returns {string}
 */
export function showSpeakers(text, sectionsMap) {
  let output = '';
  let speakers = [];

  sectionsMap.forEach((section, _timestamp) => {
    if (!section.hasSpeaker)
      return;

    if (section.lines === 1) {
      output += section.content.replace(_speakerMinFontRegex, '') + UNI.BREAK;
      speakers.push(Array.from(section.content.matchAll(_speakerOnlyRegex))[0][1]);
      return;
    }

    section.content.split('\n').map(line => {
      if (_speakerMinFontRegex.test(line)) {
        output += line.replace(_speakerMinFontRegex, '') + UNI.BREAK;
        speakers.push(Array.from(line.matchAll(_speakerOnlyRegex))[0][1]);
      }
    });
  });

  if (output === '')
    return '----- None / Toggle Speakers -----'

  speakers = speakers
      .filter(filterOnlyUnique)
      .sort(sortAlphabetically)

  output = speakers.join('\n') + '\n\n----------\nInstances\n----------\n\n' + output;

  return output;
}

const _speakerMinFontRegex = new RegExp(`(<font color="#[a-fA-F0-9]+">)|(<\\/font>)`, 'g');
const _speakerOnlyRegex = new RegExp(`<font color="${COLORS.SPEAKER}">([^<]+)<\\/font>`, 'g');

/*
 * Get only uniques from array
 *
 * With JavaScript 1.6 / ECMAScript 5 you can use the native filter method of an Array
 * in the following way to get an array with unique values
 *
 * Example:
 *   var a = ['a', 1, 'a', 2, '1'];
 *   var unique = a.filter( onlyUnique ); // returns ['a', 1, 2, '1']
 *
 * @param {string} value
 * @returns {integer} index
 * @returns {object} self
 */
const filterOnlyUnique = (value, index, self) => self.indexOf(value) === index;
const sortAlphabetically = (a, b) => (a > b) ? 1 : ((b < a) ? -1 : 0);
