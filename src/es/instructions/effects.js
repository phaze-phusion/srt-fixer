import {COLORS, RX} from '../_constants';
import {fontTagged} from '../_utils';

/**
 * @param {Section} section
 * @param {boolean} includeEffects
 * @returns {Section|undefined}
 */
export function effectsInstructions(section, includeEffects) {
  let content = section.content;

  // Clean Effects
  // ----------------------------------
  content = _prepEffects(content);

  // Return undefined if only empty brackets were found
  if (content.trim() === '<%%>')
    return;

  // Return if there are no effects in content
  if (!/<%/.test(content)) {
    // Update content with possibly empty brackets removed
    section.content = content;
    return section;
  }

  // Fix Effects on multiple lines
  // From
  //   [BELL CHIMES%> <%SNOOPY WHINES]
  // To
  //   [BELL CHIMES]
  //   [SNOOPY WHINES]
  content = content.replace(/(%>) (<%)/g, '$1\n$2');

  if (includeEffects === true) {
    content = content.replace(/<%([^<]+)%>/g, fontTagged(COLORS.EFFECTS, '[$1]'));
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
 * Prepare Effects by tagging and upper-casing it
 * @param {string} content
 * @returns {string}
 * @private
 */
const _prepEffects = content => content.replace(
  /([([])([^\])]+)([)\]])/g,
  (match, p1, p2) => {
    // p1 => first bracket ( or [
    // p3 => last bracket ) or ]
    p2 = p2.toUpperCase().trim();
    return `<%${p2}%>`;
  }
);

const _loneSpeakerDashRegex = new RegExp(`- ?(${RX.BREAK}|$)`, 'g');
