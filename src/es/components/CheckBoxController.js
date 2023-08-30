import {getEl} from '../_utils';

export class CheckBoxController {
  constructor(id) {
    this.id = id;
    this.el = getEl(this.id);
    this.checked = this.el.checked;

    this.el.addEventListener('change', () => {
      this.checked = this.el.checked;
    });
  }
}
