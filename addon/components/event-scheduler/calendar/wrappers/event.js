import Component from '@ember/component';
import layout from '../../../../templates/components/event-scheduler/calendar/wrappers/event';
import { get, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import moment from 'moment';
import { htmlSafe } from '@ember/template';

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
  eventStyle: computed('eventStartPosition', 'eventEndPosition', function() {
    let _columnStart = get(this, 'isExtendedLeft') ? 1 : get(this, 'eventStartPosition');
    let _columnEnd = get(this, 'isExtendedRight') ? get(this, 'slotsLength') + 1 : get(this, 'eventEndPosition');
    return htmlSafe(`grid-column-start:${_columnStart}; grid-column-end:${_columnEnd}`);
  }),
  isExtendedLeft: computed('eventStartPosition', function() {
    return get(this, 'eventStartPosition') < 1;
  }),
  isExtendedRight: computed('eventEndPosition', function() {
    return get(this, 'eventEndPosition') > get(this, 'slotsLength') + 1;
  }),
  getGridPosition(time) {
    let _selectedDate = get(this, 'selectedDate').clone().startOf(get(this, 'viewType'));
    let timeDifference = get(this, 'moment').moment(time).diff(_selectedDate);
    let { format, value } = get(this, 'slotInterval');
    let timeDuration = moment.duration(timeDifference).as(format);
    return (timeDuration / value) + 1;
  }
});

