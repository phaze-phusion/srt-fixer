import {getEl} from '../_utils';

export class LogController {
  constructor(id) {
    this.id = id;
    this.el = getEl(this.id);
  }

  static {
    this.outputTitle = ((d) => {
      const div = d.createElement('div');
      div.className = 'srt-log-title';
      return div;
    })(document);
    this.outputDescription = ((d) => {
      const div = d.createElement('div');
      div.className = 'srt-log-description';
      return div;
    })(document);
  }

  clear() {
    while(this.el.firstChild)
      this.el.removeChild(this.el.firstChild);
  }

  write(title, description) {
    const titleClone = LogController.outputTitle.cloneNode();
    const descriptionClone = LogController.outputDescription.cloneNode();
    titleClone.textContent = title;
    descriptionClone.textContent = description;
    this.el.appendChild(titleClone);
    this.el.appendChild(descriptionClone);
  }
}
