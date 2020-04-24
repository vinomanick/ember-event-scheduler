import Component from '@ember/component';
import layout from '../../../../templates/components/event-scheduler/calendar/wrappers/event';
import { computed } from '@ember/object';
import { VIEWS } from '../../../../constants/event-scheduler';
import {
  getEventPeriodDayView,
  getEventPeriodCompact
} from '../../../../utils/event-scheduler';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default Component.extend({
  moment: service(),
  intl: service(),
  VIEWS,
  layout,
  tagName: '',
  resource: computed('event.resourceId', function() {
    let _resourceId = this.event.resourceId;
    return document.querySelector(`[data-resource-id="${_resourceId}"]`);
  }),
  canDisplayEvent: computed('resource', function() {
    return this.resource
      && (this.startPosition <= this.slotsLength && this.endPosition > 1);
  }),
  startPosition: computed('event.startTime', function() {
    return Math.floor(this.getGridPosition(this.event.startTime));
  }),
  endPosition: computed('event.endTime', function() {
    return Math.ceil(this.getGridPosition(this.event.endTime));
  }),
  appointmentDuration: computed('event.{startTime,endTime}', function() {
    let { viewType, moment } = this;
    let { startTime, endTime } = this.event;
    return viewType === VIEWS.DAY
      ? getEventPeriodDayView(startTime, endTime, moment)
      : getEventPeriodCompact(startTime, endTime, moment);
  }),
  getGridPosition(time) {
    let { selectedDate, viewType, slotInterval: { format, value } }
      = this;
    let _selectedDate = selectedDate.clone().startOf(viewType);
    let timeDifference = this.moment.moment(time).diff(_selectedDate);
    let timeDuration = moment.duration(timeDifference).as(format);
    return (timeDuration / value) + 1;
  },
});
