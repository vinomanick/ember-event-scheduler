import Component from '@ember/component';
import layout from '../../../../templates/components/event-scheduler/calendar/wrappers/resource-header';

export default Component.extend({
  layout,
  classNames: ['calendar-row__name'],
  attributeBindings: ['data-test-es'],
  'data-test-es': 'resource-header'
});
