import {getEl, isUndefined} from '../_utils';
import {StatsBar} from './StatsBar';
import {normalizeInput, normalizeOutput} from '../instructions/normalizer';
import {UNI} from '../_constants';

export class IOController {
  /** @type {Section[]} */ sectionsArray;

  constructor(inputId, outputId) {
    this.sectionsArray = [];

    this.inputTextArea = new TextareaClass(inputId);
    this.outputTextArea = new TextareaClass(outputId);
    this.inputStatusBar = new StatsBar(inputId);
    this.outputStatusBar = new StatsBar(outputId, this.inputStatusBar);
  }

  readIn() {
    this.inputTextArea.readIn(true);
    this.sectionsArray = IOController.valueToArray(this.inputTextArea.value);
    this.inputStatusBar.writeStats(this.inputTextArea.value);
  }

  writeOut(value) {
    this.outputTextArea.writeOut(value);
    this.outputStatusBar.writeStats(this.outputTextArea.value);
  }

  /**
   * @param {string} value
   * @returns {Section[]}
   */
  static valueToArray(value) {
    /** @type {string[]} */
    const lines = value.split('\n');

    /** @type {Section[]} */
    const sections = [];
    for (let kiwi = 0; kiwi < lines.length; kiwi++) {
      const line = lines[kiwi];
      if (line === '')
        continue;

      if (line.match(/\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}/) !== null) {
        /** @type {Section} */
        const section= {
          timestamp: lines[kiwi],
          text: '',
          lines: 0,
        };

        while (lines[++kiwi] !== '') {
          section.text += lines[kiwi];
          if (lines[kiwi + 1] !== '')
            section.text += UNI.BREAK;
          section.lines++;
        }

        sections.push(section);
      }
    }
    return sections;
  }

}

class TextareaClass {
  /** @type {string} */ id;
  /** @type {HTMLElement} */ el;
  /** @type {Section[]} */ valueArray;
  /** @type {string} */ value ;
  /** @type {StatsBar} */ statsBar ;

  constructor(id) {
    this.id = id;
    this.el = getEl(this.id);
    this.value = '';
    this.valueArray = [];
    this.readIn(true);
  }

  readIn(resetValue = false) {
    this.value = normalizeInput(this.el.value);
    if (resetValue)
      this.el.value = this.value;
  }

  writeOut(value) {
    this.value = normalizeOutput(value);
    this.el.value = this.value;
  }

  // onKeyup(event) {
  //   // if (event.key === 'Control' || event.key === 'Shift')
  //   //   return;
  //   this.readIn();
  //   this.writeOut(this.value);
  // }
}
