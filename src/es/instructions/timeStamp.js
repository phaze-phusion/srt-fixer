import {COLORS} from '../_constants';

export function timestampInstructions(section, logger) {
  if (section.content.match(hasEffectRegex) === null) {
    if (section.lines === 1 && section.timeOnScreen > 6e3)
      logger.write('1 liner over 5sec', section.timestamp);
    else if (section.lines === 2 && section.timeOnScreen > 12e3)
      logger.write('2 liner over 10sec', section.timestamp);
  }
  else if (section.timeOnScreen > 15e3)
    logger.write('over 15sec', section.timestamp);
}

const hasEffectRegex = new RegExp(`${COLORS.EFFECTS}`, 'g');
