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
import { getDurationInFormat, getTimeDropdownChoices } from '../../utils/date-util';

export default Component.extend({
  moment: service(),
  layout,
  classNames: ['es-container'],
  attributeBindings: ['data-test-es'],
  'data-test-es': 'es-container',
  selectedDate: reads('calendarInst.selectedDate'),
  selectedDuration: reads('calendarInst.selectedDuration'),
  viewType: reads('calendarInst.viewType'),
  timePickerConfig: reads('calendarInst.viewConfig.timePicker'),
  viewClass: computed('viewType', function() {
    return `${this.get('viewType')}-view`;
  }),
  timeFieldChoices: computed(function() {
    let { selectedDate, timePickerConfig } = this.getProperties(['selectedDate', 'timePickerConfig']);
    return getTimeDropdownChoices(selectedDate, timePickerConfig);
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

    updateStartTime(eventData, selectedTime) {
      this.set('displayTimeFieldDialog', false);
      let startTimeOffset = { value: selectedTime, format: this.get('timePickerConfig.format') };
      this.triggerDropAction(eventData, startTimeOffset);
    },

    changeDateView(selectedDate) {
      this.get('calendarInst').refreshCalendar(selectedDate, VIEWS.DAY);
      this.onCalendarRefresh();
    }
  },

  triggerDropAction(eventData, startTimeOffset) {
    let { selectedDate, slotInterval, viewType, moment }
      = this.get('calendarInst').getProperties(['selectedDate', 'slotInterval', 'viewType', 'moment']);
    let { id, startTime: prevStartTime, endTime: prevEndTime, title } = eventData;

    let resourceId = getResourceId(eventData.resourceElement);
    let columnStart = this._getColumnStart(eventData);
    let _startTimeOffset = getStartTimeOffset(viewType, prevStartTime, startTimeOffset, moment);
    let eventDuration = getDurationInFormat(prevStartTime, prevEndTime) || this.get('selectedDuration');

    let { startTime, endTime } = buildEventTime(viewType, selectedDate, columnStart, slotInterval, _startTimeOffset, eventDuration);
    let updatedEvent = { id, resourceId, startTime, endTime, title };
    this.get('calendarInst').updateEvent(updatedEvent);
    this.onEventDrop(updatedEvent);
  },

  _getColumnStart(eventData) {
    let { clientX, offset, resourceElement } = eventData;
    return getColumnStart(resourceElement, clientX, offset);
  }
});
