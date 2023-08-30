import {COLORS, RX, UNI} from '../_constants';

const sdhRegex = new RegExp(`${RX.BREAK}([^${RX.BREAK}]+)?<font color="${COLORS.EFFECTS}">.+(${RX.BREAK}.+)?<\\/font>([^${RX.BREAK}]+)?${RX.BREAK}`, 'g');
const sdhOutRegex1 = new RegExp(`(<font color="${COLORS.EFFECTS}">)|(<\\/font>)`, 'g');
const sdhOutRegex2 = new RegExp(`(\\S)${RX.BREAK}(\\S)`, 'g');
const sdhOutRegex3 = new RegExp(`((^${RX.BREAK})|(${RX.BREAK}$))`, 'g');

export function showSdh(text) {
  let matches = text.match(sdhRegex) || [];

  if (matches.length !== 0) {
    matches = matches.map(
      caught => {
        caught = caught.replace(sdhOutRegex1, '');
        caught = caught.replace(sdhOutRegex2, '$1 $2');
        return caught.replace(sdhOutRegex3, '');
      }
    );
    return matches.join(UNI.BREAK);
  } else {
    return '----- Toggle SDH -----';
  }
}
