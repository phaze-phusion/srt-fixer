import {COLORS} from '../_constants';

export function timeStampInstructions(section, logger) {
  const times = (section.timestamp.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2')).split(' --> ');
  const startTime= +(new Date('2000-01-01T' + times[0]));
  const endTime= +(new Date('2000-01-01T' + times[1]));
  const diffTime = endTime - startTime;

  if (section.text.match(hasEffectRegex) === null) {
    if (section.lines === 1 && diffTime > 6e3)
      logger.write('1 liner over 5sec', section.timestamp);
    else if (section.lines === 2 && diffTime > 12e3)
      logger.write('2 liner over 10sec', section.timestamp);
  }
  else if (diffTime > 15e3)
    logger.write('over 15sec', section.timestamp);
}

const hasEffectRegex = new RegExp(`${COLORS.EFFECTS}`, 'g');
