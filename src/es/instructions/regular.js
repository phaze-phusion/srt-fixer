import {RX, UNI} from '../_constants';

const _signatureEldermanRegex = new RegExp(`== sync, corrected by <font color="?#([a-fA-F0-9]{6})"?>elderman<\\/font> ==${RX.BREAK}<font color="?#([a-fA-F0-9]{6})"?>@elder_man<\\/font>`);
const _signatureMstollRegex = new RegExp(`(<b>)?<font color="?#([a-fA-F0-9]{6})"?>Ripped By mstoll<\\/font>(</b>)?`);
const _signatureWilsonRegex = new RegExp(`Sync & corrections by wilson0804`);
const _punctuationWithoutSpaces = new RegExp(`(([a-z]|[^${RX.BREAK}]\\.{2})[.?\\]!])([A-Z])`, 'g');

/**
 * @param {Section} section
 * @param {boolean} cleanCorruptChars
 * @returns {Section|undefined}
 */
export const regularClean = (section, cleanCorruptChars) => {
  let content = section.content;

  if (
    // Lonely underscores _ [ONLY ON SERIES]
    content.match(/^_+$/) ||

    // Known signatures
    content.match(_signatureEldermanRegex) ||
    content.match(_signatureMstollRegex) ||
    content.match(_signatureWilsonRegex)
  )
    return;

  // pre clean font tags
  content = content.replace(/<\/?font([^>]+)?>/g, '');

  // punctuation without spaces
  content = content.replace(_punctuationWithoutSpaces, `$1${UNI.BREAK}$3`);

  if (cleanCorruptChars) {
    content = _i_fixes(content);
    content = _ansi_fixes(content);
  }

  content = _quotation_fixes(content);

  // Acronyms e.g. SWAT CIA ETA FBI ID US
  content = content.replace(_acronymRegex, _acronymReplacer)

  // sticky punctuation
  content = content.replace(/([a-z][.?!,])([a-z])/ig, '$1 $2');

  // spaced out punctuation
  content = content.replace(/(\w) +([.?!,])/ig, '$1$2');

  content = _dashesAndEllipsis(content);
  content = _cleanSpeakers(content);

  section.content = content;

  return section;
}

const _iFixesRegexPronoun = new RegExp( `([\\s">\\[${RX.DASH}]{1}|[\\.]{3})[l]{1}([flnst]?'?)([dms]{1}|ll|ve)?([\\s\\.\\?:!,${RX.DASH}${RX.N_DASH}${RX.M_DASH}]{1})`, 'g');
const _iFixesRegexPronounSuffix = new RegExp( `([\\s">\\[${RX.DASH}]{1}|[\\.]{3})[i]{1}'([dm]{1}|ll|ve)?([\\s\\.\\?:!,${RX.DASH}${RX.N_DASH}${RX.M_DASH}]{1})`, 'g');
const _iFixesRegexCapitalI = new RegExp( `([\\s\\."\\[>${RX.DASH}]{1})[l]{1}([bcdfghjkmnpqrstvwxzA-Z]{1}((n't)|\\w)+[\\s\\.\\?!":;,${RX.DASH}${RX.N_DASH}${RX.M_DASH}]{1})`, 'g');
const _iFixesRegexAlFirst = new RegExp(`Al([\\.\\?!":;,${RX.DASH}${RX.N_DASH}${RX.M_DASH} ]){1}` , 'g');
const _iFixesRegexAlIntermediary = new RegExp(`([A-Z]+)l([0-9A-Z]+|[\\.\\?!":;, ${RX.DASH}${RX.N_DASH}${RX.M_DASH}]{1})` , 'g');
const _iFixesRegexAlLast = new RegExp(`A%%L([\\.\\?!":;, ${RX.DASH}${RX.N_DASH}${RX.M_DASH}]){1}` , 'g');

/**
 * @param {string} text
 * @returns {string}
 * @private
 */
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
  text = text
      .replace(_iFixesRegexPronoun, '$1I$2$3$4')

  // i'd i'm i've i'll
      .replace(_iFixesRegexPronounSuffix, '$1I$2$3')

  // Fix words starting with capital "I"
  // * Matches
  //     lnfo lraq lntelligence lts lsn't
  //     lCU (ICU), lKEA, lOU (IOU)
  // * Does not match
  // 	lllegitimate
  // 	llya (Ilya)
  // 	lnsight
  // * Should not match llama (Llama)
      .replace(_iFixesRegexCapitalI, '$1I$2');

  // Fix all-caps words containing "I"
  // * Matches
  //     MlA PHOENlX Ml6
  // * Strange case: Al/AI
  //  Al (eg. Al Gore) vs AI (Artificial Intelligence)
  //  Always assume Al is a name
  // NOTE: %% is only used as a temporary placeholder
  const al_the_name = (text.match(_iFixesRegexAlFirst) || []).length !== 0;
  if( al_the_name )
    text = text.replace(_iFixesRegexAlFirst, 'A%%L$1');

  text = text.replace(_iFixesRegexAlIntermediary, '$1I$2');

  if( al_the_name ) {
    text = text.replace(_iFixesRegexAlLast, 'Al$1');
    // write a note to the developers console
    // UI_CONSOLE.print('<strong class="text-danger">Al</strong> the name was found. Ensure this is not meant to be <strong class="text-warning">A.I.</strong>' );
  }

  // l between all-cap SDH
  text = text
      .replace(/([A-Z]+)l([A-Z]+)/g, `$1I$2`)
      .replace(/l([A-Z]{3,})/g, `I$1`)
      .replace(/lN( [A-Z]{3,})/g, `IN$1`)

  // non capital i
      .replace(/(\s)i(\s)/g, '$1I$2')

  // spaced I - I's
      .replace(/(\sI) - (I\s)/g, `$1${UNI.N_DASH}$2`);

  return text;
}

/**
 * @param {string} text
 * @returns {string}
 * @private
 */
function _ansi_fixes( text ) {
  text = text
      .replace(/\u00ce\u2018/g, 'A') // Greek Alpha
      .replace(/\u00ce\u2019/g, 'B') // Greek Beta
      .replace(/\u00ce\u2022/g, 'E') // Greek Epsilon
      .replace(/\u00ce\u2013/g, 'Z') // Greek Zeta
      .replace(/\u00ce\u2014/g, 'H') // Greek Eta
      .replace(/\u00ce\u2122/g, 'I') // Greek Iota
      .replace(/\u00ce\u0161/g, 'K') // Greek Kappa
      .replace(/\u00ce\u0153/g, 'M') // Greek Mu
      .replace(/\u00ce\x9d/g,   'N') // Greek Nu
      .replace(/\u00ce\u0178/g, 'O') // Greek Omicron
      .replace(/\u00ce\u00a1/g, 'P') // Greek Rho
      .replace(/\u00ce\u00a4/g, 'T') // Greek Tau
      .replace(/\u00ce\u00a5/g, 'U') // Greek Upsilon
      .replace(/\u00ce\u00a7/g, 'X') // Greek Chi

      .replace(/\u00c3\u00a9/g, '\u00e9') // é

      .replace(/\ufb01/g, 'fi') // ﬁ
      .replace(/\ufb01/g, 'fl') // ﬂ // can sometime manifest in place of [L e.g. [LAUGHS]

      .replace(/(\u00d0\u00a1)|\u03F9|\u0421/g, 'C'); // Greek Lunate Sigma Symbol, Cyrillic Letter Es

  return text;
}

/**
 * @param {string} text
 * @returns {string}
 * @private
 */
function _quotation_fixes( text ) {
  // replace funky quotation marks
  text = text
      .replace(/[\u00b4\u0060\u2018\u2019\u201a\u201b]/g, "'")
      .replace(/[\u201c\u201d\u201e\u201f]/g, '"');

  return text;
}

/**
 * @type {RegExp}
 * @private
 */
const _acronymRegex = (function(){
  const case_sensitive_acronyms   = ['ID','LA','PA','US','CIA','ETA','FBI','USA','SWAT'];
  const case_INsensitive_acronyms = ['am','pm','aka'];

  case_INsensitive_acronyms.map(item => {
    case_sensitive_acronyms.push( item.toLowerCase() );
    case_sensitive_acronyms.push( item.toUpperCase() );
  });

  const acronyms = case_sensitive_acronyms.map( word => {
    return '(' + word.split('').join('\\.') + ')';
  });

  return new RegExp( '(\\W)(' + acronyms.join('|') + ')(\\.)?', 'g' );
})();

/**
 * @param {string} match
 * @param {string} p1
 * @param {string} p2
 * @returns {string}
 * @private
 */
const _acronymReplacer = ( match, p1, p2 ) => {
  return (p1 ?? '') + ( p2.toUpperCase().replace(/\./g, '') );
};

const _dashesRegexMDash = new RegExp(`(\\w)${RX.M_DASH}(\\w)`, 'g');
const _dashesRegexNDashesOne = new RegExp(`(\\w) ${RX.DASH}${RX.DASH} (\\w)`, 'g');
const _dashesRegexNDashesTwo = new RegExp(`(\\w) ${RX.DASH}+(${RX.BREAK})`, 'g');

/**
 * @param {string} text
 * @returns {string}
 * @private
 */
function _dashesAndEllipsis( text ) {
  // m-dashes between words
  text = text
      .replace(_dashesRegexMDash, `$1${UNI.N_DASH}$2`)

  // Fix En-dashes (Uh-- to Uh–) (ALT+0150)
  //               (Th -- to Th–) (ALT+0150)
      .replace(_dashesRegexNDashesOne, `$1${UNI.N_DASH} $2`)
      .replace(_dashesRegexNDashesTwo, `$1${UNI.N_DASH}$2`)
      .replace(/(\w) -+(\n)/g, `$1${UNI.N_DASH}$2`)
      .replace(/(\w)((-{2})|(- -)|(â€“))([^>]{1})/g, `$1${UNI.N_DASH}$6`)

  // Spaced ellipsis
      .replace(/(\. ?\. ?\.)/g, '...')
      .replace(/(\n)(- )?( ?\.{3} ?)(\w)/g, '$1$2...$4')
      .replace(/(\w)( ?\.{3} ?)(\n)/g, '$1...$3')

  // Too many dots
      .replace(/(\.{4,})/g, '...');

  return text;
}

/**
 * @param {string} text
 * @returns {string}
 * @private
 */
function _cleanSpeakers( text ) {
  // Speakers name affixed after other text
  text = text
      .replace(/([^\w\s-]{1}) ?(- )?([A-Z0-9#&. ]{2,}: [^\s]{1})/g, `$1${UNI.BREAK}$2$3`)

  // Put speaking text on same line as speaker's name
      .replace(/(- )?([A-Z0-9#&. ]{2,}:)\n([^\n]{1})/g, '$1$2 $3')

  // Add spaces after speaking dashes (-Lets go > - Lets go)
      .replace(/(\n{1}-)([^\s\-]{1})/g, '$1 $2')

  // Single speaking line where two is required
      .replace(/(\d{2},\d{3}\n)([^-]{1}[^\n]+\n- )/g, '$1- $2')
      .replace(/(\d{2},\d{3}\n-[^\n]+\n)([^-]{1}[A-Z]{2,})/g, '$1- $2');

  return text;
}
