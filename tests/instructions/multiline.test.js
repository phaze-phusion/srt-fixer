import {describe, expect, it, test} from 'vitest'
import {collapseMultilines} from '../../src/es/instructions/multiline';
import {mockSection} from '../mocks';

function wrapFnReturnContent(content, targetLength = 35) {
  return collapseMultilines(mockSection(content), targetLength).content;
}

describe('Multiline collapse', () => {
  test('3 lines to 2', () => {
    expect(
      wrapFnReturnContent(
        'Those ain\'t gonna do you\n' +
        'any good now neither,\n' +
        'you dumb son of a bitch!'
      ))
      .toEqual(
        'Those ain\'t gonna do you any good now\n' +
        'neither, you dumb son of a bitch!'
      );
  })

  test('3 lines to 2 with tags <% %> <i> <b>', () => {
    expect(
      wrapFnReturnContent(
        '<%Those%> ain\'t <i>gonna</i> <%do you%>\n' +
        '<%any good%> now <%neither%>,\n' +
        '<b>you dumb<\\b> son of a <%bitch!%>'
      ))
      .toEqual(
        '<%Those%> ain\'t <i>gonna</i> <%do you%> <%any good%> now\n' +
        '<%neither%>, <b>you dumb<\\b> son of a <%bitch!%>'
      );
  })

  test('3 lines to 2 with font tag', () => {
    expect(
      wrapFnReturnContent(
        '<font color="#666666">Those ain\'t gonna</font> do you\n' +
        '<font color="#666666">any good</font> now neither,\n' +
        'you dumb son of a <font color="#666666">bitch!</font>'
      ))
      .toEqual(
        '<font color="#666666">Those ain\'t gonna</font> do you <font color="#666666">any good</font> now\n' +
        'neither, you dumb son of a <font color="#666666">bitch!</font>'
      );
  })

  test('Many lines with 2 with speakers', () => {
    expect(
      wrapFnReturnContent(
        '- <font color="#992020">TEDDY</font>: Well, why the hell\n' +
        'didn\'t you just\n' +
        'say that then?\n' +
        '- <font color="#992020">MARK</font>: Anyway'
      ))
      .toEqual(
        '- <font color="#992020">TEDDY</font>: Well, why the hell didn\'t you\n' +
        'just say that then?\n' +
        '- <font color="#992020">MARK</font>: Anyway'
      );
  })
})
