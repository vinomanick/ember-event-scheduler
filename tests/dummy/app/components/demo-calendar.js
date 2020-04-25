// BEGIN-SNIPPET demo-calendar.js
import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  moment: service(),
  classNames: ['overflow--scroll'],
  isCalendarLoading: true,
  options: computed(function() {
    return {
      hasExternalEvents: false,
      toolbar: {
        showExternalEventsToggle: false,
        duration: {
          default: { value: 60, format: 'minute' },
          options: [
            { value: 30, format: 'minute' },
            { value: 60, format: 'minute' },
            { value: 90, format: 'minute' },
            { value: 120, format: 'minute' }
          ]
        },
        dateFormat: 'DD MMMM YYYY'
      },
    };
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
