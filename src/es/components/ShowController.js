import {getEl} from '../_utils';
import {regularClean} from '../instructions/regular';
import {CheckBoxController} from './checkboxes';
import {showSdh, showSpeakers, speakersAndSDH} from '../instructions/shd-speakers';
import {collapseMultilines} from '../instructions/multiline';
import {musicalLyrics} from '../instructions/lyrics';
import {showMatchingSignatures} from '../instructions/signatures';
import {showNonAsciiCharacters} from '../instructions/non-ascii-chars';
import {TextareaInput} from './textareaInput';
import {TextareaOutput} from './textareaOutput';

class ShowController {
  workingValue = '';
  checkSdh;
  checkSpeakers;
  checkLowerSpeaker;
  checkMusic;
  checkCorruptChars;
  areaInput;
  areaOutput;

  colorEffects = '#808080';
  colorMusic = '#666666';
  colorSpeaker = '#992020';

  constructor() {
  }

  init() {
    this.checkSdh = new CheckBoxController('cb-sdh');
    this.checkSpeakers = new CheckBoxController('cb-speakers');
    this.checkLowerSpeaker = new CheckBoxController('cb-lowercase-speaker');
    this.checkMusic = new CheckBoxController('cb-music');
    this.checkCorruptChars = new CheckBoxController('cb-corrupt-chars');
    this.areaInput = new TextareaInput('srt-input');
    this.areaOutput = new TextareaOutput('srt-output', this.areaInput);

    const showOptions = ['result', 'sdh', 'speakers', 'nonAscii', 'signatures'];
    for (let bunny = 0; bunny < showOptions.length; bunny++) {
      getEl(`rd-${showOptions[bunny]}`).addEventListener('click', this.onTranscribe.bind(this));
    }

    getEl('btn-transcribe').addEventListener('click', this.onTranscribe.bind(this));
  }

  onTranscribe() {
    // this.areaInput.value = regularClean(this.areaInput.value);
    // this.areaInput.writeOut();
    // this.workingValue = this.areaInput.value;

    this.workingValue = regularClean(this.areaInput.value, this.checkCorruptChars.checked);
    this.workingValue = collapseMultilines(this.workingValue);

    this.workingValue = musicalLyrics(
      this.workingValue,
      this.checkMusic.checked,
      this.colorMusic,
      this.colorSpeaker
    );

    this.workingValue = speakersAndSDH(
      this.workingValue,
      this.checkSdh.checked,
      this.checkSpeakers.checked,
      this.checkLowerSpeaker.checked,
      this.colorEffects,
      this.colorSpeaker
    );

    const showValue = 'show_' + document.querySelector('.form-radio-input:checked').value;
    this[showValue]();
  }

  printOutput(output) {
    this.areaOutput.value = output;
    this.areaOutput.writeOut();
  }

  show_result() {
    this.printOutput(this.workingValue);
  }

  show_sdh() {
    this.printOutput(showSdh(this.workingValue, this.colorEffects));
  }

  show_speakers() {
    this.printOutput(showSpeakers(this.workingValue, this.colorSpeaker));
  }

  show_nonAscii() {
    this.printOutput(showNonAsciiCharacters(this.workingValue, this.checkMusic.checked));
  }

  show_signatures() {
    this.printOutput(showMatchingSignatures(this.workingValue));
  }

}

export const Show = new ShowController();
