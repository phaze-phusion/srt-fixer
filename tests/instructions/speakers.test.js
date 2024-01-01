import {describe, expect, it, test} from 'vitest'
import {COLORS} from '../../src/es/_constants';
import {speakersInstructions} from '../../src/es/instructions/speakers';
import {fontifyBase, mockSection} from '../mocks';

function fontify(value) {
  return fontifyBase(value, COLORS.SPEAKER);
}

function wrapFnReturnContent(content, includeSpeakers = true, lowercaseSpeakers = false) {
  return speakersInstructions(mockSection(content), includeSpeakers, lowercaseSpeakers).content
}

describe('Speakers', () => {
  test('Content without speakers', () => {
    const text = 'No speakers here';
    expect(wrapFnReturnContent(text)).toEqual(text)
  })

  test('Don\'t include speaker', () => {
    expect(wrapFnReturnContent('SALLY: Where are you?', false)).toEqual('Where are you?')
    expect(wrapFnReturnContent('Sally: Where are you?', false, true)).toEqual('Where are you?')
  })

  test('Speaker on same line as text', () => {
    expect(
        wrapFnReturnContent('JOHN:\nWelcome')
    ).toEqual(
      `${fontify('JOHN')}: Welcome`
    )
  })

  test('Lowercase 1 line speaker', () => {
    expect(
      wrapFnReturnContent('Sally: Where are you?', true, true)
    ).toEqual(
      fontify('SALLY') + ': Where are you?'
    )
  })

  test('Lowercase 2 line speakers', () => {
    expect(
      wrapFnReturnContent('- Tedd: Hands up!\n- All: Okay', true, true)
    ).toEqual(
      `- ${fontify('TEDD')}: Hands up!\n- ${fontify('ALL')}: Okay`)
  })

  test('Speaker with numbers', () => {
    expect(
        wrapFnReturnContent('- Man 1: Hands up!\n- Woman: Wait', true, true)
    ).toEqual(
        `- ${fontify('MAN 1')}: Hands up!\n- ${fontify('WOMAN')}: Wait`)
  })

  test('Speakers usually Cut-off', () => {
    const names = [
      'MacDonald',
      'Mary-Anne',
      'O\'Neil',
      'T\'Pol',
      'Zho\'Kaan',
      'Woman\'s voice',
      'Mrs. Smith',
      'Dr. Smith',
    ];
    names.map(value => {
      const obj = {
        in: wrapFnReturnContent(`${value}: Hello!`, true, true),
        out: fontify(value.toUpperCase()) + ': Hello!',
      };
      expect(obj.in).toEqual(obj.out)
    });
  })

  test('Many lines with 2 with speakers', () => {
    expect(
      wrapFnReturnContent(
        '- TEDDY: Well, why the hell\ndidn\'t you just\nsay that then?\n' +
        '- MARK: Anyway'
      ))
      .toEqual(
        `- ${fontify('TEDDY')}: Well, why the hell didn't you\njust say that then?\n` +
        `- ${fontify('MARK')}: Anyway`
      );
  })

  test('Many lines with 2 with speakers shouldn\'t add speakers', () => {
    expect(
      wrapFnReturnContent(
      '- TEDDY: Well, why the hell\ndidn\'t you just\nsay that then?\n- MARK: Anyway',
      false
      ))
      .toEqual(
        `- Well, why the hell didn't you just say\nthat then?\n` +
        `- Anyway`
      );
  })
})
