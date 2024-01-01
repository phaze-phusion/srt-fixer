import {describe, expect, it, test} from 'vitest'
import {COLORS} from '../../src/es/_constants';
import {effectsInstructions} from '../../src/es/instructions/effects';
import {fontifyBase, mockSection} from '../mocks';

function fontify(value) {
  return fontifyBase(value, COLORS.EFFECTS);
}

function wrapFnReturnContent(content, include_effects = true) {
  return effectsInstructions(mockSection(content), include_effects).content
}

describe('Effects', () => {
  test('Content without effects', () => {
    const text = 'No effects here';
    expect(wrapFnReturnContent(text)).toEqual(text)
  })

  it('Don\'t include effects', () => {
    expect(effectsInstructions({content: '[car revving]'}, false)).toBe(undefined)
  })

  test('Round brackets', () => {
    expect(wrapFnReturnContent('( car revving )')).toEqual(fontify('[CAR REVVING]'))
    // expect(wrapFnReturnContent('\u00e2\u2122- one')).toEqual(fontify('♪ one ♪'))
    // expect(wrapFnReturnContent('♪♪')).toEqual(fontify('♪ ♪'))
  })

  // test('Missing trailing note', () => {
  //   expect(wrapFnReturnContent('♪ one')).toEqual(fontify('♪ one ♪'))
  //   expect(wrapFnReturnContent('♪ one\ntwo')).toEqual(fontify('♪ one two ♪'))
  // })
})
