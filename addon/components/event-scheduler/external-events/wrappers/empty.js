import Component from '@ember/component';
import layout from '../../../../templates/components/event-scheduler/external-events/wrappers/empty';

export default Component.extend({
  layout,
  classNames: ['empty-message'],
  attributeBindings: ['data-test-es'],
  'data-test-es': 'external-events-empty',
});
