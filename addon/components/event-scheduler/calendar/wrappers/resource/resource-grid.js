import Component from '@ember/component';
import layout from '../../../../../templates/components/event-scheduler/calendar/wrappers/resource/resource-grid';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  moment: service(),
  layout,
  classNames: ['calendar__row__grid'],
  attributeBindings: ['data-test-es', 'data-resource-id', 'data-name'],
  'data-resource-id': reads('resourceId'),
  'data-name': 'resource',
  'data-test-es': 'resource-grid',
  actions: {
    // updateStartTime(eventData, startTimeOffset) {
    //   this.set('displayTimeFieldDialog', false);
    //   // this.triggerDropAction(eventData, startTimeOffset);
    // }
  }
});
