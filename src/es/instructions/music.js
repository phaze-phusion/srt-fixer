import {COLORS, RX, UNI} from '../_constants';

/**
 * @param {Section} section
 * @param {LogController} logger
 * @param {boolean} includeMusic
 * @param {boolean} _includeItalics
 * @returns {Section|undefined}
 */
export function musicInstructions(section, logger, includeMusic, _includeItalics) {
  let content = section.content;

  // Return if there are no notes in section text
  if (!_noteRegex.test(content))
    return section;

  // console.log('_sameLineLyricsRegex', _sameLineLyricsRegex.test(content), section)
  // console.log(`(${RX.NOTE_1}[^${RX.NOTE_1}${RX.BREAK}]+)${RX.BREAK}([^${RX.BREAK}])`)

  // Space out notes
  content = content
    .replace(_badLyricStructureRegex, UNI.NOTE_1 + ' ' + UNI.NOTE_1)

  // put lyrics on same line
  // Note: added $2 in replace string to fix cutting off first letter of next line
  // Note: lyrics over 3 lines are not fixed by this
    .replace(_sameLineLyricsRegex, '$1 $2')

  // add missing trailing note
    .replace(_trailingNoteRegex, '$1 ' + UNI.NOTE_1)

  // also for MAN: # lyrics #
    .replace(_trailingNoteWithSpeakerRegex, '$1 ' + UNI.NOTE_1)

  // remove talk dash from single lyric line
    .replace(_lyricSpeakerDashRegex, '$2');

  // console.log(content)

  // Lone notes
  if (_loneNoteRegex.test(content))
    return;

  // MAN: # lyrics # >> difficult to remove without context so just keep the styling
  if (_speakerLyricRegex.test(content)) {
    logger.write('See lyrics', section.timestamp);
    content = content.replace(_speakerLyricRegex, `$1<font color="${COLORS.MUSIC}">$2</font>`);
  }

  if (!includeMusic) {
    if (content.match(_removeLyricsRegexOne))
      return;

    content = content.replace(_removeLyricsRegexTwo, '');

    if (content.length === 0)
      return;

    // Remove Effect followed by music line
    // e.g.
    // [choir singing]
    // ♪ Wade in the water ♪
    if (content.match(_removeLyricsEffectsRegex))
      return;
  } else {
    // # lyrics #
    // - # lyrics #
    content = content.replace(
      _includeLyricsRegex,
      (match, p1, p2) => `${p1 ?? ''}<font color="${COLORS.MUSIC}">${p2}</font>`
    );
  }

  section.content = content;

  return section;
}

const _noteRegex = new RegExp(`[${RX.NOTE_1}${RX.NOTE_2}]`, 'g');

// Fix lyrics
const _badLyricStructureRegex = new RegExp(`${RX.NOTE_1}{2,}`, 'g');
const _sameLineLyricsRegex = new RegExp(`(${RX.NOTE_1}[^${RX.NOTE_1}${RX.BREAK}]+)${RX.BREAK}([^${RX.BREAK}])`, 'g');
const _trailingNoteRegex = new RegExp(`((${RX.DASH} )?${RX.NOTE_1}[^${RX.NOTE_1}${RX.BREAK}]+[^${RX.NOTE_1}])$`, 'g');
const _trailingNoteWithSpeakerRegex = new RegExp(`(: ${RX.NOTE_1}[^${RX.NOTE_1}${RX.BREAK}]+[^${RX.NOTE_1}])$`, 'g');
const _lyricSpeakerDashRegex = new RegExp(`^(${RX.DASH} )(${RX.NOTE_1}[^${RX.NOTE_1}${RX.BREAK}]+[^${RX.NOTE_1}]${RX.NOTE_1})$`, 'g');

// Restructure lyrics
const _loneNoteRegex = new RegExp(`^[${RX.NOTE_1}${RX.NOTE_2}]+$`, 'g');
const _speakerLyricRegex = new RegExp(`(: )(${RX.NOTE_1}[^${RX.NOTE_1}\\d]+${RX.NOTE_1}(${RX.BREAK}${RX.NOTE_1}[^${RX.NOTE_1}\\d]+${RX.NOTE_1})?)$`, 'g');
const _includeLyricsRegex = new RegExp(`^(${RX.DASH} )?(${RX.NOTE_1}[^${RX.NOTE_1}\\d]+${RX.NOTE_1}(${RX.BREAK}${RX.NOTE_1}[^${RX.NOTE_1}\\d]+${RX.NOTE_1})?)$`, 'g');
const _removeLyricsRegexOne = new RegExp(`^((${RX.DASH} )?${RX.NOTE_1}[^${RX.NOTE_1}\\d]+${RX.NOTE_1}(${RX.BREAK})?)+`, 'g');
const _removeLyricsRegexTwo = new RegExp(`(${RX.DASH} (${RX.BREAK}?${RX.NOTE_1}[^${RX.NOTE_1}\\d]+${RX.NOTE_1})+)+`, 'g');
const _removeLyricsEffectsRegex = new RegExp(`^\\[[^\\]]+\\](${RX.BREAK}${RX.NOTE_1}[^${RX.NOTE_1}\\d]+${RX.NOTE_1})+$`, 'g');

