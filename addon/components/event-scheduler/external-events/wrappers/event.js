import Component from '@ember/component';
import layout from '../../../../templates/components/event-scheduler/external-events/wrappers/event';
import { reads } from '@ember/object/computed';

export default Component.extend({
  layout,
  classNames: ['external-event-wrapper'],
  attributeBindings: ['data-test-es', 'data-external-event-id', 'draggable', 'data-name'],
  'data-test-es': 'external-event-wrapper',
  'data-name': 'event',
  'data-external-event-id': reads('event.id')
});
