import {RX} from '../_constants';

export function musicalLyrics(text, include_lyrics, color_music, color_speaker) {
  // Always remove lone notes
  text = text.replace(new RegExp(`${RX.ID}${RX.TIME_STAMP}${RX.BREAKS}${RX.NOTE_1}(${RX.BREAKS}){1,}`, 'g'), '');

  // MAN: # lyrics # >> difficult to remove without context so just keep the styling
  text = text.replace(
    new RegExp(`(: )(${RX.NOTE_1}[^${RX.NOTE_1}\\d]+${RX.NOTE_1}(${RX.BREAKS}${RX.NOTE_1}[^${RX.NOTE_1}\\d]+${RX.NOTE_1})?)(${RX.BREAKS})`, 'g'),
    `$1<font color="${color_music}">$2</font>$4`
  );

  if (include_lyrics === true) {
    // # lyrics #
    text = text.replace(new RegExp(`(${RX.ID_TIME_BREAK})(${RX.NOTE_1}[^${RX.NOTE_1}\\d]+${RX.NOTE_1}(${RX.BREAKS}${RX.NOTE_1}[^${RX.NOTE_1}\\d]+${RX.NOTE_1})?)(${RX.BREAKS})`, 'g'),
      `$1<font color="${color_music}">$2</font>$4`);

    // - # lyrics #
    text = text.replace(new RegExp(`(${RX.BREAKS}(${RX.DASH} )?)(${RX.NOTE_1}[^${RX.NOTE_1}\\d]+${RX.NOTE_1}(${RX.BREAKS}${RX.NOTE_1}[^${RX.NOTE_1}\\d]+${RX.NOTE_1})?)(${RX.BREAKS})`, 'g'),
      `$1<font color="${color_music}">$3</font>$5`);
  } else {
    text = text.replace(new RegExp(`(${RX.BREAKS}){2,}${RX.ID}${RX.TIME_STAMP}(${RX.BREAKS}(${RX.DASH} )?${RX.NOTE_1}[^${RX.NOTE_1}\\d]+${RX.NOTE_1})+`, 'g'), '');
    text = text.replace(new RegExp(`${RX.ID}${RX.TIME_STAMP}(${RX.BREAKS}(${RX.DASH} )?${RX.NOTE_1}[^${RX.NOTE_1}\\d]+${RX.NOTE_1})+(${RX.BREAKS}){2,}`, 'g'), '');
    // text = text.replace(new RegExp(`${RX.ID}${RX.TIME_STAMP}(${RX.BREAKS}(${RX.DASH} )?${RX.NOTE_1}[^${RX.NOTE_1}\\d]+(${RX.BREAKS})[^${RX.NOTE_1}\\d]+${RX.NOTE_1})+(${RX.BREAKS}){2,}`, 'g'), '');

    // Remove Effect followed by music line
    // e.g.
    // [choir singing]
    // ♪ Wade in the water ♪
    text = text.replace(new RegExp(`${RX.ID}${RX.TIME_STAMP}${RX.BREAKS}\\[[^\\]]+\\](${RX.BREAKS}${RX.NOTE_1}[^${RX.NOTE_1}\\d]+${RX.NOTE_1})+(${RX.BREAKS}){2,}`, 'g'), '');

    text = text.replace(new RegExp(`${RX.DASH} (${RX.BREAKS}?${RX.NOTE_1}[^${RX.NOTE_1}\\d]+${RX.NOTE_1})+${RX.BREAKS}`, 'g'), '');
  }

  return text;
}
