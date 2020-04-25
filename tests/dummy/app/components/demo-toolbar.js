// BEGIN-SNIPPET demo-toolbar.js
import Component from '@ember/component';
import { computed } from '@ember/object';
import moment from 'moment';
import { inject as service } from '@ember/service';

export default Component.extend({
  moment: service(),
  classNames: ['overflow--scroll'],
  isExternalEventsExpanded: false,
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
    changeView(selectedView) {
      this.set('selectedView', selectedView);
      alert(`Newly selected view - ${selectedView}`);
    },
    changeDate(selectedDate) {
      this.set('selectedDate', selectedDate);
      alert(`Newly selected date - ${selectedDate.format('DD-MM-YYYY')}`);
    },
    changeDuration(selectedDuration) {
      this.set('selectedDuration', selectedDuration);
      let duration = moment.duration(selectedDuration.value, selectedDuration.format).asMinutes();
      alert(`Newly selected duration - ${duration}`);
    },
    toggleExternalEvent() {
      this.toggleProperty('isExternalEventsExpanded');
      alert(`External event toggled - ${this.isExternalEventsExpanded}`);
    }
  },
});
// END-SNIPPET
