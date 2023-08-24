import {getEl} from '../_utils';

export class CheckBoxController {
  constructor(id, fnOnValue, fn) {
    this.id = id;
    this.el = getEl(this.id);
    this.checked = this.el.checked;

    this.el.addEventListener('change', () => {
      this.checked = this.el.checked;
      // if (typeof fn === 'function' && this.checked === fnOnValue) {
      //   fn.call(this);
      // }
    });
  }

  // setChecked(checked) {
  //   this.el.checked = checked;
  //   if (checked) {
  //     this.el.setAttribute('checked', 'checked');
  //   } else {
  //     this.el.removeAttribute('checked');
  //   }
  // }
}
