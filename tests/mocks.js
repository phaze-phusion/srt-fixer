import {Section} from '../src/es/components/SectionClass';
import {RX} from '../src/es/_constants';

export const mockTimestamp = '00:00:00,000 --> 00:00:10,200';
export const mockTimestampMatch = mockTimestamp.match(RX.TIME_STAMP);
export const mockSection = initialContent => new Section(mockTimestampMatch, initialContent);

export function cloneSectionMap(sectionMap, itemsToRemove = []) {
  const sectionMapClone = new Map();
  sectionMap.forEach((v, k) => {
    if (!~itemsToRemove.indexOf(k))
      sectionMapClone.set(k, v);
  });
  return sectionMapClone;
}
