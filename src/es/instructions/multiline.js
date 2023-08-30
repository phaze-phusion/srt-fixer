import {RX} from "../_constants";
import {updateLineCount} from '../_utils';

const _collapseRegexRange1 = `[<\\/>%', \\[\\(\\w${RX.DASH + RX.NOTE_1 + RX.NOTE_2};]`;
const _collapseRegexRange2 = `[<\\/>%!', \\]\\)\\w\\.\\?${RX.DASH + RX.N_DASH + RX.NOTE_1 + RX.NOTE_2};]`;
const _collapseRegexRange3 = `[\\?\\.!${RX.N_DASH} ][<\\/>%', \\w${RX.DASH}]`;

export function collapseMultilines( section, minimum = 4, maximum = 33 ) {
  for( let s = minimum, e = maximum; s <= maximum; s++, e-- ) {
    section.text = section.text.replace(new RegExp( `^(${_collapseRegexRange1}{3,${s}})${RX.BREAK}(${_collapseRegexRange2}{3,${e}})$`, 'g' ), '$1 $2');
    section.text = section.text.replace(new RegExp( `^(${_collapseRegexRange1}{2,5}${_collapseRegexRange3}{1,${s-3}})${RX.BREAK}(${_collapseRegexRange2}{3,${e}})$`, 'g' ), '$1 $2');
  }
  return updateLineCount(section);
}
