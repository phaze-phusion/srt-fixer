import {RX, UNI} from '../_constants';
import {collapseMultilines} from './multiline';
import {filterOnlyUnique, undefinedIsEmptyString} from '../_utils';

const RX_SPEAKER_RANGE = `[A-ZÉ0-9#&\\. ${RX.DASH}${RX.S_QUOTE}]{2,}`;

export function speakersAndSDH(text, include_sdh, include_speakers, lowercaseSpeakers, color_effects, color_speaker) {
  // CLEAN SPEAKER -------------------------------------
  // Speakers name affixed after other text
  text = text.replace(new RegExp(`([^\\w\\s-]{1}) ?(- )?(${RX_SPEAKER_RANGE}: [^\\s]{1})`, 'g'), `$1${UNI.BREAK}$2$3`);

  // Put speaking text on same line as speaker's name
  text = text.replace(new RegExp(`(- )?(${RX_SPEAKER_RANGE}:)${RX.BREAKS}([^${RX.BREAKS_RANGE}]{1})`, 'g'), '$1$2 $3');

  // Add spaces after speaking dashes (-Lets go > - Lets go)
  text = text.replace(new RegExp(`([${RX.BREAKS_RANGE}]{1}-)([^\\s\-]{1})`, 'g'), '$1 $2');

  // Single speaking line where two is required
  text = text.replace(/(\d{2},\d{3}\r?\n)([^-]{1}[^\r\n]+\r?\n- )/g, '$1- $2');
  text = text.replace(/(\d{2},\d{3}\r?\n-[^\n\r]+\r?\n)([^-]{1}[A-Z]{2,})/g, '$1- $2');


  // SDH SPEAKER -------------------------------------

  // Uppercase and color Hearing Impaired items
  text = text.replace(/([^>]{1})(\(|\[)([^\]\)]+)(\)|\])/g, (match, p1, p2, p3) => {
    p1 = undefinedIsEmptyString(p1);
    p3 = (undefinedIsEmptyString(p3)).toUpperCase().trim();
    return `${p1}<font color="${color_effects}">[${p3}]</font>`;
  });

  // Cater for lowercase speakers
  if (lowercaseSpeakers === true) {
    // Man on radio: It's 9:00 AM
    text = text.replace(new RegExp(`${RX.BREAKS}(- )?(${RX_SPEAKER_RANGE})(:\\s+[^\\s]{1})`, 'ig'), (match, p1, p2, p3) => {
    // text = text.replace(/\n(- )?([A-ZÉ0-9#&\. ]{2,})(:\s+[^\s]{1})/ig, (match, p1, p2, p3) => {
      p1 = undefinedIsEmptyString(p1);
      p2 = (undefinedIsEmptyString(p2)).toUpperCase().trim();
      p3 = (undefinedIsEmptyString(p3)).replace(/:\s+/, ': ');
      return `\n${p1}<font color="${color_speaker}">${p2}</font>${p3}`;
    });

    // Man on radio:
    // It's 9:00 AM
    text = text.replace(new RegExp(`${RX.BREAKS}(- )?(${RX_SPEAKER_RANGE})(:${RX.BREAKS}[^\\s]{1})`, 'ig'), (match, p1, p2, p3) => {
    // text = text.replace(/\n(- )?([A-ZÉ0-9#&\. ]{2,})(:\r?\n[^\s]{1})/ig, (match, p1, p2, p3) => {
      p1 = undefinedIsEmptyString(p1);
      p2 = (undefinedIsEmptyString(p2)).toUpperCase().trim();
      p3 = undefinedIsEmptyString(p3);
      return `\n${p1}<font color="${color_speaker}">${p2}</font>${p3}`;
    });
  }

  // Speaker and SDH in wrong order, eg:
  // <font color="${COLOR.EFFECTS}">[chuckles]</font> ADAM:
  text = text.replace(new RegExp(`(<font color="${color_effects}">[^<]+<\\/font>)([\\s]+)?(${RX_SPEAKER_RANGE})(: [^\\s]{1})`, 'g'), '$3 $1$4');

  // Uppercase and color Speaking items
  text = text.replace(new RegExp(`(- )?(${RX_SPEAKER_RANGE})(:\\s+[^\\s]{1})`, 'g'), (match, p1, p2, p3, offset, string) => {
  // text = text.replace(/(- )?([A-ZÉ0-9#&\. ]{2,})(:\s+[^\s]{1})/g, (match, p1, p2, p3, offset, string) => {
    p1 = undefinedIsEmptyString(p1);
    p2 = (undefinedIsEmptyString(p2)).toUpperCase().trim();
    p3 = (undefinedIsEmptyString(p3)).replace(/:\s+/, ': ');
    return `${p1}<font color="${color_speaker}">${p2}</font>${p3}`;
  });

  text = text.replace(new RegExp(`(${RX.BREAKS})(- )?(${RX_SPEAKER_RANGE}) <font color="${color_effects}">([^<]+)<\\/font>(:\\s{1})`, 'g'),
    (match, p1, p2, p3, p4, p5) => {
      p1 = undefinedIsEmptyString(p1);
      p2 = undefinedIsEmptyString(p2);
      p3 = (undefinedIsEmptyString(p3)).toUpperCase().trim();
      p4 = (undefinedIsEmptyString(p4)).toUpperCase().trim();
      p5 = undefinedIsEmptyString(p5);
      return `${p1}${p2}<font color="${color_speaker}">${p3}</font> <font color="${color_effects}">${p4}</font>${p5}`;
    });

  // Fix Mac<>DONALD<>: to <>MacDONALD<>:
  // Fix MARY-<>ANNE<>: to <>MARY-ANNE<>:
  text = text.replace(new RegExp(`([\\w-]+)(<font color="${color_speaker}">)(\\w+)`, 'g'), '$2$1$3');

  // Fix O'<>NEIL<>: to <>O'NEIL<>:
  // Fix T'<>POL<>: to <>T'POL<>:
  // Fix ZHO'<>KAAN<>: to <>ZHO'KAAN<>:
  text = text.replace(new RegExp(`([A-Z]+${RX.S_QUOTE})(${RX.BREAKS})?(<font color="${color_speaker}">)([A-Z]{2,}\\w+)`, 'g'), '$3$1$4');

  // Fix WOMAN' <>S VOICE<>: to <>WOMAN'S VOICE<>:
  text = text.replace(new RegExp(`([\\w-]+)${RX.S_QUOTE}(${RX.BREAKS})?(<font color="${color_speaker}">)([Ss])`, 'g'), `$3$1'$4`);

  // Fix MRS. <>SMITH<>: to <>MRS. SMITH<>:
  text = text.replace(new RegExp(`(MRS?\\.)((${RX.BREAKS})| )(<font color="${color_speaker}">)(\\w+)`, 'g'), '$4$1 $5');

  // Fix DR. <>SMITH<>: to <>DR. SMITH<>:
  text = text.replace(new RegExp(`([A-Z]{2}\\.)((${RX.BREAKS})| )(<font color="${color_speaker}">)(\\w+)`, 'g'), '$4$1 $5');

  // Add space between punctuation and '<font' tag
  text = text.replace(/([\.\?!,])(<font)/g, '$1 $2');

  // remove hearing impaired
  if (include_sdh !== true) {
    text += UNI.BREAK;

    text = text.replace(new RegExp(`([^ ]<font color="${color_effects}">\\[[^\\)\\]]+\\]<\\/font>):`, 'g'), '$1');

    text = text.replace(/\d+\r?\n\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}\r?\n(<font[^<]+<\/font>\r?\n)\r?\n/g, '');
    text = text.replace(new RegExp(`(${RX.BREAKS})?${RX.DASH}? ?<font color="${color_effects}">[^<]+<\\/font>(${RX.BREAKS})`, 'g'), '$2');

    text = text.replace(/(\n)(<font[^<]+<\/font>\r?\n)/g, '$1');
    text = text.replace(new RegExp(`(${RX.BREAKS})(<font color="${color_effects}"[^<]+<\\/font>\\s+)`, 'g'), '$1');
    text = text.replace(new RegExp(`(\\s)<font color="${color_effects}">[^<]+<\\/font>( )`, 'g'), '$1');
    text = text.replace(new RegExp(`( )<font color="${color_effects}">[^<]+<\\/font>:`, 'g'), ':');

    // Lonely lines of musical notes
    text = text.replace(new RegExp(`${RX.ID_TIME_BREAK}${RX.NOTE_1} ${RX.NOTE_1}(${RX.BREAKS}){2}`, 'g'), '');

    // Remove speaking dash for time-code with one-liner
    text = text.replace(new RegExp(`(${RX.ID_TIME_BREAK})${RX.DASH} ([^${RX.BREAKS_RANGE}]+(${RX.BREAKS}){2})`, 'g'), '$1$2');

    // Remove Timecodes without any text
    text = text.replace(new RegExp(`${RX.ID_TIME_BREAK}(${RX.BREAKS}){1,}`, 'g'), '');

    // Blank last entry in file
    // text = text.replace( new RegExp(`(${RX.BREAKS})${RX.ID_TIME_BREAK}(${RX.BREAKS})+$`, 'g'), '$1');

    // Too Few Characters Per Line AGAIN
    text = collapseMultilines(text);
  }

  if (include_speakers !== true) {
    text += UNI.BREAK;

    // Replace speakers on 2 lines with dashes
    // e.g.
    //   ARCHER: Say when.
    //   TUCKER: When.
    // becomes
    //   - Say when.
    //   - When.
    const regExSpeakersOnMultiline = new RegExp(
      `<font color="${color_speaker}">[^<]+<\\/font>: ([^${RX.BREAKS_RANGE}]+${RX.BREAKS})`
      + `<font color="${color_speaker}">[^<]+<\\/font>: ([^${RX.BREAKS_RANGE}]+)`,
      'g'
    )
    text = text.replace(regExSpeakersOnMultiline, `${UNI.DASH} $1${UNI.DASH} $2`);

    text = text.replace(new RegExp(`<font color="${color_speaker}">[^<]+<\\/font>:[${RX.BREAKS_RANGE} ]`, 'g'), '');
  }

  // remove speaking dash for time-code with one-liner [RARE]
  text = text.replace(new RegExp(`(${RX.ID_TIME_BREAK})${RX.DASH} ([^${RX.BREAKS_RANGE + RX.DASH}]+(${RX.BREAKS}){2})`, 'g'), '$1$2');

  return text;
}

export function showSdh(text, color_effects) {
  let matches = text.match(new RegExp(`${RX.BREAKS}([^${RX.BREAKS_RANGE}]+)?<font color="${color_effects}">.+(${RX.BREAKS}.+)?<\\/font>([^${RX.BREAKS_RANGE}]+)?${RX.BREAKS}`, 'g')) || [];

  // if (matches.length === 0) {
  //   matches = this.workingValue.match(new RegExp(`${RX.BREAKS}([^${RX.BREAKS_RANGE}]+)?<font color="${this.colorEffects}">.+(${RX.BREAKS}.+)?<\\/font>([^${RX.BREAKS_RANGE}]+)?${RX.BREAKS}`, 'g')) || [];
  // }

  if (matches.length !== 0) {
    matches = matches.map(caught => {
      caught = caught.replace(new RegExp(`(<font color="${color_effects}">)|(<\\/font>)`, 'g'), '');
      caught = caught.replace(new RegExp(`(\\S)${RX.BREAKS}(\\S)`, 'g'), '$1 $2');
      return caught.replace(new RegExp(`((^${RX.BREAKS})|(${RX.BREAKS}$))`, 'g'), '');
    });
    return matches.join(UNI.BREAK);
  } else {
    return '----- Toggle SDH -----';
  }

}

export function showSpeakers(text, color_speaker) {
  let matches = text.match(new RegExp(`${RX.BREAKS}([^${RX.BREAKS_RANGE}]+)?<font color="${color_speaker}">.+(${RX.BREAKS}.+)?<\\/font>([^${RX.BREAKS_RANGE}]+)?${RX.BREAKS}`, 'g')) || [];
  if (matches.length !== 0) {
    matches = matches.map(caught => {
      caught = caught.replace(new RegExp(`(<font color="${color_speaker}">)|(<\\/font>)`, 'g'), '');
      caught = caught.replace(/\n-\s+/g, '\n');
      caught = caught.replace(/(\S)\r\n(\S)/g, '$1 $2');
      caught = caught.replace(/((^\r?\n)|(\r?\n$))/g, '');
      return caught;
    });
    matches = matches.join(UNI.BREAK);

    let uniques = matches.split(`${UNI.BREAK}`);
    uniques = uniques.map(caught => {
      caught = caught.replace(/^<font.*/, '');
      caught = caught.replace(/ <font.*/, ''); // remove effect from speaker line
      caught = caught.replace(/:.*/, '');
      return caught;
    });

    uniques = uniques.filter(filterOnlyUnique);

    uniques = uniques.sort((a, b) => (a > b) ? 1 : ((b < a) ? -1 : 0));

    // caught = caught.replace(/:.*$/, '');

    return uniques.join(UNI.BREAK);
  }
  return '----- Toggle SDH / NONE -----';
}
