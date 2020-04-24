import Mixin from '@ember/object/mixin';
import { getCustomEventId } from 'ember-event-scheduler/utils/event-scheduler';
import EmberObject, { setProperties } from '@ember/object';

export default Mixin.create({
  // Events manipulation
  addEvents(events = []) {
    let _events = this.events;
    events.forEach((event) => {
      _events.set(getCustomEventId(event.id), event);
    });
  },

  updateEvent(event) {
    let _event = this.findEvent(event.id);
    if (_event) {
      let { startTime, endTime, resourceId } = event;
      setProperties(_event, { startTime, endTime, resourceId });
    }
  },

  removeEvent(event) {
    let _events = this.events;
    let eventId = getCustomEventId(event.id);
    if (_events.eventId) {
      _events.set(eventId, undefined);
    }
  },

  findEvent(id) {
    let _events = this.events;
    let eventId = getCustomEventId(id);
    return _events[eventId];
  },

  deleteAllEvents() {
    let _events = this.events;
    Object.values(_events).forEach((eventObj) => eventObj.destroy());
    this.set('events', EmberObject.create());
  },
});