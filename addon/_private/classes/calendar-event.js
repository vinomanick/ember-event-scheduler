import EmberObject, { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { assert } from '@ember/debug';
import { isPresent } from '@ember/utils';
// import { inject as service } from '@ember/service';
import moment from 'moment';
import { getEventMandates } from '../../utils/event-scheduler';

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
  },

  updateEvent({ startTime, endTime, resourceId }) {
    let _prevData = getEventMandates(this);
    this.setProperties({ startTime, endTime, resourceId, _prevData });
  },

  revertEvent() {
    let _prevData = this._prevData;
    if (_prevData) {
      let { startTime, endTime, resourceId } = _prevData;
      this.setProperties({ startTime, endTime, resourceId, _prevData: null });
      return true;
    }
    return false;
  }
});
