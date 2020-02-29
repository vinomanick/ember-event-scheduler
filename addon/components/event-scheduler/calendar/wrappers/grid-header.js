import Component from '@ember/component';
import layout from '../../../../templates/components/event-scheduler/calendar/wrappers/grid-header';
import { inject as service } from '@ember/service';
import { VIEWS } from '../../../../constants/event-scheduler';
import { computed } from '@ember/object';

export default Component.extend({
  moment: service(),
  layout,
  VIEWS,
  classNames: ['calendar__row__grid'],
  attributeBindings: ['data-test-es'],
  'data-test-es': 'grid-header',
  today: computed(function() {
    return this.get('moment').moment();
  }),
  actions: {
    navigate(selectedDate) {
      this.onDateViewChange(selectedDate, VIEWS.DAY);
    }
  }
});
