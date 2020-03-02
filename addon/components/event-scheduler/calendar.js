import Component from '@ember/component';
import layout from '../../templates/components/event-scheduler/calendar';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  moment: service(),
  layout,
  classNames: ['es-calendar'],
  classNameBindings: ['viewClass'],
  attributeBindings: ['data-test-es'],
  'data-test-es': 'es-calendar',
  viewClass: computed('calendarInst.viewType', function() {
    return `${this.get('calendarInst.viewType')}-view`;
  }),
});
