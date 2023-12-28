import {fontClose, fontTag, undefinedIsEmptyString} from '../_utils';
import {COLORS, RX} from '../_constants';
import {collapseMultilines} from './multiline';

export function sdhInstructions(section, include_sdh) {
  // Clean SDH
  // ----------------------------------
  // Prepare SDH by tagging and upper-casing it
  section.text = section.text.replace(/(\(|\[)([^\]\)]+)(\)|\])/g, _prepSdhReplace);

  // Re-balance multiline
  section = collapseMultilines(section);

  // Fix SHD on multiple lines
  // From
  //   [BELL CHIMES%> <%SNOOPY WHINES]
  // To
  //   [BELL CHIMES]
  //   [SNOOPY WHINES]
  section.text = section.text.replace(/(%>) (<%)/g, '$1\n$2');

  if (include_sdh === true) {
    section.text = section.text.replace(/<%([^<]+)%>/g, _sdhReplace);
  } else {
    section.text = section.text.replace(/<%([^<]+)%>/g, '');
  }

  // Remove lone speaker dash after SDH was removed
  section.text = section.text.replace(_loneSpeakerDashRegex, '');

  section.text = section.text.trim();
  if (section.text.length === 0)
    return;

  return section;
}

const _prepSdhReplace = (match, p1, p2) => {
  p2 = (undefinedIsEmptyString(p2)).toUpperCase().trim();
  return `<%${p2}%>`;
};

const _loneSpeakerDashRegex = new RegExp(`(^|${RX.BREAK})- ${RX.BREAK}`, 'g');
const _sdhReplace = fontTag(COLORS.EFFECTS) + `[$1]` + fontClose;
