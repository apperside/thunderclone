import networkingUtils from './networking/networking-utils';
import notifications from './notifications-utils';
import parsingUtils from './parsing-utils';

const utils = {
  networking: {
    ...networkingUtils,
  },
  parsing: {
    ...parsingUtils,
  },
  notifications: {
    ...notifications,
  },
};

export default utils;
