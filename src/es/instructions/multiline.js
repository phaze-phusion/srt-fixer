/**
 * @param {Section} section
 * @param {number} targetLength
 * @returns {Section}
 */
export function collapseMultilines(section, targetLength = 35) {
  // Don't collapse content which starts with a music note
  if (/^\u266a/.test(section.content))
    return section;

  // Handle speaker lines separately
  if (/(^|\x0a)- /.test(section.content)) {
    const content = /^- /.test(section.content) ? ('\n' + section.content) : section.content;

    /** @type {string[]} */
    let speakerLines = [];
    content
      .split('\n- ')
      .map(value => {
        if (value === '') return;
        speakerLines.push('- ' + collapseMultilinesContent(value, section));
      });
    section.content = speakerLines.join('\n');
    return section;
  }

  section.content = collapseMultilinesContent(section.content, section, targetLength);
  return section;
}

// const _startWithCharsRegex = new RegExp(`^[${RX.NOTE_1}${RX.DASH}]`);

/**
 * @param {string} content
 * @param {Section} parentSection
 * @param {number} targetLength
 * @returns {string}
 * TODO: Make sentences start on a new line instead of having a starting word then a break
 */
export function collapseMultilinesContent(content, parentSection, targetLength = 35) {
  let _hasFontTag = false;

  if (/<\/?font/i.test(content)) {
    content = content.replace(/<font /g, '<font_');
    _hasFontTag = true;
  }

  const textArrReverse = content
      .replace(/\n/g, ' ')
      .split(' ')
      .reverse();
  /** @type {ResultObj[]} */
  const resultArr = [];
  let lineCount = 0;

  while (textArrReverse.length) {
    resultArr[lineCount] = resultArr[lineCount] || new ResultObj();

    // Add a space count for every 6 characters in the charCount
    while ((resultArr[lineCount].charCount + (~~resultArr[lineCount].charCount / 6)) < targetLength) {
      if (textArrReverse.length === 0)
        break;

      let word = textArrReverse.pop();

      // Subtract tag characters from charCount
      if (parentSection.hasTags) {
        if (/<%/.test(word))
          resultArr[lineCount].charCount -= 2; // <%
        if (/%>/.test(word))
          resultArr[lineCount].charCount -= 2; // %>
        if (/<[ib]>/.test(word))
          resultArr[lineCount].charCount -= 3; // <i>
        if (/<\/[ib]>/.test(word))
          resultArr[lineCount].charCount -= 4; // </i>
        if (_hasFontTag) {
          if (/<font/.test(word)) {
            // space in font tag can now be placed back
            word = word.replace(/<font_/g, '<font ');
            resultArr[lineCount].charCount -= 22; // <font color="#000000">
          }
          if (/<\/font>/.test(word))
            resultArr[lineCount].charCount -= 7; // </font>
        }
      }

      resultArr[lineCount].line.push(word);
      resultArr[lineCount].charCount += word.length;
    }
    // console.log(lineCount, textArrReverse[textArrReverse.length - 1])

    // TODO: Break before 'the'-word
    // if (/the\W\b/i.test(textArrReverse[textArrReverse.length - 2])) {}

    lineCount++;
  }

  content = resultArr[0].line.join(' ');
  for (let door = 1; door < resultArr.length; door++)
    content += '\n' + resultArr[door].line.join(' ');

  // retry collapsing until we get a maximum of 2 lines per section
  if (resultArr.length >= 3 && resultArr[2].charCount <= (targetLength / 2))
    content = collapseMultilinesContent(content, parentSection, Math.round(targetLength * 1.25));

  // Not required but done to force clear all the ResultObj from memory
  // This resets the resultArr to []
  resultArr.length = 0

  return content;
}

class ResultObj {
  /** @type {string[]} */ line = [];
  /** @type {number} */ charCount = 0;
}
