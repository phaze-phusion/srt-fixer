// https://www.utf8-chartable.de/unicode-utf8-table.pl?number=128&names=2&utf8=string-literal

export const RX = {
  BREAK:        '\\x0a', // \n
  S_QUOTE:      '\\x27',    // '
  NOTE_1:       '\\u266a',  // ♪
  NOTE_2:       '\\u266b',  // ♫
  DASH:         '\\u002d',  // - (hyphen minus)
  N_DASH:       '\\u2013',
  M_DASH:       '\\u2014',
  DASHES_RANGE: '\\u2010-\\u2015',
  TIME_STAMP:   '(\\d{2}:\\d{2}:\\d{2},\\d{3}) --> (\\d{2}:\\d{2}:\\d{2},\\d{3})',
  FONT_CLOSE:   '<\\/font>',
};

export const UNI = {
  BREAK:  '\x0a',    // \n
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

export const COLORS_RX = {
  EFFECTS: new RegExp(COLORS.EFFECTS),
  MUSIC:   new RegExp(COLORS.MUSIC),
  SPEAKER: new RegExp(COLORS.SPEAKER),
}
