import {RX, UNI} from "../_constants";

export function showMatchingSignatures(text) {
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

  const matches = text.match(new RegExp(`${RX.BREAKS}([^${RX.BREAKS_RANGE}]+)?(${terms})([^${RX.BREAKS_RANGE}]+)?${RX.BREAKS}`, 'gi')) || [];

  return matches.length !== 0 ? matches.join(UNI.BREAK) : '----- None -----';
}
