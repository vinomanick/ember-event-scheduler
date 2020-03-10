import Component from '@ember/component';
import layout from '../../../../templates/components/event-scheduler/toolbar/wrappers/left-panel';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  moment: service(),
  intl: service(),
  layout,
  classNames: ['es-toolbar__panel'],
  throttleTime: 800,
  today: computed(function() {
    return this.moment.moment().startOf('day');
  }),
  actions: {
    navigate(event) {
      let _currentDate = this.selectedDate.clone();
      let _viewType = this.viewType;
      let newDate = event === 'next' ? _currentDate.add(1, _viewType) : _currentDate.subtract(1, _viewType);
      this.onDateChange(newDate);
    },
    selectToday() {
      this.onDateChange(this.today.clone());
    },
    triggerExternalEventsToggle() {
      this.onExternalEventsToggle();
    }
  }
});
