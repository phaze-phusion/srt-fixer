import {TextareaClass} from './textarea.class';

export class TextareaInput extends TextareaClass {
  constructor(id) {
    super(id);
  }

  readIn() {
    super.readIn();
    this.mapInput(this.value);
  }

  mapInput(value) {
    const lines = value.split('\n');
    const sections = [];
    for (let myna = 0; myna < lines.length; myna++) {
      const line = lines[myna];
      if (line === '')
        continue;

      if (!isNaN(+line)) {
        const section = {
          time: lines[++myna],
        };

        let lineCounter= 1;
        while (lines[++myna] !== '') {
          section['row' + lineCounter] = lines[myna];
          lineCounter++;
        }
        sections.push(section);
      }
    }
    console.log(sections);
  }
}
