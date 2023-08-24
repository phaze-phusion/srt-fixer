export const RX = {
  BREAKS:       '\\x0d?\\x0a',
  BREAKS_RANGE: '\\x0d\\x0a',
  S_QUOTE:      '\\x27',    // '
  NOTE_1:       '\\u266a',  // ♪
  NOTE_2:       '\\u266b',  // ♫
  DASH:         '\\u002d',  // -
  N_DASH:       '\\u2013',
  M_DASH:       '\\u2014',
  TIME_STAMP:   '\\d{2}:\\d{2}:\\d{2},\\d{3} --> \\d{2}:\\d{2}:\\d{2},\\d{3}'
};

RX.ID            = '\\d+' + RX.BREAKS;
RX.ID_TIME_BREAK = RX.ID + RX.TIME_STAMP + RX.BREAKS;

export const UNI = {
  BREAK:  '\x0a', // "\x0d\x0a", // '\r\n',
  NOTE_1: '\u266a',  // ♪
  NOTE_2: '\u266b',  // ♫
  DASH:   '\u002d',
  N_DASH: '\u2013',
  M_DASH: '\u2014',
};

export const COLORS = {
  EFFECTS: '#808080',
  MUSIC:   '#666666',
  SPEAKER: '#992020',
};
