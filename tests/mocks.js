import {Section} from '../src/es/components/SectionClass';

export const fontifyBase = (value, color) => `<font color="${color}">${value}</font>`;
export const mockTimestamp = '00:00:00,000 --> 00:00:10,200';
export const mockTimestampMatch = mockTimestamp.match(/(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/);
export const mockSection = initialContent => new Section(mockTimestampMatch, initialContent)
