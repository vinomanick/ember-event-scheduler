// BEGIN-SNIPPET demo-external-events-block.js
import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  isExternalEventsLoading: true,
  isExternalEventsLoadedAll: false,
  options: computed(function() {
    return {};
  }),

  actions: {
    loadScheduler() {
      this.setProperties({
        isExternalEventsLoading: false
      });
    }
  }
});
// END-SNIPPET
