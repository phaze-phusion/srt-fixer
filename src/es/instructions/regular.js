import {RX, UNI} from '../_constants';
import {undefinedIsEmptyString} from "../_utils";

export const regularClean = (value, cleanCorruptChars) => {
  // pre clean font tags
  value = value.replace(/<font color="?#[0-9A-F]{6}"?>([^<]+)<\/font>/g, '$1');

  // punctuation without spaces
  value = value.replace(new RegExp(`(([a-z]|[^${RX.BREAKS_RANGE}]\\.{2})[.?\\]!])([A-Z])`, 'g'), `$1${UNI.BREAK}$3`);

  if (cleanCorruptChars) {
    value = _i_fixes(value);
    value = _ansi_fixes(value);
  }

  value = _quotation_fixes(value);
  value = _acronyms(value);

  // sticky punctuation
  value = value.replace(/([a-z][.?!,])([a-z])/ig, '$1 $2');

  // spaced out punctuation
  value = value.replace(/(\w) +([.?!,])/ig, '$1$2');

  value = _dashesAndEllipsis(value);
  value = _cleanSpeakers(value);
  value = _collapseMultilines(value);

  return value;
}

function _quotation_fixes( text ) {
  // replace funky quotation marks
  text = text.replace(/[\u00b4\u0060\u2018\u2019\u201a\u201b]/g, "'");
  text = text.replace(/[\u201c\u201d\u201e\u201f]/g, '"');

  return text;
}

function _i_fixes( text ){

  // Fix pronoun "I" derivatives
  // * Matches
  //     I I'd I'll I'm I've
  //     If In Is It It'd It's Its
  // * select "match (letter)case" to not match eg LTD, LSD
  // * Won't match:
  //     Acronyms: ld (Id), l.P (I.P), lQ (IQ), lR (IR),
  //     Roman Numerals: lI (II), lV (IV), lX (IX)
  // text = text.replace(/([\s">\[-]{1}|[\.]{3})[l]{1}([flnst]?'?)([dms]{1}|ll|ve)?([\s\-\.\?:!–,—]{1})/g, '$1I$2$3$4');
  text = text.replace( new RegExp( `([\\s">\\[${RX.DASH}]{1}|[\\.]{3})[l]{1}([flnst]?'?)([dms]{1}|ll|ve)?([\\s\\.\\?:!,${RX.DASH}${RX.N_DASH}${RX.M_DASH}]{1})`, 'g'), '$1I$2$3$4');

  // i'd i'm i've i'll
  text = text.replace( new RegExp( `([\\s">\\[${RX.DASH}]{1}|[\\.]{3})[i]{1}'([dm]{1}|ll|ve)?([\\s\\.\\?:!,${RX.DASH}${RX.N_DASH}${RX.M_DASH}]{1})`, 'g'), '$1I$2$3');

  // Fix words starting with capital "I"
  // * Matches
  //     lnfo lraq lntelligence lts lsn't
  //     lCU (ICU), lKEA, lOU (IOU)
  // * Does not match
  // 	lllegitimate
  // 	llya (Ilya)
  // 	lnsight
  // * Should not match llama (Llama)
  text = text.replace( new RegExp( `([\\s\\."\\[>${RX.DASH}]{1})[l]{1}([bcdfghjkmnpqrstvwxzA-Z]{1}((n't)|\\w)+[\\s\\.\\?!":;,${RX.DASH}${RX.N_DASH}${RX.M_DASH}]{1})`, 'g'), '$1I$2');

  // Fix all-caps words containing "I"
  // * Matches
  //     MlA PHOENlX Ml6
  // * Strange case: Al/AI
  //  Al (eg. Al Gore) vs AI (Artificial Inteligence)
  //  Always assume Al is a name
  const al_regex = new RegExp(`Al([\\.\\?!":;,${RX.DASH}${RX.N_DASH}${RX.M_DASH} ]){1}` , 'g');
  const al_the_name = (text.match( al_regex ) || []).length !== 0;

  if( al_the_name )
    text = text.replace( al_regex, 'A%%L$1')

  text = text.replace( new RegExp(`([A-Z]+)l([0-9A-Z]+|[\\.\\?!":;, ${RX.DASH}${RX.N_DASH}${RX.M_DASH}]{1})` , 'g'), '$1I$2');

  if( al_the_name ) {
    text = text.replace( new RegExp(`A%%L([\\.\\?!":;, ${RX.DASH}${RX.N_DASH}${RX.M_DASH}]){1}` , 'g'), 'Al$1');
    // write a note to the developers console
    // UI_CONSOLE.print('<strong class="text-danger">Al</strong> the name was found. Ensure this is not meant to be <strong class="text-warning">A.I.</strong>' );
  }

  // l between all-cap SDH
  text = text.replace(/([A-Z]+)l([A-Z]+)/g, `$1I$2`);
  text = text.replace(/l([A-Z]{3,})/g, `I$1`);
  text = text.replace(/lN( [A-Z]{3,})/g, `IN$1`);

  // non capital i
  text = text.replace(/(\s)i(\s)/g, '$1I$2');

  // spaced I - I's
  text = text.replace(/(\sI) - (I\s)/g, `$1${UNI.N_DASH}$2`);

  return text;
}

function _ansi_fixes( text ) {
  text = text.replace(/\u00ce\u2018/g, 'A'); // Greek Alpha
  text = text.replace(/\u00ce\u2019/g, 'B'); // Greek Beta
  text = text.replace(/\u00ce\u2022/g, 'E'); // Greek Epsilon
  text = text.replace(/\u00ce\u2013/g, 'Z'); // Greek Zeta
  text = text.replace(/\u00ce\u2014/g, 'H'); // Greek Eta
  text = text.replace(/\u00ce\u2122/g, 'I'); // Greek Iota
  text = text.replace(/\u00ce\u0161/g, 'K'); // Greek Kappa
  text = text.replace(/\u00ce\u0153/g, 'M'); // Greek Mu
  text = text.replace(/\u00ce\x9d/g,   'N'); // Greek Nu
  text = text.replace(/\u00ce\u0178/g, 'O'); // Greek Omicron
  text = text.replace(/\u00ce\u00a1/g, 'P'); // Greek Rho
  text = text.replace(/\u00ce\u00a4/g, 'T'); // Greek Tau
  text = text.replace(/\u00ce\u00a5/g, 'U'); // Greek Upsilon
  text = text.replace(/\u00ce\u00a7/g, 'X'); // Greek Chi

  text = text.replace(/\u00c3\u00a9/g, '\u00e9'); // é

  text = text.replace(/\ufb01/g, 'fi'); // ﬁ
  text = text.replace(/\ufb01/g, 'fl'); // ﬂ // can sometime manifest in place of [L e.g. [LAUGHS]


  text = text.replace(/(\u00d0\u00a1)|\u03F9|\u0421/g, 'C'); // Greek Lunate Sigma Symbol, Cyrillic Letter Es

  return text;
}

// Acronyms eg. SWAT CIA ETA FBI ID US
function _acronyms( text ) {
  const case_sensitive_acronyms   = ['ID','LA','PA','US','CIA','ETA','FBI','USA','SWAT'];
  const case_INsensitive_acronyms = ['am','pm','aka'];

  case_INsensitive_acronyms.map(item => {
    case_sensitive_acronyms.push( item.toLowerCase() );
    case_sensitive_acronyms.push( item.toUpperCase() );
  });

  const acronyms = case_sensitive_acronyms.map( word => {
    return '(' + word.split('').join('\\.') + ')';
  });

  const rx = new RegExp( '(\\W)(' + acronyms.join('|') + ')(\\.)?', 'g' );
  text = text.replace( rx, ( match, p1, p2 ) => {
    return undefinedIsEmptyString(p1) + ( p2.toUpperCase().replace(/\./g, '') );
  });

  return text;
}

function _dashesAndEllipsis( text ) {
  // Lonely underscores _ [ONLY ON SERIES]
  text = text.replace( new RegExp(`${RX.ID_TIME_BREAK}_+(${RX.BREAKS}){2}`, 'g'), '');

  // m-dashes between words
  text = text.replace( new RegExp(`(\\w)${RX.M_DASH}(\\w)`, 'g'), `$1${UNI.N_DASH}$2`);

  // Fix En-dashes (Uh-- to Uh–) (ALT+0150)
  //               (Th -- to Th–) (ALT+0150)
  text = text.replace( new RegExp(`(\\w) ${RX.DASH}${RX.DASH} (\\w)`, 'g'), `$1${UNI.N_DASH} $2`);
  text = text.replace( new RegExp(`(\\w) ${RX.DASH}+(${RX.BREAKS})`, 'g'), `$1${UNI.N_DASH}$2`);
  text = text.replace(/(\w) -+(\r?\n)/g, `$1${UNI.N_DASH}$2`);
  text = text.replace(/(\w)((-{2})|(- -)|(â€“))([^>]{1})/g, `$1${UNI.N_DASH}$6`);

  // Spaced ellipsis
  text = text.replace(/(\. ?\. ?\.)/g, '...');
  text = text.replace(/(\r?\n)(- )?( ?\.{3} ?)(\w)/g, '$1$2...$4');
  text = text.replace(/(\w)( ?\.{3} ?)(\r?\n)/g, '$1...$3');

  // Too many dots
  text = text.replace(/(\.{4,})/g, '...');

  return text;
}

function _cleanSpeakers( text ) {
  // Speakers name affixed after other text
  text = text.replace(/([^\w\s-]{1}) ?(- )?([A-Z0-9#&. ]{2,}: [^\s]{1})/g, `$1${UNI.BREAK}$2$3`);

  // Put speaking text on same line as speaker's name
  text = text.replace(/(- )?([A-Z0-9#&. ]{2,}:)\r?\n([^\r\n]{1})/g, '$1$2 $3');

  // Add spaces after speaking dashes (-Lets go > - Lets go)
  text = text.replace(/([\r\n]{1}-)([^\s\-]{1})/g, '$1 $2');

  // Single speaking line where two is required
  text = text.replace(/(\d{2},\d{3}\r?\n)([^-]{1}[^\r\n]+\r?\n- )/g, '$1- $2');
  text = text.replace(/(\d{2},\d{3}\r?\n-[^\n\r]+\r?\n)([^-]{1}[A-Z]{2,})/g, '$1- $2');

  return text;
}

function _collapseMultilines( str, minimum = 4, maximum = 33 ) {
  for( let s = minimum, e = maximum, rx; s <= maximum; s++, e-- ) {
    rx = new RegExp( `(${RX.BREAKS}[<\\/>', \\[\\(\\w${RX.DASH + RX.NOTE_1 + RX.NOTE_2}]{3,${s}})${RX.BREAKS}([<\\/>!', \\]\\)\\w\\.\\?${RX.DASH + RX.N_DASH + RX.NOTE_1 + RX.NOTE_2};]{3,${e}}${RX.BREAKS})`, 'g' );
    str = str.replace(rx, '$1 $2');

    rx = new RegExp( `(${RX.BREAKS}[<\\/>', \\[\\(\\w${RX.DASH + RX.NOTE_1 + RX.NOTE_2};]{2,5}[\\?\\.!${RX.N_DASH} ][<\\/>', \\w${RX.DASH}]{1,${s-3}})${RX.BREAKS}([<\\/>!', \\]\\)\\w\\.\\?${RX.DASH + RX.N_DASH + RX.NOTE_1 + RX.NOTE_2};]{3,${e}}${RX.BREAKS})`, 'g' );
    str = str.replace(rx, '$1 $2');

    // special cases for when italics are present or not removed
    rx = new RegExp( `(${RX.BREAKS}<i>[<\\/>', \\[\\(\\w${RX.DASH + RX.NOTE_1 + RX.NOTE_2}]{3,${s}}<\\/i>)${RX.BREAKS}([<\\/>!', \\]\\)\\w\\.\\?${RX.DASH + RX.N_DASH + RX.NOTE_1 + RX.NOTE_2};]{3,${e}}${RX.BREAKS})`, 'g' );
    str = str.replace(rx, '$1 $2');

    rx = new RegExp( `(${RX.BREAKS}[<\\/>', \\[\\(\\w${RX.DASH + RX.NOTE_1 + RX.NOTE_2}]{3,${s}})${RX.BREAKS}(<i>[<\\/>!', \\]\\)\\w\\.\\?${RX.DASH + RX.N_DASH + RX.NOTE_1 + RX.NOTE_2};]{3,${e}}<\\/i>${RX.BREAKS})`, 'g' );
    str = str.replace(rx, '$1 $2');
  }
  return str;
}
