import EmberObject, { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { assert } from '@ember/debug';
import { isPresent } from '@ember/utils';
import CalendarEvent from './calendar-event';
import { VIEWS } from '../../constants/event-scheduler';
import { getSlots, getCustomResourceId, getCustomEventId } from '../../utils/event-scheduler';
import { inject as service } from '@ember/service';

export default EmberObject.extend({
  moment: service(),
  // calendarEvents: undefined,
  // selectedDate: undefined,
  // selectedView: VIEWS.DAY,

  isEventsDraggable: reads('config.events.draggable'),
  viewType: reads('viewConfig.type'),
  timePickerConfig: reads('viewConfig.timePicker'),
  slotConfig: reads('viewConfig.slot'),
  slotInterval: reads('slotConfig.interval'),
  slotsLength: reads('slots.length'),

  viewConfig: computed('selectedView', function() {
    let _selectedView = this.get('selectedView');
    let _views = this.get('config.views');
    return _views[_selectedView];
  }),

  slots: computed('viewType', 'selectedDate', function() {
    let _viewType = this.get('viewType');
    let { duration, interval,  startAt } = this.get('slotConfig');
    return _viewType === VIEWS.DAY
      ? this.get('daySlots')
      : getSlots(this.get('selectedDate'), { duration, interval, startAt, startOf: _viewType });
  }),
  daySlots: computed(function() {
    let startOf = VIEWS.DAY;
    let { duration, interval,  startAt } = this.get('slotConfig');
    return getSlots(this.get('moment').moment(), { duration, interval, startAt, startOf });
  }),

  init() {
    assert('config is required', isPresent(this.get('config')));
    assert('selected date is required', isPresent(this.get('selectedDate')));
    assert('selected view is required', isPresent(this.get('selectedView')));

    this.set('events', new Map());
    this.set('resources', []);
  },

  // Resources manipulation
  addResources(resources = []) {
    let calendarResources = this.get('resources');
    resources.forEach(({ id, name }) => {
      calendarResources.pushObject(getCustomResourceId(id), { id, name });
    });
  },

  deleteAllResources() {
    this.get('resources').clear();
  },

  // Events manipulation
  addEvents(events = []) {
    let _events = this.get('events');
    let { selectedDate, slotInterval, slotsLength, viewType }
      = this.getProperties(['selectedDate', 'slotInterval', 'slotsLength', 'viewType']);
    events.forEach(({ id, startTime, endTime }) => {
      let eventObj = new CalendarEvent({
        id,
        startTime,
        endTime,
        selectedDate,
        slotInterval,
        slotsLength,
        viewType
      });
      _events.set(getCustomEventId(id), eventObj);
    });
  },

  removeEvent(id) {
    let _events = this.get('_events');
    let eventId = getCustomEventId(id);
    let eventObj = _events.get(eventId);
    if (eventObj) {
      eventObj.destroy();
      _events.delete(eventId);
    }
  },

  deleteAllEvents() {
    let _events = this.get('_events');
    _events.forEach((eventObj) => eventObj.destroy());
    _events.clear();
  }

});