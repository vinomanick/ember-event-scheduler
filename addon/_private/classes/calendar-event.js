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
    return this.get('startPosition') <= this.get('slotsLength') && this.get('endPosition') > 1;
  }),

  startPosition: computed('startTime', function() {
    return Math.floor(this.getGridPosition(this.get('startTime')));
  }),
  endPosition: computed('endTime', function() {
    return Math.ceil(this.getGridPosition(this.get('endTime')));
  }),

  isExtendedLeft: computed('startPosition', function() {
    return this.get('startPosition') < 1;
  }),

  isExtendedRight: computed('endPosition', function() {
    return this.get('endPosition') > this.get('slotsLength') + 1;
  }),

  style: computed('startPosition', 'endPosition', function() {
    let _columnStart = this.get('isExtendedLeft') ? 1 : this.get('startPosition');
    let _columnEnd = this.get('isExtendedRight') ? this.get('slotsLength') + 1 : this.get('endPosition');
    return htmlSafe(`grid-column-start:${_columnStart}; grid-column-end:${_columnEnd}`);
  }),

  init() {
    assert('calendar instance is required', isPresent(this.get('calendarInst')));

    assert('event should have an id', isPresent(this.get('id')));
    assert('start time is required', isPresent(this.get('startTime')));
    assert('end time is required', isPresent(this.get('endTime')));
    assert('resource id is required', isPresent(this.get('resourceId')));
    assert('moment  is required', isPresent(this.get('moment')));
  },

  getGridPosition(time) {
    let { selectedDate, viewType, slotInterval: { format, value } }
      = this.get('calendarInst').getProperties(['selectedDate', 'viewType', 'slotInterval'])
    let _selectedDate = selectedDate.clone().startOf(viewType);
    let timeDifference = this.get('moment').moment(time).diff(_selectedDate);
    let timeDuration = moment.duration(timeDifference).as(format);
    return (timeDuration / value) + 1;
  }
});
