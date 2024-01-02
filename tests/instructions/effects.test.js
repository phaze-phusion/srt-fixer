import {describe, expect, it, test} from 'vitest'
import {effectsInstructions} from '../../src/es/instructions/effects';
import {COLORS} from '../../src/es/_constants';
import {fontTagged} from '../../src/es/_utils';
import {mockSection} from '../mocks';

function fontify(value) {
  return fontTagged(COLORS.EFFECTS, value);
}

function wrapFnReturnObj(content, includeEffects = true) {
  return effectsInstructions(mockSection(content), includeEffects)
}

function wrapFnReturnContent(content, includeEffects) {
  return wrapFnReturnObj(content, includeEffects).content
}

describe('Effects Instructions', () => {
  test('Content without effects', () => {
    const text = 'No effects here';
    expect(wrapFnReturnContent(text)).toEqual(text)
  })

  it('Should not include effects', () => {
    expect(wrapFnReturnObj('[car revving]', false)).toBe(undefined)
  })

  it('Should throw out empty brackets', () => {
    expect(wrapFnReturnObj('   (  )   ')).toBe(undefined)
  })

  test('Brackets', () => {
    expect(wrapFnReturnContent('( round brackets )')).toEqual(fontify('[ROUND BRACKETS]'))
    expect(wrapFnReturnContent('[ square brackets ]')).toEqual(fontify('[SQUARE BRACKETS]'))
    expect(wrapFnReturnContent('[ mixed brackets )')).toEqual(fontify('[MIXED BRACKETS]'))
  })

  test('Effect wrapping multiple lines', () => {
    expect(wrapFnReturnContent('(line 1\nline 2)')).toEqual(fontify('[LINE 1\nLINE 2]'))
  })

  test('2 effects on multiple line', () => {
    expect(wrapFnReturnContent('(line 1)\n(line 2)')).toEqual(fontify('[LINE 1]') + '\n' + fontify('[LINE 2]'))
  })
})
