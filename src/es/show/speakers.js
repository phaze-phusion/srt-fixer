import {COLORS, RX, UNI} from '../_constants';

const _speakersRegex = new RegExp(`${RX.BREAK}([^${RX.BREAK}]+)?<font color="${COLORS.SPEAKER}">.+(${RX.BREAK}.+)?<\\/font>([^${RX.BREAK}]+)?${RX.BREAK}`, 'g');
const _speakersOutRegex1 = new RegExp(`(<font color="${COLORS.SPEAKER}">)|(<\\/font>)`, 'g');
const _speakersOutRegex2 = new RegExp(`(\\S)${RX.BREAK}(\\S)`, 'g');
const _speakersOutRegex3 = new RegExp(`((^${RX.BREAK})|(${RX.BREAK}$))`, 'g');

const _matchMapSpeakers = caught => {
  caught = caught.replace(_speakersOutRegex1, '');
  caught = caught.replace(/\n-\s+/g, '\n');
  caught = caught.replace(_speakersOutRegex2, '$1 $2');
  caught = caught.replace(_speakersOutRegex3, '');
  return caught;
};

const _uniqueMapSpeakers = caught => {
  caught = caught.replace(/^<font.*/, '');
  caught = caught.replace(/ <font.*/, ''); // remove effect from speaker line
  caught = caught.replace(/:.*/, '');
  return caught;
};

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

export function showSpeakers(text) {
  let matches = text.match(_speakersRegex) || [];

  if (matches.length !== 0) {
    matches = matches.map(_matchMapSpeakers);
    matches = matches.join(UNI.BREAK);

    let uniques = matches.split(`${UNI.BREAK}`);
    uniques = uniques.map(_uniqueMapSpeakers);
    uniques = uniques.filter(filterOnlyUnique);
    uniques = uniques.sort(sortAlphabetically);

    // caught = caught.replace(/:.*$/, '');

    return uniques.join(UNI.BREAK);
  }
  return '----- Toggle SDH / NONE -----';
}
