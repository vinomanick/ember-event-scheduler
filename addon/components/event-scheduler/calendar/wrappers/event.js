import Component from '@ember/component';
import layout from '../../../../templates/components/event-scheduler/calendar/wrappers/event';
import { get, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default Component.extend({
  layout,
  moment: service(),
  resource: computed('event.resourceId', function() {
    let _resourceId = get(this, 'event.resourceId');
    return document.querySelector(`[data-resource-id="${_resourceId}"]`);
  }),
  canDisplayEvent: computed('resource', function() {
    return get(this, 'resource')
      && (get(this, 'eventStartPosition') <= get(this, 'slotsLength') && get(this, 'eventEndPosition') > 1);
  }),
  eventStartPosition: computed('event.startTime', function() {
    return Math.floor(this.getGridPosition(get(this, 'event.startTime')));
  }),
  eventEndPosition: computed('event.endTime', function() {
    return Math.ceil(this.getGridPosition(get(this, 'event.endTime')));
  }),
  getGridPosition(time) {
    let _selectedDate = get(this, 'selectedDate').clone().startOf(get(this, 'viewType'));
    let timeDifference = get(this, 'moment').moment(time).diff(_selectedDate);
    let { interval: { format, value } } = get(this, 'slotInterval');
    let timeDuration = moment.duration(timeDifference).as(format);
    return (timeDuration / value) + 1;
  }
});

