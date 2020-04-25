// BEGIN-SNIPPET demo-event-scheduler.js
import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  moment: service(),
  isExternalEventsExpanded: false,
  isCalendarLoading: true,
  isExternalEventsLoading: true,
  isExternalEventsLoadedAll: false,
  options: computed(function() {
    return {};
  }),
  init() {
    this._super(...arguments);
    this.setProperties({
      selectedView: 'day',
      selectedDate: this.moment.moment().startOf('day'),
      selectedDuration: { value: 90, format: 'minute' }
    });
  },

  actions: {
    loadScheduler() {
      this.setProperties({
        isCalendarLoading: false,
        isExternalEventsLoading: false
      });
    },
    changeDateView(selectedDate, selectedView) {
      this.setProperties({ selectedDate, selectedView});
    },
    changeView(selectedView) {
      this.set('selectedView', selectedView);
    },
    changeDate(selectedDate) {
      this.set('selectedDate', selectedDate);
    },
    changeDuration(selectedDuration) {
      this.set('selectedDuration', selectedDuration);
    },
    toggleExternalEvent() {
      this.toggleProperty('isExternalEventsExpanded');
    }
  }
});
// END-SNIPPET
