import {COLORS, RX} from '../_constants';
import {undefinedIsEmptyString} from '../_utils';

const _loneNoteRegex = new RegExp(`^[${RX.NOTE_1}${RX.NOTE_2}]+$`, 'g');
const _speakerLyricRegex = new RegExp(`(: )(${RX.NOTE_1}[^${RX.NOTE_1}\\d]+${RX.NOTE_1}(${RX.BREAK}${RX.NOTE_1}[^${RX.NOTE_1}\\d]+${RX.NOTE_1})?)$`, 'g');
const _includeLyricsRegex = new RegExp(`^(${RX.DASH} )?(${RX.NOTE_1}[^${RX.NOTE_1}\\d]+${RX.NOTE_1}(${RX.BREAK}${RX.NOTE_1}[^${RX.NOTE_1}\\d]+${RX.NOTE_1})?)$`, 'g');
const _removeLyricsRegexOne = new RegExp(`^((${RX.DASH} )?${RX.NOTE_1}[^${RX.NOTE_1}\\d]+${RX.NOTE_1}(${RX.BREAK})?)+`, 'g');
const _removeLyricsRegexTwo = new RegExp(`(${RX.DASH} (${RX.BREAK}?${RX.NOTE_1}[^${RX.NOTE_1}\\d]+${RX.NOTE_1})+)+`, 'g');
const _removeLyricsEffectsRegex = new RegExp(`^\\[[^\\]]+\\](${RX.BREAK}${RX.NOTE_1}[^${RX.NOTE_1}\\d]+${RX.NOTE_1})+$`, 'g');

export function musicalLyrics(section, include_lyrics) {
  let value = section.text;

  // Lone notes
  if (value.match(_loneNoteRegex))
    return;

  // MAN: # lyrics # >> difficult to remove without context so just keep the styling
  value = value.replace(_speakerLyricRegex, `$1<font color="${COLORS.MUSIC}">$2</font>`);

  if (include_lyrics !== true) {
    if (value.match(_removeLyricsRegexOne))
      return;

    value = value.replace(_removeLyricsRegexTwo, '');

    if (value.length === 0)
      return;

    // Remove Effect followed by music line
    // e.g.
    // [choir singing]
    // ♪ Wade in the water ♪
    if (value.match(_removeLyricsEffectsRegex))
      return;
  } else {
    // # lyrics #
    // - # lyrics #
    value = value.replace(
      _includeLyricsRegex,
      (match, p1, p2) => `${undefinedIsEmptyString(p1)}<font color="${COLORS.MUSIC}">${p2}</font>`
    );
  }

  section.text = value;

  return section;
}
