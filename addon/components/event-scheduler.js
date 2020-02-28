import Component from '@ember/component';
import layout from '../templates/components/event-scheduler';

export default Component.extend({
  layout,
  classNames: ['event-scheduler'],
  attributeBindings: ['data-test-es'],
  'data-test-es': 'event-scheduler',
});
