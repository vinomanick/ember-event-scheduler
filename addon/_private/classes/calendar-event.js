import EmberObject, { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { assert } from '@ember/debug';
import { isPresent } from '@ember/utils';
// import { inject as service } from '@ember/service';
import moment from 'moment';
import { htmlSafe } from '@ember/template';

export default EmberObject.extend({
  // moment: service(),
  // id: undefined,
  // startTime: undefined,
  // endTime: undefined,
  // resourceId: undefined,
  slotsLength: reads('calendarInst.slotsLength'),

  isValidEvent: computed('resourceId', 'startPosition', 'endPosition', function() {
    return this.startPosition <= this.slotsLength && this.endPosition > 1;
  }),

  startPosition: computed('startTime', function() {
    return Math.floor(this.getGridPosition(this.startTime));
  }),
  endPosition: computed('endTime', function() {
    return Math.ceil(this.getGridPosition(this.endTime));
  }),

  isExtendedLeft: computed('startPosition', function() {
    return this.startPosition < 1;
  }),

  isExtendedRight: computed('endPosition', function() {
    return this.endPosition > this.slotsLength + 1;
  }),

  style: computed('startPosition', 'endPosition', function() {
    let _columnStart = this.isExtendedLeft ? 1 : this.startPosition;
    let _columnEnd = this.isExtendedRight ? this.slotsLength + 1 : this.endPosition;
    return htmlSafe(`grid-column-start:${_columnStart}; grid-column-end:${_columnEnd}`);
  }),

  init() {
    assert('calendar instance is required', isPresent(this.calendarInst));

    assert('event should have an id', isPresent(this.id));
    assert('start time is required', isPresent(this.startTime));
    assert('end time is required', isPresent(this.endTime));
    assert('resource id is required', isPresent(this.resourceId));
    assert('moment  is required', isPresent(this.moment));
  },

  getGridPosition(time) {
    let { selectedDate, viewType, slotInterval: { format, value } }
      = this.calendarInst;
    let _selectedDate = selectedDate.clone().startOf(viewType);
    let timeDifference = this.moment.moment(time).diff(_selectedDate);
    let timeDuration = moment.duration(timeDifference).as(format);
    return (timeDuration / value) + 1;
  }
});
