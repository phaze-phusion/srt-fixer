import {fontClose, fontTag, undefinedIsEmptyString} from '../_utils';
import {COLORS} from '../_constants';
import {collapseMultilines} from './multiline';

export function sdhInstructions(section, include_sdh) {
  // Clean SDH
  // ----------------------------------
  // Prepare SDH by tagging and upper-casing it
  section.text = section.text.replace(/(\(|\[)([^\]\)]+)(\)|\])/g, _prepSdhReplace);

  // Re-balance multiline
  section = collapseMultilines(section);

  if (include_sdh === true) {
    section.text = section.text.replace(/<%(.*)%>/g, fontTag(COLORS.EFFECTS) + `[$1]` + fontClose);
  } else {
    section.text = section.text.replace(/<%(.*)(?<!%>)%>/g, '');
  }

  section.text = section.text.trim();
  if (section.text.length === 0)
    return;

  return section;
}

const _prepSdhReplace = (match, p1, p2) => {
  p2 = (undefinedIsEmptyString(p2)).toUpperCase().trim();
  return `<%${p2}%>`;
};
