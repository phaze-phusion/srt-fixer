import {UNI} from '../_constants';

// Note:
// line-break = \x0a
// carriage-return = \x0d

/**
 * @param {string} value
 * @returns {string}
 */
export function normalizeInput(value) {
  // normalize linebreaks
  // ----------------------------------
  value = value
    .replace(/\x0d?\x0a/g, UNI.BREAK) // \r?\n

  // Fix lyrics
  // ----------------------------------
  // replace bad structured music notes [RARE]
  //   .replace(/¶/g, UNI.NOTE_1)
  //   .replace(/(\u00e2\u2122([\W\S\D]))+/g, UNI.NOTE_1) // e.g. '\u00e2\u2122-'

  // add space when erroneously removed
  //   .replace(/([\w\d\.\?!,]{1}<\/i>)([\w\d]{1})/g, '$1 $2')
  //   .replace(/([:,!\u2013\?\.])(<i>)/g, '$1 $2')

  // italics and bold tags
  // ----------------------------------
  // first fix spaced tags
    .replace(/<\/[bi]>(\s+)<\1>/g, '$1')
    .replace(/([^\s])(<[bi]>)(\s)?/g, '$1 $2')
    .replace(/(\s)?(<\/[bi]>)([^\s.?!,:])/g, '$1 $2')

  // remove only the bold tags
  //   .replace(/<\/?[b]>/g, '')
  // then remove the tags
    .replace(/<\/?[bi]>/g, '')

  // spaced out SDH
  // ----------------------------------
    .replace(/(])([a-zA-Z])/g, '$1 $2')

  // trim spaces from lines
  // ----------------------------------
    .replace(/( +)?(\x0a)( +)?/g, '$2')

  // add an extra line break at the end of the file
    + UNI.BREAK;

  return normalizeOutput(value);
}

/**
 * @param {string} value
 * @returns {string}
 */
export function normalizeOutput(value) {
  // Make sure there's only a single blank line at the end
  return value.replace(/(\x0a)+$/g, UNI.BREAK);
}
