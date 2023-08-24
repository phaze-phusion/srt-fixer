import {getEl} from '../_utils';

export class StatsBar {
  constructor(idPrefix, diffStatsInstance) {
    this.diffStatsInstance = diffStatsInstance;
    this.useDiff = typeof diffStatsInstance !== 'undefined';

    const idValuePrefix = `${idPrefix}-stat`;
    const idDiffPrefix = `${idPrefix}-diff`;

    for (let street = 0; street < StatsBar.variations.length; street++) {
      const variation = StatsBar.variations[street];
      this[`valEl_${variation}`] = getEl(`${idValuePrefix}-${variation}`);
      if (this.useDiff)
        this[`diffEl_${variation}`] = getEl(`${idDiffPrefix}-${variation}`);
    }
  }

  writeStats(text) {
    this.lines = (text.match(/\n/g) || '').length;
    this.chars = text.length;
    this.byteSize = (new TextEncoder('utf-8').encode(text)).length;
    this.size = StatsBar._roundedKilobytes(this.byteSize);

    this.valEl_lines.textContent = this.lines;
    this.valEl_chars.textContent = this.chars;
    this.valEl_size.textContent = this.size;
    this.valEl_size.dataset.size = this.byteSize;

    if (this.useDiff) {
      const diffLines = this.lines - this.diffStatsInstance.lines;
      const diffChars = this.chars - this.diffStatsInstance.chars;
      const diffByteSize = this.byteSize - this.diffStatsInstance.byteSize;
      let diffSize;
      if (Math.abs(diffByteSize) > 1e3)
        diffSize = StatsBar._roundedKilobytes(diffByteSize);
      else
        diffSize = `${diffByteSize} B`;

      StatsBar._setDiff(this.diffEl_lines, diffLines);
      StatsBar._setDiff(this.diffEl_chars, diffChars);
      StatsBar._setDiff(this.diffEl_size, diffByteSize, diffSize);
    }
  }

  static {
    this.variations = ['lines', 'chars', 'size'];
  }

  static _roundedKilobytes(bytes) {
    return (Math.round(bytes / 100) / 10) + ' KB'
  }

  static _setDiff(el, value, printValue) {
    printValue = typeof printValue === 'undefined' ? value : printValue;
    el.textContent = printValue > 0 ? `+${printValue}` : printValue;
    const elClassList = el.classList;
    if (value > 0) {
      elClassList.add('more');
      elClassList.remove('less', 'same');
    } else if (value < 0) {
      elClassList.add('less');
      elClassList.remove('more', 'same');
    } else {
      elClassList.add('same');
      elClassList.remove('more', 'less');
    }
  }
}
