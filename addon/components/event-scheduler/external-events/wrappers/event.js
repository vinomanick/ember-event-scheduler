import Component from '@ember/component';
import layout from '../../../../templates/components/event-scheduler/external-events/wrappers/event';
import { reads } from '@ember/object/computed';
import { computed } from '@ember/object';
import { getExternalEventPeriod } from '../../../../utils/event-scheduler';
import { inject as service } from '@ember/service';

const dateTimeFormat = 'DD MMM, hh:mm A';
const timeFormat =  'hh:mm A';

export default Component.extend({
  moment: service(),
  intl: service(),
  layout,
  classNames: ['external-event-wrapper'],
  attributeBindings: ['data-test-es', 'data-external-event-id', 'draggable', 'data-name'],
  'data-test-es': 'external-event-wrapper',
  'data-name': 'event',
  'data-external-event-id': reads('event.id'),
  serviceTime: computed('event.{startTime,endTime}', function() {
    let { startTime, endTime } = this.get('event');
    let serviceTime = getExternalEventPeriod(startTime, endTime, dateTimeFormat, timeFormat, this.get('moment'));
    return serviceTime || '--';
  })
});
