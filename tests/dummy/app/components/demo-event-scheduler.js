// BEGIN-SNIPPET demo-event-scheduler.js
import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  options: computed(function() {
    return {};
  }),
  actions: {
    onSchedulerLoad(scheduler){
      this.scheduler = scheduler;
      this.scheduler.calendar.set('isLoading', false);
      this.scheduler.externalEvents.set('isLoading', false);
    },
    onCalendarRefresh() {
      this.scheduler.calendar.set('isLoading', false);
    }
  },
});
// END-SNIPPET
