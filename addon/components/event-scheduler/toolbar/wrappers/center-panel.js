import Component from '@ember/component';
import layout from '../../../../templates/components/event-scheduler/toolbar/wrappers/center-panel';
import { computed } from '@ember/object';
import { getCalendarPeriod } from '../../../../utils/event-scheduler';
import { inject as service } from '@ember/service';

export default Component.extend({
  moment: service(),
  layout,
  classNames: ['es-toolbar__panel', 'es-toolbar__panel--center'],
  currentPeriod: computed('selectedDate', 'viewType', function() {
    let { selectedDate, dateFormat, slotConfig } = this;
    return getCalendarPeriod(selectedDate, dateFormat, slotConfig);
  }),
  init() {
    this._super(...arguments);
    this.center = this.selectedDate || new Date();
  },
  actions: {
    selectDate(dropdown, { date: selectedDate }) {
      this.close(dropdown);
      let newDate = this.moment.moment().set({
        date: selectedDate.getDate(),
        month: selectedDate.getMonth(),
        year: selectedDate.getFullYear()
      }).startOf('day');
      this.onDateChange && this.onDateChange(newDate);
    }
  },
  close(dropdown) {
    dropdown.actions.close();
  }
});
