import Component from '@ember/component';
import layout from 'ember-event-scheduler/templates/components/event-scheduler/calendar';
import { inject as service } from '@ember/service';
import EmberObject, { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { A } from '@ember/array';
import { VIEWS } from 'ember-event-scheduler/constants/event-scheduler';
import {
  getResourceElement,
  getColumnStart,
  getStartTimeOffset,
  buildEventTime,
  getResourceId
} from 'ember-event-scheduler/utils/event-drop';
import {
  getSlots
} from 'ember-event-scheduler/utils/event-scheduler';
import {
  getDurationInFormat,
  getTimeDropdownChoices
} from 'ember-event-scheduler/utils/date-util';
import calendarData from 'ember-event-scheduler/mixins/calendar-data';


export default Component.extend(calendarData, {
  moment: service(),
  layout,
  classNames: ['es-calendar'],
  classNameBindings: ['viewClass', 'monthViewClass'],
  attributeBindings: ['data-test-es'],
  'data-test-es': 'es-calendar',
  isLoading: true,
  isEventsDraggable: reads('config.events.draggable'),
  viewType: reads('viewConfig.type'),
  timePickerConfig: reads('config.timePicker'),
  slotInterval: reads('slotConfig.interval'),
  slotsLength: reads('slots.length'),

  slots: computed('viewType', 'selectedDate', function() {
    let _viewType = this.viewType;
    return _viewType === VIEWS.DAY
      ? this.daySlots
      : getSlots(this.selectedDate, this.slotConfig);
  }),
  daySlots: computed(function() {
    return getSlots(this.moment.moment(), this.slotConfig);
  }),
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

  init() {
    this._super(...arguments);
    this.setProperties( { events: EmberObject.create(), resources: A() });
  },

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
