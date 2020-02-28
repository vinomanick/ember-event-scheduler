import Component from '@ember/component';
import layout from '../../templates/components/event-scheduler/external-events';

export default Component.extend({
  layout,
  classNames: ['es-external-events'],
  attributeBindings: ['data-test-es'],
  'data-test-es': 'es-external-events',
});
