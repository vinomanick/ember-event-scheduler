'use strict';

module.exports = function(/* environment, appConfig */) {
  return {
    moment: {
      includeLocales: ['ar', 'ca', 'cs', 'da', 'de', 'es-do', 'es', 'et', 'fi', 'fr', 'he', 'hu', 'id', 'it', 'ja', 'ko', 'nb', 'nl', 'pl', 'pt-br', 'pt', 'ro', 'ru', 'sk', 'sl', 'sv', 'th', 'tr', 'uk', 'vi', 'zh-cn', 'zh-tw', 'lv', 'bs', 'bg', 'hr', 'el', 'ms', 'lt', 'sr', 'is', 'tl-ph'],
      includeTimezone: 'all',
      allowEmpty: true // default: false
    }
  };
};
