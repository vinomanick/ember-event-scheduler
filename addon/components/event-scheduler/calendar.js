import Component from '@ember/component';
import layout from '../../templates/components/event-scheduler/calendar';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { VIEWS } from '../../constants/event-scheduler';
import {
  getResourceElement,
  getColumnStart,
  getStartTimeOffset,
  buildEventTime,
  getResourceId
} from '../../utils/event-drop';
import { getDurationInFormat } from '../../utils/date-util';

export default Component.extend({
  moment: service(),
  layout,
  classNames: ['es-calendar'],
  classNameBindings: ['viewClass'],
  attributeBindings: ['data-test-es'],
  'data-test-es': 'es-calendar',
  viewType: reads('calendarInst.viewType'),
  timePicketFormat: reads('calendarInst.viewConfig.timePickerConfig.format'),
  viewClass: computed('viewType', function() {
    return `${this.get('viewType')}-view`;
  }),

  actions: {
    draggedOver(event) {
      event.dataTransfer.dropEffect = 'copyMove';
      event.preventDefault();
      let resourceElement = getResourceElement(event.target);
      if(resourceElement) {
        resourceElement.classList.add('activated');
      }
    },
    draggedAway(event) {
      event.preventDefault();
      let resourceElement = getResourceElement(event.target);
      if(resourceElement) {
        resourceElement.classList.remove('activated');
      }
    },
    droppedEvent(event) {
      event.preventDefault();
      let resourceElement = getResourceElement(event.target);
      if(resourceElement) {
        resourceElement.classList.remove("activated");
        let eventData = JSON.parse(event.dataTransfer.getData('text/data'));
        eventData.resourceElement = resourceElement;
        eventData.clientX = event.clientX;

        if (this.get('viewType') !== VIEWS.DAY && !eventData.startTime) {
          this.set('displayTimeFieldDialog', eventData);
          return;
        }

        this.triggerDropAction(eventData);
      }
    },
  },

  triggerDropAction(eventData, startTimeOffsetValue) {
    let { selectedDate, slotInterval, viewType }
      = this.get('calendarInst').getProperties(['selectedDate', 'slotInterval', 'viewType']);
    let { id, startTime: prevStartTime, endTime: prevEndTime, title } = eventData;

    let resourceId = getResourceId(eventData.resourceElement);
    let columnStart = this._getColumnStart(eventData);
    let startTimeOffset = this._getStartTimeOffset(startTimeOffsetValue, prevStartTime);
    let eventDuration = getDurationInFormat(prevStartTime, prevEndTime) || this.get('selectedDuration');

    let { startTime, endTime } = buildEventTime(viewType, selectedDate, columnStart, slotInterval, startTimeOffset, eventDuration);
    let updatedEvent = { id, resourceId, startTime, endTime, title };
    this.get('calendarInst').updateEvent(updatedEvent);
    this.onEventDrop(updatedEvent);
  },

  _getColumnStart(eventData) {
    let { clientX, offset, resourceElement } = eventData;
    return getColumnStart(resourceElement, clientX, offset);
  },

  _getStartTimeOffset(startTimeOffsetValue, prevStartTime) {
    let { viewType, timePicketFormat, moment } = this.getProperties(['viewType', 'timePicketFormat', 'moment']);
    if(startTimeOffsetValue) {
      let offset = { value: startTimeOffsetValue, format: timePicketFormat};
      return getStartTimeOffset(viewType, prevStartTime, offset, moment);
    }
  }
});
