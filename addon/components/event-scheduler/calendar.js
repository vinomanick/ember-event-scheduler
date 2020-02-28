import Component from '@ember/component';
import layout from '../../templates/components/event-scheduler/calendar';

export default Component.extend({
  layout,
  classNames: ['es-calendar'],
  attributeBindings: ['data-test-es'],
  'data-test-es': 'es-calendar',
});
