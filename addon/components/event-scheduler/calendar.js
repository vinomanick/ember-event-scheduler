import Component from '@ember/component';
import layout from 'ember-event-scheduler/templates/components/event-scheduler/calendar';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { VIEWS } from 'ember-event-scheduler/constants/event-scheduler';
import {
  getResourceElement,
  getColumnStart,
  getStartTimeOffset,
  buildEventTime,
  getResourceId
} from 'ember-event-scheduler/utils/event-drop';
import {
  getDurationInFormat,
  getTimeDropdownChoices
} from 'ember-event-scheduler/utils/date-util';

export default Component.extend({
  moment: service(),
  layout,
  classNames: ['es-calendar'],
  classNameBindings: ['viewClass', 'monthViewClass'],
  attributeBindings: ['data-test-es'],
  'data-test-es': 'es-calendar',
  isLoading: true,
  isEventsDraggable: reads('config.events.draggable'),
  timePickerConfig: reads('config.timePicker'),
  slotInterval: reads('slotConfig.interval'),
  slotsLength: reads('slots.length'),

  viewClass: computed('viewType', function() {
    return `${this.viewType}-view`;
  }),
  monthViewClass: computed('viewType', 'selectedDate', function() {
    if (this.viewType === VIEWS.MONTH) {
      return `month-${this.selectedDate.daysInMonth()}`;
    }
  }),
  timeFieldChoices: computed(function() {
    let { selectedDate, timePickerConfig } = this;
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

        if (this.viewType !== VIEWS.DAY && !eventData.startTime) {
          this.set('displayTimeFieldDialog', eventData);
          return;
        }

        this.triggerDropAction(eventData);
      }
    },

    updateStartTime(eventData, selectedTime) {
      this.set('displayTimeFieldDialog', false);
      let startTimeOffset = { value: selectedTime, format: this.timePickerConfig.format };
      this.triggerDropAction(eventData, startTimeOffset);
    },

    changeDateView(selectedDate) {
      this.calendarInst.refreshCalendar(selectedDate, VIEWS.DAY);
      this.onCalendarRefresh();
    }
  },

  triggerDropAction(eventData, startTimeOffset) {
    let { selectedDate, slotInterval, viewType, moment } = this.calendarInst;
    let { id, startTime: prevStartTime, endTime: prevEndTime, title } = eventData;

    let resourceId = getResourceId(eventData.resourceElement);
    let columnStart = this._getColumnStart(eventData);
    let _startTimeOffset = getStartTimeOffset(viewType, prevStartTime, startTimeOffset, moment);
    let eventDuration = getDurationInFormat(prevStartTime, prevEndTime) || this.selectedDuration;

    let { startTime, endTime } = buildEventTime(viewType, selectedDate, columnStart, slotInterval, _startTimeOffset, eventDuration);
    let updatedEvent = { id, resourceId, startTime, endTime, title };
    this.calendarInst.updateEvent(updatedEvent);
    this.onEventDrop(updatedEvent);
  },

  _getColumnStart(eventData) {
    let { clientX, offset, resourceElement } = eventData;
    return getColumnStart(resourceElement, clientX, offset);
  }
});
