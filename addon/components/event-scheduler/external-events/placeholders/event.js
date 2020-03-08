import Component from '@ember/component';
import layout from '../../../../templates/components/event-scheduler/external-events/placeholders/event';

export default Component.extend({
  layout,
  classNames: ['placeholder-loader', 'external-event-wrapper', 'external-event-wrapper--placeholder'],
  attributeBindings: ['data-test-es'],
  'data-test-es': 'external-event-loader'
});
