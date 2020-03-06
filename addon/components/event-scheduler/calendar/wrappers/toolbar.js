import Component from '@ember/component';
import layout from '../../../../templates/components/event-scheduler/calendar/wrappers/toolbar';
import {  computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { getCalendarPeriod } from '../../../../utils/event-scheduler';
import moment from 'moment';
import { reads } from '@ember/object/computed';

export default Component.extend({
  moment: service(),
  intl: service(),
  layout,
  classNames: ['es-toolbar'],
  attributeBindings: ['data-test-es'],
  'data-test-es': 'es-toolbar',
  throttleTime: 800,
  views: reads('calendarInst.config.views'),
  toolbarConfig: reads('calendarInst.config.toolbar'),
  slotConfig: reads('calendarInst.slotConfig'),
  durationConfig: reads('toolbarConfig.duration'),
  viewsList: computed(function() {
    return Object.keys(this.get('views'));
  }),
  today: computed(function() {
    return this.get('moment').moment().startOf('day');
  }),
  disablePrevious: computed('selectedDate', function() {
    let _minDate = this.get('minDate');
    return _minDate && this.get('selectedDate').isSameOrBefore(_minDate, 'day');
  }),
  disableNext: computed('selectedDate', function() {
    let _maxDate = this.get('maxDate');
    return _maxDate && this.get('selectedDate').isSameOrAfter(_maxDate, 'day');
  }),
  currentPeriod: computed('selectedDate', 'viewType', function() {
    let { selectedDate, toolbarConfig: { dateFormat }, slotConfig }
      = this.getProperties(['selectedDate', 'toolbarConfig', 'slotConfig']);
    return getCalendarPeriod(selectedDate, dateFormat, slotConfig);
  }),
  currentDuration: computed('selectedDuration', function() {
    let { value, format } = this.get('selectedDuration');
    return this.get('intl').t(`time.${format}`, { count: value });
  }),
  durations: computed('selectedDuration', function() {
    let durations = this.get('durationConfig.options');
    let { value, format } = this.get('selectedDuration');
    let selectedDurationinMins = moment.duration(value, format).asMinutes();
    return durations.map(({ value, format }) => {
      let durationinMins = moment.duration(value, format).asMinutes();
      return {
        translatedLabel: this.get('intl').t(`time.${format}`, { count: value }),
        value: durationinMins,
        meta: { value, format },
        checked: durationinMins === selectedDurationinMins
      };
    });
  }),
  actions: {
    navigate(event) {
      let _currentDate = this.get('selectedDate').clone();
      let _viewType = this.get('viewType');
      let newDate = event === 'next' ? _currentDate.add(1, _viewType) : _currentDate.subtract(1, _viewType);
      this.onDateChange(newDate);
    },
    selectDate(dropdown, selectedDate) {
      this.send('close', dropdown);
      let newDate = this.get('moment').moment().set({
        date: selectedDate.getDate(),
        month: selectedDate.getMonth(),
        year: selectedDate.getFullYear()
      }).startOf('day');
      this.onDateChange(newDate);
    },
    selectToday() {
      this.onDateChange(this.get('today').clone());
    },
    close(dropdown) {
      dropdown.actions.close();
    },
    changeEventDuration(dropdown, durationValue) {
      let { meta } = this.get('durations').find((duration) => duration.value === durationValue);
      this.get('calendarInst').setDuration(meta);
      dropdown.actions.close();
    },
    changeView(view) {
      this.get('calendarInst').refreshCalendar(null, view);
    }
  },

  onDateChange(newDate) {
    this.get('calendarInst').refreshCalendar(newDate);
  }
});
