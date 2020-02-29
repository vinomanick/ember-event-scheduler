import Component from '@ember/component';
import layout from '../../../../../templates/components/event-scheduler/calendar/wrappers/resource/resource-grid';
import { get, set, getProperties, setProperties } from '@ember/object';
import { reads } from '@ember/object/computed';
import { getColumnFromPos, buildEventTime, getEventDuration, overrideTime } from '../../../../../utils/event-scheduler';
import { inject as service } from '@ember/service';
import { VIEWS } from '../../../../../constants/event-scheduler';

export default Component.extend({
  moment: service(),
  layout,
  classNames: ['calendar-row__grid'],
  classNameBindings: ['dragClass'],
  attributeBindings: ['data-test-es', 'data-resource-id', 'data-test-es'],
  'data-resource-id': reads('resourceId'),
  'data-test-es': 'resource-grid',
  timePickerConfig: reads('viewConfig.timePicker'),
  didRender() {
    this._super(...arguments);
    let elementStyle = window.getComputedStyle(this.element);
    let slotsArray = elementStyle.gridTemplateColumns.split(' ');
    set(this, 'slotsLength', slotsArray.length);
    set(this, 'slotWidth', parseFloat(slotsArray[0]));
  },

  dragOver(event) {
    event.dataTransfer.dropEffect = 'copyMove';
    event.preventDefault();
    set(this, 'dragClass', 'activated');
  },
  drop(event) {
    let eventData = JSON.parse(event.dataTransfer.getData('text/data'));
    let { offset, startTime } = eventData;
    let position = event.clientX - offset - get(this, 'element').getBoundingClientRect().left;
    eventData.position = position;
    if (get(this, 'viewType') !== VIEWS.DAY && !startTime) {
      setProperties(this, { dragClass: undefined, displayTimeFieldDialog: eventData });
      return;
    }
    this.triggerDropAction(eventData);
  },
  dragLeave(event) {
    event.preventDefault();
    set(this, 'dragClass', undefined);
  },

  triggerDropAction(eventData, startTimeOffset) {
    let { selectedDate, slotConfig: { interval }, viewType } = getProperties(this, ['selectedDate', 'slotConfig', 'viewType']);
    let { id, position, startTime: prevStartTime, endTime: prevEndTime } = eventData;
    let resourceId = get(this, 'resourceId');
    let columnStart = getColumnFromPos(position, get(this, 'slotWidth'), get(this, 'slotsLength'));

    let duration = this.getDuration(prevStartTime, prevEndTime);
    let offsetDuration = this.getOffsetDuration(viewType, prevStartTime, startTimeOffset);
    let { startTime, endTime } = buildEventTime(viewType, selectedDate, columnStart, offsetDuration, duration, interval);
    this.onEventDrop({ id, resourceId, startTime, endTime });
    set(this, 'dragClass', undefined);
  },

  getDuration(prevStartTime, prevEndTime) {
    let prevDuration = getEventDuration(prevStartTime, prevEndTime);
    return prevDuration || get(this, 'selectedDuration');
  },
  getOffsetDuration(viewType, prevStartTime, offset) {
    let _moment = get(this, 'moment');
    if (viewType === VIEWS.DAY) {
      return;
    }
    if (offset) {
      let startOfDay = _moment.moment().startOf('day').toISOString();
      let overrideConfig = { value: offset, format: get(this, 'timePickerConfig.format') };
      let dateWithNewTime = overrideTime(startOfDay, overrideConfig, _moment);
      return getEventDuration(startOfDay, dateWithNewTime);
    }
    let prevStartOfDay = _moment.moment(prevStartTime).startOf('day').toISOString();
    return getEventDuration(prevStartOfDay, prevStartTime);
  },

  actions: {
    updateStartTime(eventData, startTimeOffset) {
      set(this, 'displayTimeFieldDialog', false);
      this.triggerDropAction(eventData, startTimeOffset);
    }
  }
});
