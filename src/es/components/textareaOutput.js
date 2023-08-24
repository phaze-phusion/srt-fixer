import {StatsBar} from './StatsBar';
import {TextareaClass} from './textarea.class';

export class TextareaOutput extends TextareaClass {
  constructor(id, diffWithInstance) {
    super(id);
    this.statsBar = new StatsBar(this.id, diffWithInstance.statsBar);
    this.statsBar.writeStats(this.value);
  }

  writeOut() {
    super.writeOut();
    this.statsBar.writeStats(this.value);
  }

  onKeyup() {
    // do nothing
  }
}
