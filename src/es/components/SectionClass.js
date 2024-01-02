import {COLORS_RX} from '../_constants';

export class Section {
  /**
   * The time code
   * @type {Timestamp}
   * @private
   */
  _timestamp = '';

  /**
   * Time text will be onscreen
   * @type {number}
   * @private
   */
  _timeOnScreen = 0;

  /**
   * Text content
   * @type {string}
   * @private
   */
  _content = '';

  /**
   * Line count of content
   * @type {number}
   * @private
   */
  _lines = 0;

  /**
   * @type {{music: boolean, effect: boolean, speaker: boolean, italic: boolean}}
   * @private
   */
  _tags = {
    effect: false,
    italic: false,
    music: false,
    speaker: false,
  };

  /**
   * @param {[Timestamp, TimestampPart, TimestampPart]} timestampMatch
   * @param {string} initialContent
   */
  constructor(timestampMatch, initialContent) {
    this._timestamp = timestampMatch[0];
    this._timeOnScreen = Section._calculateTimeOnScreen(timestampMatch[1], timestampMatch[2]);
    this.content = initialContent;
  }

  /** @param {string} value */
  set content(value) {
    this._content = value;
    this._lines = 1 + ((value.match(/\n/g) || []).length);
    this._tags.effect = !!COLORS_RX.EFFECTS.test(value);
    this._tags.italic = !!/<i>/.test(value);
    this._tags.music = !!COLORS_RX.MUSIC.test(value);
    this._tags.speaker = !!COLORS_RX.SPEAKER.test(value);
  }

  /** @returns {string} */
  get content() {
    return this._content;
  }

  /** @returns {Timestamp} */
  get timestamp() {
    return this._timestamp;
  }

  /** @returns {number} */
  get timeOnScreen() {
    return this._timeOnScreen;
  }

  /** @returns {number} */
  get lines() {
    return this._lines;
  }

  /** @returns {boolean} */
  get hasTags() {
    return this._tags.effect
        || this._tags.italic
        || this._tags.music
        || this._tags.speaker;
  }

  /** @returns {boolean} */ get hasEffect() { return this._tags.effect; }
  /** @returns {boolean} */ get hasItalic() { return this._tags.italic; }
  /** @returns {boolean} */ get hasMusic() { return this._tags.music; }
  /** @returns {boolean} */ get hasSpeaker() { return this._tags.speaker; }

  /**
   * Time 2 minus time 1, result is in milliseconds
   * @param {TimestampPart} time1
   * @param {TimestampPart} time2
   * @returns {number}
   * @private
   */
  static _calculateTimeOnScreen(time1, time2) {
    return +(new Date('1970-01-01T' + time2.replace(',','.') + 'Z'))
      - +(new Date('1970-01-01T' + time1.replace(',','.') + 'Z'));
  }
}
