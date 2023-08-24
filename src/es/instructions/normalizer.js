import {RX, UNI} from '../_constants';

export function normalizeInput(value) {
  // fix spaced italics
  // ----------------------------------
  value = value.replace(/<\/([bi])>(\s+)<\1>/g, '$2');
  value = value.replace(/([^\s])(<[bi]>)(\s)?/g, '$1 $2');
  value = value.replace(/(\s)?(<\/[bi]>)([^\s.?!,:])/g, '$1 $2');

  // remove italics and bold tags
  value = value.replace(/<(\/?)([bi])>/g, '');

  // normalize linebreaks
  // ----------------------------------
  value = value.replace(new RegExp(`${RX.BREAKS}`, 'g'), UNI.BREAK);

  // value = value.replace(/ +(<\/?i>)/g, '$1');
  // value = value.replace(/(<\/?i>) +/g, '$1');

  // add space when erroneously removed
  // value = value.replace(/([\w\d\.\?!,]{1}<\/i>)([\w\d]{1})/g, '$1 $2');
  // value = value.replace(/([:,!\u2013\?\.])(<i>)/g, '$1 $2');

  // spaced out SDH
  // ----------------------------------
  value = value.replace(/(])([a-zA-Z])/g, '$1 $2');

  // trim spaces from lines
  // ----------------------------------
  value = value.replace(new RegExp(`(${RX.BREAKS})( )+`, 'g'), '$1');
  value = value.replace(new RegExp(`( )+(${RX.BREAKS})`, 'g'), '$2')

  // fix lyrics
  // ----------------------------------
  // // When italics are present remove them around musical notes
  // value = value.replace( new RegExp(`<i>(${RX.NOTE_1})`   , 'g'), '$1' );
  // value = value.replace( new RegExp(`(${RX.NOTE_1})<\\/i>`, 'g'), '$1' );

  // replace bad structured music notes [RARE]
  value = value.replace(/¶/g, UNI.NOTE_1);
  value = value.replace(/(\u00e2\u2122([\W\S\D]))+/g, UNI.NOTE_1);
  value = value.replace(new RegExp(`${RX.NOTE_1}{2,}`, 'g'), UNI.NOTE_1 + ' ' + UNI.NOTE_1);

  // put lyrics on same line
  // Note: added $2 in replace string to fix cutting off first letter of next line
  value = value.replace(new RegExp(`(${RX.BREAKS}${RX.NOTE_1}[^${RX.NOTE_1}${RX.BREAKS_RANGE}]+)${RX.BREAKS}([^${RX.BREAKS_RANGE}])`, 'g'), '$1 $2');

  // add missing trailing note
  value = value.replace(new RegExp(`(${RX.BREAKS}(${RX.DASH} )?${RX.NOTE_1}[^${RX.NOTE_1}${RX.BREAKS_RANGE}]+[^${RX.NOTE_1}])(${RX.BREAKS}${RX.BREAKS})`, 'g'), '$1 ' + UNI.NOTE_1 + '$3');

  // also for MAN: # lyrics #
  value = value.replace(new RegExp(`(: ${RX.NOTE_1}[^${RX.NOTE_1}${RX.BREAKS_RANGE}]+[^${RX.NOTE_1}])(${RX.BREAKS}${RX.BREAKS})`, 'g'), '$1 ' + UNI.NOTE_1 + '$2');

  // remove talk line from single lyric line
  value = value.replace(new RegExp(`(${RX.ID_TIME_BREAK})(${RX.DASH} )(${RX.NOTE_1}[^${RX.NOTE_1}${RX.BREAKS_RANGE}]+[^${RX.NOTE_1}]${RX.NOTE_1}${RX.BREAKS}${RX.BREAKS})`, 'g'), '$1$3');

  // strip signatures
  // ----------------------------------
  // remove elderman
  value = value.replace(new RegExp(`${RX.ID_TIME_BREAK}== sync, corrected by <font color="?#([a-fA-F0-9]{6})"?>elderman<\\/font> ==${RX.BREAKS}<font color="?#([a-fA-F0-9]{6})"?>@elder_man<\\/font>(${RX.BREAKS}){2}`, 'g'), '');

  // remove mstoll
  value = value.replace(new RegExp(`${RX.ID_TIME_BREAK}(<b>)?<font color="?#([a-fA-F0-9]{6})"?>Ripped By mstoll<\\/font>(</b>)?(${RX.BREAKS}){2}`, 'g'), '');

  // remove wilson0804
  value = value.replace(new RegExp(`${RX.ID_TIME_BREAK}Sync & corrections by wilson0804(${RX.BREAKS}){2}`, 'g'), '');

  // single trailing break
  // ----------------------------------
  // add an extra line break at the end of the file
  value += UNI.BREAK;

  return value;
}

export function normalizeOutput(value) {
  // Make sure there's only a single blank line at the end
  value = value.replace(new RegExp(`(${RX.BREAKS})+$`, 'g'), UNI.BREAK);

  return value;
}
