import {describe, expect, it, test} from 'vitest'
import {musicInstructions} from '../../src/es/instructions/music'
import {fontTagged} from '../../src/es/_utils';
import {COLORS} from '../../src/es/_constants';
import {mockSection} from '../mocks';

function fontify(value) {
  return fontTagged(COLORS.MUSIC, value);
}

function wrapFnReturnContent(content, includeMusic = true) {
  return musicInstructions(mockSection(content), {}, includeMusic)?.content;
}

describe('Music', () => {
  test('Content without music', () => {
    const text = 'No music here';
    expect(wrapFnReturnContent(text)).toEqual(text)
  })

  it('Don\'t include music', () => {
    expect(musicInstructions({content: '♪ one\ntwo ♪'}, false)).toBe(undefined)
  })

  test('Badly structured music notes', () => {
    expect(wrapFnReturnContent('♪♪')).toEqual(fontify('♪ ♪'))
  })

  // test('Missing trailing note', () => {
  //   expect(wrapFnReturnContent('♪ Hypa Hypa')).toBe(fontify('♪ Hypa Hypa ♪'))
  //   expect(wrapFnReturnContent('♪ What a pretty lovely couple\nYour face and my fist')).toEqual(fontify('♪ What a pretty lovely couple Your face and my fist'))
  // })
})
