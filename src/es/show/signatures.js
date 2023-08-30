import {RX, UNI} from "../_constants";

const signatureRegex = (function(){
  const terms = [
    'Caption',
    'corrected',
    'corrections',
    'elderman',
    'encoded',
    'English - US',
    'GWC',
    'Ivandrofly',
    'ripped',
    'sdh',
    'subs ',
    'subtitles',
    'sync',
  ]
    .map(item => item.toLowerCase())
    .join('|');
  return new RegExp(`${RX.BREAK}([^${RX.BREAK}]+)?(${terms})([^${RX.BREAK}]+)?${RX.BREAK}`, 'gi');
})();

export function showMatchingSignatures(text) {
  const matches = text.match(signatureRegex) || [];
  return matches.length !== 0 ? matches.join(UNI.BREAK) : '----- None -----';
}
