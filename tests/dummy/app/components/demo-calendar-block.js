// BEGIN-SNIPPET demo-calendar-block.js
import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

export default Component.extend({
  classNames: ['overflow--scroll'],
  options: computed(function() {
    return {};
  }),
  viewType: reads('scheduler.calendar.viewType'),
  slots: reads('scheduler.calendar.slots'),
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
