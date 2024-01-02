import {COLORS, UNI} from '../_constants';

/**
 * @param {SectionMap} sectionsMap
 * @returns {string}
 */
export function showSpeakers(sectionsMap) {
  let output = '';
  let speakers = [];

  sectionsMap.forEach((section, _timestamp) => {
    if (!section.hasSpeaker)
      return;

    if (section.lines === 1) {
      output += _matchAllSpeakers(speakers, section.content);
      return;
    }

    section.content.split('\n').map(line => {
      if (_speakerMinFontRegex.test(line))
        output += _matchAllSpeakers(speakers, line);
    });
  });

  if (output === '')
    return '----- None / Toggle Speakers -----'

  speakers = speakers
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort((a, b) => a.localeCompare(b));

  output = speakers.join('\n') + '\n\n----------\nInstances\n----------\n\n' + output;

  return output;
}

const _speakerMinFontRegex = new RegExp(`(<font color="#[a-fA-F0-9]+">)|(<\\/font>)`, 'g');
const _speakerOnlyRegex = new RegExp(`<font color="${COLORS.SPEAKER}">([^<]+)(<font color="${COLORS.EFFECTS}">([^<]+)<\\/font>)?<\\/font>`, 'g');

function _matchAllSpeakers(speakers, content) {
  const matches = Array.from(content.matchAll(_speakerOnlyRegex));
  if (matches.length)
    speakers.push(matches[0][1].trim()); // trim whitespace left over from effects matched with speaker
  return content.replace(_speakerMinFontRegex, '') + UNI.BREAK;
}
