import {COLORS, RX, UNI} from '../_constants';
import {fontClose, fontTag} from '../_utils';
import {collapseMultilines} from './multiline';

/**
 * @param {Section} section
 * @param {boolean} includeSpeakers
 * @param {boolean} lowercaseSpeakers
 * @returns {Section}
 */
export function speakersInstructions(section, includeSpeakers, lowercaseSpeakers) {
  let content = section.content;
  // CLEAN SPEAKER -------------------------------------
  // Speakers name affixed after other text
  // content = content.replace(_cleanSpeakerRegex1, `$1${UNI.BREAK}$2$3`);

  // Put speaking text on same line as speaker's name
  content = content
      .replace(_speakerOneLineRegex, '$1$2 ')

  // Add spaces after speaking dashes (-Lets go > - Lets go)
      .replace(_spaceSpeakerDashRegex, '$1 $3');

  // Single speaking line where two is required
  // content = content.replace(_cleanSpeakerRegex4, '- $2');
  // content = content.replace(_cleanSpeakerRegex5, '$1- $2');

  // Cater for lowercase speakers
  if (lowercaseSpeakers === true) {
    // Man on radio: It's 9:00 AM
    content = content.replace(_lowercaseSpeakerRegex, _lowercaseSpeakerReplacer);
  }

  // Speaker and SDH in wrong order, eg:
  // <font color="${COLOR.EFFECTS}">[chuckles]</font> ADAM:
  content = content
      .replace(_wrongOrderRegex, '$3 $1:')

  // Prepare speaking items
      .replace(_prepSpeakerRegex, _prepSpeakerReplacer)

  // Fix certain speakers being cut-off
  // Test
  //   const a = [
  //     `Mac<%DONALD%>: `,
  //     `MARY-<%ANNE%>: `,
  //     `O'<%NEIL%>: `,
  //     `T'<%POL%>: `,
  //     `ZHO'<%KAAN%>: `,
  //     `WOMAN'<%S VOICE%>: `,
  //     `MRS. <%SMITH%>: `,
  //     `DR. <%SMITH%>: `,
  //   ];
  //   for (let i = 0; i < a.length; i++)
  //     a[i] = a[i].replace(/(\w+('|-|(\. ))?)(<%)/g, '$4$1');
  //   console.log(a);
      .replace(/(\w+('|-|(\. ))?)\n?(<%)/g, '$4$1')

  // remove speaking dash for time-code with one-liner [RARE]
      .replace(/^- (.*)(?<!\n)$/, '$1')

  // Add speaking dashes for multiline where one of the lines don't have a speaker
  // Test
  //   const a = [
  //     `- Base to alpha.\n<%ALPHA%>: Yes, base.`,
  //     `<%ALPHA%>: Over,\n- We hear you.`,
  //     `- <%HQ%>: Are you there?\n<%ALPHA%>Roger.`, // weird case but should not match
  //     `<%HQ%>: Are you there?\n- <%ALPHA%>Roger.`, // weird case but should not match
  //   ];
  //   for (let i = 0; i < a.length; i++) {
  //     a[i] = a[i].replace(/^(- (?!<%)[^\n]+\n)(<%)/g, '$1- $2');
  //     a[i] = a[i].replace(/^(<%[^\n]+\n)(- (?!<%).*)$/g, '- $1$2');
  //     console.log(a[i]);
  //   }
      .replace(/^(- (?!<%)[^\n]+\n)(<%)/g, '$1- $2')
      .replace(/^(<%[^\n]+\n)(- (?!<%).*)$/g, '- $1$2');

  // console.log(section.content, section.content.match(/^- [^\n]+\n<%/g));

  // Update section content before we either return it or collapse the multilines
  section.content = content;

  // Return if there are no speakers in section text
  if (!/<%/.test(content))
    return section;

  if (includeSpeakers === true) {
    content = content.replace(/<%(.*)%>/g, fontTag(COLORS.SPEAKER) + '$1' + fontClose);
  } else {
    // Replace speakers on 2 lines with dashes
    // e.g.
    //   ARCHER: Say when.
    //   TUCKER: When.
    // becomes
    //   - Say when.
    //   - When.
    content = content.replace(_removeSpeakersOnMultilineRegex, `${UNI.DASH} $1${UNI.DASH} $2`);
    content = content.replace(/<%(.*)(?<!%>)%>:[\n ]/g, '');
  }

  section.content = content.trim();

  // Re-balance multiline
  section = collapseMultilines(section);

  return section;
}

const RX_SPEAKER_RANGE = `[A-ZÉ0-9#&\\. ${RX.DASH}${RX.S_QUOTE}]{2,}`;
const _speakerOneLineRegex = new RegExp(`(- )?(${RX_SPEAKER_RANGE}:)${RX.BREAK}`, 'g');
const _spaceSpeakerDashRegex = new RegExp(`((^|${RX.BREAK})-)([^\\s\-]{1})`, 'g');
// const _cleanSpeakerRegex1 = new RegExp(`([^\\w\\s-]{1}) ?(- )?(${RX_SPEAKER_RANGE}: [^\\s]{1})`, 'g');
// const _cleanSpeakerRegex4 = new RegExp(`^([^-]{1}[^${RX.BREAK}]+${RX.BREAK}- )`, 'g');
// const _cleanSpeakerRegex5 = new RegExp(`^(-[^${RX.BREAK}]+${RX.BREAK})([^-]{1}[A-Z]{2,})`, 'g');

const _lowercaseSpeakerRegex = new RegExp(`((^|${RX.BREAK})- )?(${RX_SPEAKER_RANGE}):\\s+`, 'ig');
const _lowercaseSpeakerReplacer = (match, p1, p2, p3) => {
  p3 = p3.toUpperCase().trim();
  return `${p1 ?? ''}<%${p3}%>: `;
};

const _wrongOrderRegex = new RegExp(`(${fontTag(COLORS.EFFECTS)}[^<]+${RX.FONT_CLOSE})(\\s+)?(${RX_SPEAKER_RANGE}):`, 'g');

const _prepSpeakerRegex = new RegExp(`(- )?(${RX_SPEAKER_RANGE})( ${fontTag(COLORS.EFFECTS)}[^<]+${RX.FONT_CLOSE})?:\\s+`, 'g');
const _prepSpeakerReplacer = (match, p1, p2, p3) => {
  p2 = p2.toUpperCase().trim();
  return `${p1 ?? ''}<%${p2}${p3 ?? ''}%>: `;
};

const _removeSpeakersOnMultilineRegex = new RegExp(`^<%.*%>: ([^${RX.BREAK}]+${RX.BREAK})<%.*%>: (.*)$`,'g');

// const _uppercaseSpeakerRegexOne = new RegExp(`(- )?(${RX_SPEAKER_RANGE}):\\s+`, 'g');
// const _uppercaseSpeakerReplacerOne = (match, p1, p2) => {
//   p1 = undefinedIsEmptyString(p1);
//   p2 = p2.toUpperCase().trim();
//   return p1 + fontTag(COLORS.SPEAKER) + p2 + fontClose + p3;
// };
//
// const _uppercaseSpeakerRegexTwo = new RegExp(`(- )?(${RX_SPEAKER_RANGE}) ${fontTag(COLORS.EFFECTS)}([^<]+)${RX.FONT_CLOSE}(:\\s{1})`, 'g');
// const _uppercaseSpeakerReplacerTwo = (match, p1, p2, p3, p4) => {
//   p1 = undefinedIsEmptyString(p1);
//   p2 = (undefinedIsEmptyString(p2)).toUpperCase().trim();
//   p3 = (undefinedIsEmptyString(p3)).toUpperCase().trim();
//   p4 = undefinedIsEmptyString(p4);
//   return p1 + fontTag(COLORS.SPEAKER) + p2 + fontClose + ' ' + fontTag(COLORS.EFFECTS) + p3 + fontClose + p4;
// };
