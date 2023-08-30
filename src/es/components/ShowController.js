import {getEl, isUndefined} from '../_utils';
import {regularClean} from '../instructions/regular';
import {CheckBoxController} from './CheckBoxController';
import {collapseMultilines} from '../instructions/multiline';
import {musicalLyrics} from '../instructions/lyrics';
import {showMatchingSignatures} from '../show/signatures';
import {showNonAsciiCharacters} from '../show/non-ascii-chars';
import {UNI} from '../_constants';
import {showSdh} from '../show/shd';
import {showSpeakers} from '../show/speakers';
import {sdhInstructions} from '../instructions/sdh';
import {speakersInstructions} from '../instructions/speakers';
import {IOController} from './IOController';

class ShowController {
  /** @type {string} */ workingValue = '';
  /** @type {CheckBoxController} */ checkSdh;
  /** @type {CheckBoxController} */ checkSpeakers;
  /** @type {CheckBoxController} */ checkLowerSpeaker;
  /** @type {CheckBoxController} */ checkMusic;
  /** @type {CheckBoxController} */ checkCorruptChars;
  /** @type {IOController} */ ioController;

  constructor() {
  }

  init() {
    this.checkSdh = new CheckBoxController('cb-sdh');
    this.checkSpeakers = new CheckBoxController('cb-speakers');
    this.checkLowerSpeaker = new CheckBoxController('cb-lowercase-speaker');
    this.checkMusic = new CheckBoxController('cb-music');
    this.checkCorruptChars = new CheckBoxController('cb-corrupt-chars');

    this.ioController = new IOController('srt-input', 'srt-output');

    const showOptions = ['result', 'sdh', 'speakers', 'nonAscii', 'signatures'];
    for (let bunny = 0; bunny < showOptions.length; bunny++) {
      getEl(`rd-${showOptions[bunny]}`).addEventListener('click', this.onTranscribe.bind(this));
    }

    getEl('btn-transcribe').addEventListener('click', this.onTranscribe.bind(this));
  }

  onTranscribe() {
    this.workingValue = '';
    this.ioController.readIn();
    const sections = this.ioController.sectionsArray;
    let counter = 0;
    while (counter < sections.length) {
      sections[counter] = regularClean(sections[counter], this.checkCorruptChars.checked);

      if (!isUndefined(sections[counter]) && sections[counter].lines > 1)
        sections[counter] = collapseMultilines(sections[counter]);

      if (!isUndefined(sections[counter]))
        sections[counter] = musicalLyrics(sections[counter], this.checkMusic.checked);

      if (!isUndefined(sections[counter]))
        sections[counter] = sdhInstructions(sections[counter], this.checkSdh.checked);

      if (!isUndefined(sections[counter]))
        sections[counter] = speakersInstructions(
          sections[counter],
          this.checkSpeakers.checked,
          this.checkLowerSpeaker.checked
        );

      let removedCount = 0;
      while (isUndefined(sections[counter])) {
        sections.splice(counter, 1);
        removedCount++;
      }

      if (removedCount === 0)
        this.workingValue += `${counter + 1}${UNI.BREAK}${sections[counter].timestamp}${UNI.BREAK}${sections[counter].text}${UNI.BREAK}${UNI.BREAK}`;

      counter = counter + 1 - removedCount;
    }

    const showValue = 'show_' + document.querySelector('.form-radio-input:checked').value;
    this[showValue]();
  }

  printOutput(output) {
    this.ioController.readIn();
    this.ioController.writeOut(output);
  }

  show_result() {
    this.printOutput(this.workingValue);
  }

  show_sdh() {
    this.printOutput(showSdh(this.workingValue));
  }

  show_speakers() {
    this.printOutput(showSpeakers(this.workingValue));
  }

  show_nonAscii() {
    this.printOutput(showNonAsciiCharacters(this.workingValue, this.checkMusic.checked));
  }

  show_signatures() {
    this.printOutput(showMatchingSignatures(this.workingValue));
  }

}

export const Show = new ShowController();
