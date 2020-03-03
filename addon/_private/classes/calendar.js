import EmberObject, { computed, get, set } from '@ember/object';
import { reads } from '@ember/object/computed';
import { assert } from '@ember/debug';
import { isPresent } from '@ember/utils';
import { run } from '@ember/runloop';
import { VIEWS } from '../../constants/event-scheduler';
import { getSlots, getCustomEventId, buildCalendarEvent } from '../../utils/event-scheduler';
// import { inject as service } from '@ember/service';

export default EmberObject.extend({
  // moment: service(),
  // calendarEvents: undefined,
  // selectedDate: undefined,
  // selectedView: VIEWS.DAY,

  isEventsDraggable: reads('config.events.draggable'),
  viewType: reads('viewConfig.type'),
  slotConfig: reads('viewConfig.slot'),
  slotInterval: reads('slotConfig.interval'),
  slotFormat: reads('slotConfig.format'),
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
    let { config, selectedDate, selectedView, moment }
      = this.getProperties(['config', 'selectedDate', 'selectedView', 'moment']);

    assert('config is required', isPresent(config));
    assert('selected date is required', isPresent(selectedDate));
    assert('selected view is required', isPresent(selectedView));
    assert('moment  is required', isPresent(moment));

    this.set('events', EmberObject.create());
    this.set('resources', []);
  },

  // Resources manipulation
  addResources(resources = []) {
    let calendarResources = this.get('resources');
    resources.forEach(({ id, name }) => {
      calendarResources.push({ id, name });
    });
  },

  deleteAllResources() {
    this.get('resources').clear();
  },

  // Events manipulation
  addEvents(events = []) {
    let { events: _events, moment }
      = this.getProperties(['events', 'moment']);
    events.forEach((event) => {
      let eventObj = buildCalendarEvent(event, this, moment)
      set(_events, getCustomEventId(event.id), eventObj);
    });
  },

  updateEvent(event) {
    let { id } = event;
    let _event = this.findEvent(id);
    if (_event) {
      this.removeEvent(id);
      run.next(() => this.addEvents([event]));
    } else {
      this.addEvents([event]);
    }
  },

  findEvent(id) {
    let _events = this.get('events');
    let eventId = getCustomEventId(id);
    return _events[eventId];
  },

  removeEvent(id) {
    let _events = this.get('events');
    let eventId = getCustomEventId(id);
    let eventObj = get(_events, eventId);
    if (eventObj) {
      eventObj.destroy();
    }
    delete _events[eventId];
  },

  deleteAllEvents() {
    let _events = this.get('events');
    _events.forEach((eventObj) => eventObj.destroy());
    set(this, _events, {});
  }

});