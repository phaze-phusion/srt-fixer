import {getEl} from '../_utils';
import {normalizeInput, normalizeOutput} from '../instructions/normalizer';

export class TextareaClass {
  constructor(id) {
    this.id = id;
    this.el = getEl(this.id);
    this.value = '';
    this.readIn();
    this.el.addEventListener('keyup', this.onKeyup.bind(this));
  }

  readIn() {
    this.value = normalizeInput(this.el.value);
  }

  writeOut() {
    this.el.value = normalizeOutput(this.value);
  }

  onKeyup(event) {
    if (event.key === 'Control' || event.key === 'Shift')
      return;
    this.readIn();
    this.writeOut();
  }
}
