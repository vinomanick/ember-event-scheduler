import EmberObject, { computed, setProperties } from '@ember/object';
import { getCustomEventId } from '../../utils/event-scheduler';

export default EmberObject.extend({
  events: computed(function() {
    return EmberObject.create();
  }),

  // Events manipulation
  addEvents(events = []) {
    let _events = this.get('events');
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
    let _events = this.get('events');
    let eventId = getCustomEventId(event.id);
    if (_events.get(eventId)) {
      _events.set(eventId, undefined);
    }
  },

  findEvent(id) {
    let _events = this.get('events');
    let eventId = getCustomEventId(id);
    return _events.get(eventId);
  },
});