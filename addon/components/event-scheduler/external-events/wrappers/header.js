import Component from '@ember/component';
import layout from '../../../../templates/components/event-scheduler/external-events/wrappers/header';

export default Component.extend({
  layout,
  classNames: ['external-events__header'],
  attributeBindings: ['data-test-es'],
  'data-test-es': 'external-events-header'
});
