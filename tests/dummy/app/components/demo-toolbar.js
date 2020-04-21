// BEGIN-SNIPPET demo-toolbar.js
import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['overflow--scroll'],
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
      let { selectedDate, selectedView } = this.scheduler.calendar;
      alert(`Selected date - ${selectedDate.format('DD MMM YYYY')} Selected view - ${selectedView}`);
    }
  },
});
// END-SNIPPET
