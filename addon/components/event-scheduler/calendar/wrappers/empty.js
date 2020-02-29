import Component from '@ember/component';
import layout from '../../../../templates/components/event-scheduler/calendar/wrappers/empty';

export default Component.extend({
  layout,
  classNames: ['calendar-row', 'calendar-row--empty'],
  attributeBindings: ['data-test-es'],
  'data-test-es': 'empty-row',
});
