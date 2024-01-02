import {CheckBoxController} from './CheckBoxController';
import {LogController} from './LogController';
import {IOController} from './IOController';
import {getEl, isUndefined} from '../_utils';
import {UNI} from '../_constants';
import {musicInstructions} from '../instructions/music';
import {collapseMultilines} from '../instructions/multiline';
import {regularClean} from '../instructions/regular';
import {effectsInstructions} from '../instructions/effects';
import {speakersInstructions} from '../instructions/speakers';
import {timestampInstructions} from '../instructions/timeStamp';
import {showMatchingSignatures} from '../show/signatures';
import {showNonAsciiCharacters} from '../show/non-ascii-chars';
import {showEffects} from '../show/effects';
import {showSpeakers} from '../show/speakers';

class ShowController {
  /** @type {string} */ workingValue = '';
  /** @type {SectionMap} */ sectionMap;
  /** @type {CheckBoxController} */ checkEffects;
  /** @type {CheckBoxController} */ checkSpeakers;
  /** @type {CheckBoxController} */ checkLowerSpeaker;
  /** @type {CheckBoxController} */ checkMusic;
  /** @type {CheckBoxController} */ checkCorruptChars;
  /** @type {IOController} */ ioController;

  constructor() {
  }

  init() {
    this.checkEffects = new CheckBoxController('cb-effects');
    this.checkSpeakers = new CheckBoxController('cb-speakers');
    this.checkLowerSpeaker = new CheckBoxController('cb-lowercase-speaker');
    this.checkMusic = new CheckBoxController('cb-music');
    this.checkCorruptChars = new CheckBoxController('cb-corrupt-chars');
    this.checkItalics = new CheckBoxController('cb-italics');
    this.logger = new LogController('srt-log');

    this.ioController = new IOController('srt-input', 'srt-output');

    const showOptions = ['result', 'effects', 'speakers', 'nonAscii', 'signatures'];
    for (let bunny = 0; bunny < showOptions.length; bunny++)
      getEl(`rd-${showOptions[bunny]}`).addEventListener('click', this.onTranscribe.bind(this));

    getEl('btn-transcribe').addEventListener('click', this.onTranscribe.bind(this));
  }

  onTranscribe() {
    this.workingValue = '';
    this.logger.clear();
    this.ioController.readIn();
    this.sectionsMap = this.ioController.sectionsMap;

    this.sectionsMap.forEach((section, key, map) => {
      const regularCleaned = regularClean(section, this.checkCorruptChars.checked);
      if (!isUndefined(regularCleaned)) map.set(key, regularCleaned); else return map.delete(key);

      const musical = musicInstructions(section, this.logger, this.checkMusic.checked, this.checkItalics.checked);
      if (!isUndefined(musical)) map.set(key, musical); else return map.delete(key);

      const hearingImpaired = effectsInstructions(section, this.checkEffects.checked);
      if (!isUndefined(hearingImpaired)) map.set(key, hearingImpaired); else return map.delete(key);

      map.set(key, speakersInstructions(section, this.checkSpeakers.checked, this.checkLowerSpeaker.checked));

      // After work was done re-balance multi-lines
      if (section.lines > 1)
        map.set(key, collapseMultilines(section));

      timestampInstructions(section, this.logger);
    });

    let sectionCounter = 0;
    this.sectionsMap.forEach((section, timestamp) => {
      this.workingValue += `${++sectionCounter}${UNI.BREAK}${timestamp}${UNI.BREAK}${section.content}${UNI.BREAK}${UNI.BREAK}`;
    });

    const showValue = 'show_' + document.querySelector('.form-radio-input:checked').value;
    this[showValue]();
  }

  printOutput(output) {
    this.ioController.writeOut(output);
  }

  show_result() {
    this.printOutput(this.workingValue);
  }

  show_effects() {
    this.printOutput(showEffects(this.sectionsMap));
  }

  show_speakers() {
    this.printOutput(showSpeakers(this.sectionsMap));
  }

  show_nonAscii() {
    this.printOutput(showNonAsciiCharacters(this.workingValue, this.checkMusic.checked));
  }

  show_signatures() {
    this.printOutput(showMatchingSignatures(this.workingValue));
  }

}

export const Show = new ShowController();
