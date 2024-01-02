import {describe, expect, it, test} from 'vitest'
import {cloneSectionMap} from '../mocks';
import {showEffects} from '../../src/es/show/effects';

function wrapFnRemoveItems(itemsToRemove) {
  return showEffects(cloneSectionMap(mockEffectsSectionMap, itemsToRemove));
}

describe('Show Effects', () => {
  it('Should have no content', () => {
    expect(
      wrapFnRemoveItems([
        '00:00:15,748 --> 00:00:17,751',
        '00:00:32,165 --> 00:00:33,767',
        '00:00:38,504 --> 00:00:40,239',
      ])
    )
    .toEqual(
      '----- Toggle Effects -----'
    )
  })

  test('Multiple lines', () => {
    expect(
      wrapFnRemoveItems([
        '00:00:15,748 --> 00:00:17,751',
        '00:00:32,165 --> 00:00:33,767',
      ])
    )
    .toEqual(
      '[DOGS BARKING]\n[GLASS SHATTERS]\n'
    )
  })

  test('All effects', () => {
    expect(wrapFnRemoveItems())
      .toEqual(
        '[ROCK MUSIC PLAYING]\n' +
        'MARK [WHISPERING]: Not now.\n' +
        '[DOGS BARKING]\n' +
        '[GLASS SHATTERS]\n'
      )
  })
});

const mockEffectsSectionMap = new Map([
  [
    '00:00:15,748 --> 00:00:17,751',
    {
      timestamp: '00:00:15,748 --> 00:00:17,751',
      timeOnScreen: 2003,
      content: '<font color="#808080">[ROCK MUSIC PLAYING]</font>',
      lines: 1,
      hasTags: true,
      _tags: {'effect': true, 'italic': false, 'music': false, 'speaker': false},
      hasEffect: true,
      hasItalic: false,
      hasMusic: false,
      hasSpeaker: false,
    }
  ],
  [
    '00:00:30,129 --> 00:00:31,331',
    {
      timestamp: '00:00:30,129 --> 00:00:31,331',
      timeOnScreen: 1202,
      content: '<font color="#992020">TEDDY</font>: What?',
      lines: 1,
      hasTags: true,
      _tags: {'effect': false, 'italic': false, 'music': false, 'speaker': true},
      hasEffect: false,
      hasItalic: false,
      hasMusic: false,
      hasSpeaker: true,
    }
  ],
  [
    '00:00:32,165 --> 00:00:33,767',
    {
      timestamp: '00:00:32,165 --> 00:00:33,767',
      timeOnScreen: 1602,
      content: '<font color="#992020">MARK <font color="#808080">[WHISPERING]</font></font>: Not now.',
      lines: 1,
      hasTags: true,
      _tags: {'effect': true, 'italic': false, 'music': false, 'speaker': true},
      hasEffect: true,
      hasItalic: false,
      hasMusic: false,
      hasSpeaker: true,
    }
  ],
  [
    '00:00:38,504 --> 00:00:40,239',
    {
      timestamp: '00:00:38,504 --> 00:00:40,239',
      timeOnScreen: 1735,
      content: '<font color="#808080">[DOGS BARKING]</font>\n<font color="#808080">[GLASS SHATTERS]</font>',
      lines: 2,
      hasTags: true,
      _tags: {'effect': true, 'italic': false, 'music': false, 'speaker': false},
      hasEffect: true,
      hasItalic: false,
      hasMusic: false,
      hasSpeaker: false,
    }
  ],
  [
    '00:02:10,583 --> 00:02:13,553',
    {
      timestamp: '00:02:10,583 --> 00:02:13,553',
      timeOnScreen: 2970,
      content: 'Well, why the hell didn\'t you just say\nthat then? Shoot.',
      lines: 2,
      hasTags: false,
      _tags: {'effect': false, 'italic': false, 'music': false, 'speaker': false},
      hasEffect: false,
      hasItalic: false,
      hasMusic: false,
      hasSpeaker: false,
    }
  ],
  [
    '00:02:57,009 --> 00:03:01,009',
    {
      timestamp: '00:02:57,009 --> 00:03:01,009',
      timeOnScreen: 4000,
      content: '- <font color="#992020">MAN 1</font>: Hey!\n- <font color="#992020">MAN 2</font>: Hey, boy! Come here!',
      lines: 2,
      hasTags: true,
      _tags: {'effect': false, 'italic': false, 'music': false, 'speaker': true},
      hasEffect: false,
      hasItalic: false,
      hasMusic: false,
      hasSpeaker: true,
    }
  ],
  [
    '00:04:40,273 --> 00:04:45,808',
    {
      timestamp: '00:04:40,273 --> 00:04:45,808',
      timeOnScreen: 5535,
      content: '<font color="#666666">♪ I was born too late into a world that\ndoesn\'t care ♪ ♪ Oh, I wish I was a punk\nrocker with flowers in my hair ♪</font>',
      lines: 3,
      hasTags: true,
      _tags: {'effect': false, 'italic': false, 'music': true, 'speaker': false},
      hasEffect: false,
      hasItalic: false,
      hasMusic: true,
      hasSpeaker: false,
    }
  ],
  [
    '00:05:52,985 --> 00:05:54,154',
    {
      timestamp: '00:05:52,985 --> 00:05:54,154',
      timeOnScreen: 1169,
      content: '- I said go.\n- Okay, I\'m going...',
      lines: 2,
      hasTags: false,
      _tags: {'effect': false, 'italic': false, 'music': false, 'speaker': false},
      hasEffect: false,
      hasItalic: false,
      hasMusic: false,
      hasSpeaker: false,
    }
  ],
]);

