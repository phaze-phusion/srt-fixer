import {getEl} from '../_utils';
import {StatsBar} from './StatsBar';
import {Section} from './SectionClass';
import {normalizeInput, normalizeOutput} from '../instructions/normalizer';
import {UNI} from '../_constants';

export class IOController {
  /** @type {SectionMap} */ sectionsMap;
  /** @type {TextareaClass} */ inputTextArea;
  /** @type {TextareaClass} */ outputTextArea;
  /** @type {StatsBar} */ inputStatusBar;
  /** @type {StatsBar} */ outputStatusBar;

  constructor(inputId, outputId) {
    this.inputTextArea = new TextareaClass(inputId);
    this.outputTextArea = new TextareaClass(outputId);
    this.inputStatusBar = new StatsBar(inputId);
    this.outputStatusBar = new StatsBar(outputId, this.inputStatusBar);
  }

  readIn() {
    this.inputTextArea.readIn(true);
    this.sectionsMap = IOController._valueToMap(this.inputTextArea.value);
    this.inputStatusBar.writeStats(this.inputTextArea.value);
  }

  writeOut(value) {
    this.outputTextArea.writeOut(value);
    this.outputStatusBar.writeStats(this.outputTextArea.value);
  }

  /**
   * @param {string} value
   * @returns {SectionMap}
   * @private
   */
  static _valueToMap(value) {
    /** @type {string[]} */
    const lines = value.split('\n');

    /** @type {Map<string, Section>} */
    const sections = new Map();
    for (let kiwi = 0; kiwi < lines.length; kiwi++) {
      const line = lines[kiwi];
      if (line === '')
        continue;

      const timestampMatch = line.match(/(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/);

      if (timestampMatch !== null) {
        let sectionContent = '';

        while (lines[++kiwi] !== '') {
          sectionContent += lines[kiwi];
          if (lines[kiwi + 1] !== '')
            sectionContent += UNI.BREAK;
        }

        if (sections.has(timestampMatch[0])) {
          console.error('Timestamp 1 content:\n' + sections.get(timestampMatch[0]).content);
          console.error('Timestamp 2 content:\n' + sectionContent);
          throw new Error(`Duplicate timestamp "${timestampMatch[0]}"`)
        }

        sections.set(timestampMatch[0], new Section(timestampMatch, sectionContent));
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
