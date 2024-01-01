import {UNI} from '../_constants';

/**
 * @param {SectionMap} sectionsMap
 * @returns {string}
 */
export function showEffects(sectionsMap) {
  let output = '';

  sectionsMap.forEach((section, _timestamp) => {
    if (!section.hasEffect)
      return;

    if (section.lines === 1) {
      output += section.content.replace(_effectMinFontRegex, '') + UNI.BREAK;
      return;
    }

    section.content.split('\n').map(line => {
      if (_effectMinFontRegex.test(line))
        output += line.replace(_effectMinFontRegex, '') + UNI.BREAK;
    });
  });

  return output !== '' ? output : '----- Toggle Effects -----';
}

const _effectMinFontRegex = new RegExp(`(<font color="#[a-fA-F0-9]+">)|(<\\/font>)`, 'g');
