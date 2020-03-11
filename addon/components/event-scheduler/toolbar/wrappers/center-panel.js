import Component from '@ember/component';
import layout from '../../../../templates/components/event-scheduler/toolbar/wrappers/center-panel';
import { computed } from '@ember/object';
import { getCalendarPeriod } from '../../../../utils/event-scheduler';
import { inject as service } from '@ember/service';
import { assert } from '@ember/debug';

export default Component.extend({
  moment: service(),
  layout,
  classNames: ['es-toolbar__panel', 'es-toolbar__panel--center'],
  disablePrevious: computed('selectedDate', function() {
    let _minDate = this.minDate;
    return _minDate && this.selectedDate.isSameOrBefore(_minDate, 'day');
  }),
  disableNext: computed('selectedDate', function() {
    let _maxDate = this.maxDate;
    return _maxDate && this.selectedDate.isSameOrAfter(_maxDate, 'day');
  }),
  currentPeriod: computed('selectedDate', 'viewType', function() {
    let { selectedDate, dateFormat, slotConfig } = this;
    return getCalendarPeriod(selectedDate, dateFormat, slotConfig);
  }),
  init() {
    this._super(...arguments);
    let minYear = this.minYear;
    let maxYear = this.maxYear
    let selectedDate =  this.selectedDate || new Date();
    this.center = selectedDate;

    if (minYear > maxYear) {
      assert(`minYear should not be greater than maxYear. minYear=${minYear}:maxYear=${maxYear}`);
    }
  },
  actions: {
    selectDate(dropdown, { date: selectedDate }) {
      this.close(dropdown);
      let newDate = this.moment.moment().set({
        date: selectedDate.getDate(),
        month: selectedDate.getMonth(),
        year: selectedDate.getFullYear()
      }).startOf('day');
      this.onDateChange(newDate);
    }
  },
  close(dropdown) {
    dropdown.actions.close();
  }
});
