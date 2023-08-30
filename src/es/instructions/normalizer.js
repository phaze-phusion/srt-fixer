import {RX, UNI} from '../_constants';

const _badLyricStructureRegex = new RegExp(`${RX.NOTE_1}{2,}`, 'g');
const _sameLineLyricsRegex = new RegExp(`(${RX.NOTE_1}[^${RX.NOTE_1}${RX.BREAK}]+)${RX.BREAK}([^${RX.BREAK}])`, 'g');
const _trailingNoteRegex = new RegExp(`((${RX.DASH} )?${RX.NOTE_1}[^${RX.NOTE_1}${RX.BREAK}]+[^${RX.NOTE_1}])$`, 'g');
const _trailingNoteWithSpeakerRegex = new RegExp(`(: ${RX.NOTE_1}[^${RX.NOTE_1}${RX.BREAK}]+[^${RX.NOTE_1}])$`, 'g');
const _lyricSpeakerDashRegex = new RegExp(`^(${RX.DASH} )(${RX.NOTE_1}[^${RX.NOTE_1}${RX.BREAK}]+[^${RX.NOTE_1}]${RX.NOTE_1})$`, 'g');

// Note:
// line-break = \x0a
// carriage-return = \x0d

export function normalizeInput(value) {
  // italics and bold tags
  // ----------------------------------
  // first fix spaced tags
  value = value.replace(/<\/[bi]>(\s+)<\1>/g, '$1');
  value = value.replace(/([^\s])(<[bi]>)(\s)?/g, '$1 $2');
  value = value.replace(/(\s)?(<\/[bi]>)([^\s.?!,:])/g, '$1 $2');

  // then remove the tags
  value = value.replace(/<\/?[bi]>/g, '');

  // normalize linebreaks
  // ----------------------------------
  value = value.replace(/\x0d?\x0a/g, UNI.BREAK); // \r?\n

  // add space when erroneously removed
  // value = value.replace(/([\w\d\.\?!,]{1}<\/i>)([\w\d]{1})/g, '$1 $2');
  // value = value.replace(/([:,!\u2013\?\.])(<i>)/g, '$1 $2');

  // spaced out SDH
  // ----------------------------------
  value = value.replace(/(])([a-zA-Z])/g, '$1 $2');

  // trim spaces from lines
  // ----------------------------------
  value = value.replace(/( +)?(\x0a)( +)?/, '$2')

  // fix lyrics
  // ----------------------------------
  // replace bad structured music notes [RARE]
  value = value.replace(/¶/g, UNI.NOTE_1);
  value = value.replace(/(\u00e2\u2122([\W\S\D]))+/g, UNI.NOTE_1);
  value = value.replace(_badLyricStructureRegex, UNI.NOTE_1 + ' ' + UNI.NOTE_1);

  // put lyrics on same line
  // Note: added $2 in replace string to fix cutting off first letter of next line
  value = value.replace(_sameLineLyricsRegex, '$1 $2');

  // add missing trailing note
  value = value.replace(_trailingNoteRegex, '$1 ' + UNI.NOTE_1);

  // also for MAN: # lyrics #
  value = value.replace(_trailingNoteWithSpeakerRegex, '$1 ' + UNI.NOTE_1);

  // remove talk dash from single lyric line
  value = value.replace(_lyricSpeakerDashRegex, '$2');

  // single trailing break
  // ----------------------------------
  // add an extra line break at the end of the file
  value = normalizeOutput(value + UNI.BREAK);

  return value;
}
export function normalizeOutput(value) {
  // Make sure there's only a single blank line at the end
  return value.replace(/(\x0a)+$/g, UNI.BREAK);
}
