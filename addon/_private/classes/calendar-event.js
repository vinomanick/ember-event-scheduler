import EmberObject, { computed } from '@ember/object';
import { assert } from '@ember/debug';
import { isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';
import moment from 'moment';
import { htmlSafe } from '@ember/template';

export default EmberObject.extend({
  moment: service(),
  // id: undefined,
  // startTime: undefined,
  // endTime: undefined,
  // viewType: undefined,
  // selectedDate: undefined,
  // slotInterval: undefined,
  // slotsLength: undefined,

  resource: computed('resourceId', function() {
    let _resourceId = this.get('resourceId');
    return document.querySelector(`[data-resource-id="${_resourceId}"]`);
  }),

  canDisplayEvent: computed('resource', function() {
    return this.get('resource')
      && (this.get('startPosition') <= this.get('slotsLength') && this.get('endPosition') > 1);
  }),

  startPosition: computed('startTime', function() {
    return Math.floor(this.getGridPosition(this.get('startTime')));
  }),
  endPosition: computed('endTime', function() {
    return Math.floor(this.getGridPosition(this.get('endTime')));
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
    assert('selected date is required', isPresent(this.get('selectedDate')));
    assert('view type is required', isPresent(this.get('viewType')));
    assert('slot interval is required', isPresent(this.get('slotInterval')));
    assert('slots length is required', isPresent(this.get('slotsLength')));
    assert('event should have an id', isPresent(this.get('id')));
    assert('start time is required', isPresent(this.get('startTime')));
    assert('end time is required', isPresent(this.get('endTime')));
  },

  _getGridPosition(time) {
    let { selectedDate, viewType, slotInterval: { format, value } }
      = this.getProperties(['selectedDate', 'viewType', 'slotInterval'])
    let _selectedDate = selectedDate.clone().startOf(viewType);
    let timeDifference = this.get('moment').moment(time).diff(_selectedDate);
    let timeDuration = moment.duration(timeDifference).as(format);
    return (timeDuration / value) + 1;
  }
});
