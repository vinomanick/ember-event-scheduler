import Component from '@ember/component';
import layout from '../../../templates/components/event-scheduler/calendar/time-field-dialog';
import { computed, } from '@ember/object';

export default Component.extend({
  layout,
  selectedTime: computed(function() {
    return this.get('timeFieldChoices')[0];
  }),
  actions: {
    changeTime(time) {
      this.set('selectedTime', time);
    },
    onUpdate() {
      this.onStartTimeUpdate(this.get('selectedTime'));
    },
    onCancel() {
      this.onClose();
    }
  }
});
