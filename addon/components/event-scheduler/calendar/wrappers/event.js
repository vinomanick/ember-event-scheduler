import Component from '@ember/component';
import layout from '../../../../templates/components/event-scheduler/calendar/wrappers/event';
import { computed } from '@ember/object';
import { VIEWS } from '../../../../constants/event-scheduler';
import {
  getEventPeriodDayView,
  getEventPeriodCompact
} from '../../../../utils/event-scheduler';
import { inject as service } from '@ember/service';

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
  canDisplayEvent: computed('resource', 'event.isValidEvent', function() {
    return this.resource && this.event.isValidEvent;
  }),
  appointmentDuration: computed('event.{startTime,endTime}', function() {
    let { viewType, moment } = this;
    let { startTime, endTime } = this.event;
    return viewType === VIEWS.DAY
      ? getEventPeriodDayView(startTime, endTime, moment)
      : getEventPeriodCompact(startTime, endTime, moment);
  })
});

