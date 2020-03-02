import Component from '@ember/component';
import layout from '../../../../../templates/components/event-scheduler/calendar/wrappers/resource/resource-grid';
import { reads } from '@ember/object/computed';
// import { getColumnFromPos, buildEventTime, getEventDuration, overrideTime } from '../../../../../utils/event-scheduler';
import { inject as service } from '@ember/service';
import { VIEWS } from '../../../../../constants/event-scheduler';

export default Component.extend({
  moment: service(),
  layout,
  classNames: ['calendar__row__grid'],
  classNameBindings: ['dragClass'],
  attributeBindings: ['data-test-es', 'data-resource-id'],
  'data-resource-id': reads('resourceId'),
  'data-test-es': 'resource-grid',
  viewType: reads('calendarInst.viewType'),
  didRender() {
    this._super(...arguments);
    let elementStyle = window.getComputedStyle(this.element);
    let slotsArray = elementStyle.gridTemplateColumns.split(' ');
    this.set('slotsLength', slotsArray.length);
    this.set('slotWidth', parseFloat(slotsArray[0]));
  },

  dragOver(event) {
    event.dataTransfer.dropEffect = 'copyMove';
    event.preventDefault();
    this.set('dragClass', 'activated');
  },
  drop(event) {
    let eventData = JSON.parse(event.dataTransfer.getData('text/data'));
    let { offset, startTime } = eventData;
    let position = event.clientX - offset - this.get('element').getBoundingClientRect().left;
    eventData.position = position;
    if (this.get('viewType') !== VIEWS.DAY && !startTime) {
      this.setProperties({ dragClass: undefined, displayTimeFieldDialog: eventData });
      return;
    }
    // this.triggerDropAction(eventData);
  },
  dragLeave(event) {
    event.preventDefault();
    this.set('dragClass', undefined);
  },

  // triggerDropAction(eventData, startTimeOffset) {
  //   let { selectedDate, slotInterval, viewType }
  //     = this.getProperties(['selectedDate', 'slotInterval', 'viewType']);
  //   let { id, position, startTime: prevStartTime, endTime: prevEndTime } = eventData;
  //   let resourceId = this.get('resourceId');
  //   let columnStart = getColumnFromPos(position, this.get('slotWidth'), this.get('slotsLength'));

  //   let duration = this.getDuration(prevStartTime, prevEndTime);
  //   let offsetDuration = this.getOffsetDuration(viewType, prevStartTime, startTimeOffset);
  //   let { startTime, endTime } = buildEventTime(viewType, selectedDate, columnStart, offsetDuration, duration, slotInterval);
  //   this.onEventDrop({ id, resourceId, startTime, endTime });
  //   this.set('dragClass', undefined);
  // },

  // getDuration(prevStartTime, prevEndTime) {
  //   let prevDuration = getEventDuration(prevStartTime, prevEndTime);
  //   return prevDuration || this.get('selectedDuration');
  // },
  // getOffsetDuration(viewType, prevStartTime, offset) {
  //   let _moment = this.get('moment');
  //   if (viewType === VIEWS.DAY) {
  //     return;
  //   }
  //   if (offset) {
  //     let startOfDay = _moment.moment().startOf('day').toISOString();
  //     let overrideConfig = { value: offset, format: this.get('timePickerConfig.format') };
  //     let dateWithNewTime = overrideTime(startOfDay, overrideConfig, _moment);
  //     return getEventDuration(startOfDay, dateWithNewTime);
  //   }
  //   let prevStartOfDay = _moment.moment(prevStartTime).startOf('day').toISOString();
  //   return getEventDuration(prevStartOfDay, prevStartTime);
  // },

  actions: {
    updateStartTime(eventData, startTimeOffset) {
      this.set('displayTimeFieldDialog', false);
      // this.triggerDropAction(eventData, startTimeOffset);
    }
  }
});
