import { describe, expect, it, test } from 'vitest'
import {Section} from '../../src/es/components/SectionClass';

const mockTimestamp = '00:00:00,000 --> 00:00:10,200';
const mockTimestampMatch = mockTimestamp.match(/(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/);

describe('Section Class', () => {
  test('static timeOnScreen method', () => {
    const timeOnScreen = Section._calculateTimeOnScreen(mockTimestampMatch[1], mockTimestampMatch[2]);
    expect(timeOnScreen).toEqual(10200);
  });

  test('1 liner', () => {
    const s = new Section(mockTimestampMatch, 'Dad.');
    expect(s.timestamp).toEqual(mockTimestamp);
    expect(s.content).toEqual('Dad.');
    expect(s.lines).toEqual(1);
    expect(s.hasTags).toEqual(false);
  });

  test('1 liner with tags', () => {
    const s = new Section(mockTimestampMatch, '<i>Dad.</i>');
    expect(s.timestamp).toEqual(mockTimestamp);
    expect(s.content).toEqual('<i>Dad.</i>');
    expect(s.lines).toEqual(1);
    expect(s.hasTags).toEqual(true);
  });

  test('2 liner', () => {
    const s = new Section(mockTimestampMatch, '- Dad.\n- Yes?');
    expect(s.timestamp).toEqual(mockTimestamp);
    expect(s.content).toEqual('- Dad.\n- Yes?');
    expect(s.lines).toEqual(2);
    expect(s.hasTags).toEqual(false);
  });

  test('2 liner with tags', () => {
    const s = new Section(mockTimestampMatch, '- <i>Dad.</i>\n- Yes?');
    expect(s.timestamp).toEqual(mockTimestamp);
    expect(s.content).toEqual('- <i>Dad.</i>\n- Yes?');
    expect(s.lines).toEqual(2);
    expect(s.hasTags).toEqual(true);
  });
})
