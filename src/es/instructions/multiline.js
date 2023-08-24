import {RX} from "../_constants";

export function collapseMultilines( str, minimum = 4, maximum = 33 ) {
  for( let s = minimum, e = maximum, rx; s <= maximum; s++, e-- ) {
    str = str.replace(new RegExp( `(${RX.BREAKS}[<\\/>', \\[\\(\\w${RX.DASH + RX.NOTE_1 + RX.NOTE_2}]{3,${s}})${RX.BREAKS}([<\\/>!', \\]\\)\\w\\.\\?${RX.DASH + RX.N_DASH + RX.NOTE_1 + RX.NOTE_2};]{3,${e}}${RX.BREAKS})`, 'g' ), '$1 $2');
    str = str.replace(new RegExp( `(${RX.BREAKS}[<\\/>', \\[\\(\\w${RX.DASH + RX.NOTE_1 + RX.NOTE_2};]{2,5}[\\?\\.!${RX.N_DASH} ][<\\/>', \\w${RX.DASH}]{1,${s-3}})${RX.BREAKS}([<\\/>!', \\]\\)\\w\\.\\?${RX.DASH + RX.N_DASH + RX.NOTE_1 + RX.NOTE_2};]{3,${e}}${RX.BREAKS})`, 'g' ), '$1 $2');

    // special cases for when italics are present or not removed
    str = str.replace(new RegExp( `(${RX.BREAKS}<i>[<\\/>', \\[\\(\\w${RX.DASH + RX.NOTE_1 + RX.NOTE_2}]{3,${s}}<\\/i>)${RX.BREAKS}([<\\/>!', \\]\\)\\w\\.\\?${RX.DASH + RX.N_DASH + RX.NOTE_1 + RX.NOTE_2};]{3,${e}}${RX.BREAKS})`, 'g' ), '$1 $2');

    str = str.replace(new RegExp( `(${RX.BREAKS}[<\\/>', \\[\\(\\w${RX.DASH + RX.NOTE_1 + RX.NOTE_2}]{3,${s}})${RX.BREAKS}(<i>[<\\/>!', \\]\\)\\w\\.\\?${RX.DASH + RX.N_DASH + RX.NOTE_1 + RX.NOTE_2};]{3,${e}}<\\/i>${RX.BREAKS})`, 'g' ), '$1 $2');
  }
  return str;
}
