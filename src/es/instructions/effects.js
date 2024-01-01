import {fontClose, fontTag} from '../_utils';
import {COLORS, RX} from '../_constants';

/**
 * @param {Section} section
 * @param {boolean} include_effects
 * @returns {Section|undefined}
 */
export function effectsInstructions(section, include_effects) {
  let content = section.content;

  // Clean SDH
  // ----------------------------------
  // Prepare SDH by tagging and upper-casing it
  content = content.replace(/([(\[])([^\])]+)([)\]])/g, _prepSdhReplace);

  // Return if there are no SDH in section text
  if (!/<%/.test(content))
    return section;

  // Fix SHD on multiple lines
  // From
  //   [BELL CHIMES%> <%SNOOPY WHINES]
  // To
  //   [BELL CHIMES]
  //   [SNOOPY WHINES]
  content = content.replace(/(%>) (<%)/g, '$1\n$2');

  if (include_effects === true) {
    content = content.replace(/<%([^<]+)%>/g, _sdhReplace);
  } else {
    content = content.replace(/<%([^<]+)%> ?/g, '');
  }

  // Remove lone speaker dash after SDH was removed
  content = content.replace(_loneSpeakerDashRegex, '');

  content = content.trim();
  if (content.length === 0)
    return;

  section.content = content;
  return section;
}

/**
 * @param {string} match
 * @param {string} p1
 * @param {string} p2
 * @returns {`<%${string}%>`}
 * @private
 */
const _prepSdhReplace = (match, p1, p2) => {
  // p1 => first bracket ( or [
  // p3 => last bracket ) or ]
  p2 = (p2 ?? '').toUpperCase().trim();
  return `<%${p2}%>`;
};

const _loneSpeakerDashRegex = new RegExp(`- ?(${RX.BREAK}|$)`, 'g');
const _sdhReplace = fontTag(COLORS.EFFECTS) + `[$1]` + fontClose;
