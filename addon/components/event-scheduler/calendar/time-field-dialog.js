import Component from '@ember/component';
import layout from '../../../templates/components/event-scheduler/calendar/time-field-dialog';
import { computed, } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  intl: service(),
  layout,
  selectedTime: computed(function() {
    return this.timeFieldChoices[0];
  }),
  actions: {
    changeTime(time) {
      this.set('selectedTime', time);
    },
    onContinue() {
      this.onSubmit && this.onSubmit(this.selectedTime);
    },
    onCancel() {
      this.onClose && this.onClose();
    }
  }
});
