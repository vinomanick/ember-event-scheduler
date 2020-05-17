import Mixin from '@ember/object/mixin';
import {
  getEventMandates
} from 'ember-event-scheduler/utils/event-scheduler';
import { run } from '@ember/runloop';
import EmberObject from '@ember/object';
import { inject as service } from '@ember/service';

const TYPES = {
  EVENT: 'events',
  EXTERNAL_EVENT: 'externalEvents',
  RESOURCE: 'resources'
};

export default Mixin.create({
  store: service(),

  add(type, data = []) {
    let _data = this.get(type);
    data.forEach((item) => {
      let record;
      if ([TYPES.EVENT, TYPES.EXTERNAL_EVENT].includes(type)) {
        let event = this.get(type).get(item.id);

        // Event already present so ignoring it
        if(event) {
          return null;
        }

        record = this.store.peekRecord('event', item.id);
        let { id, startTime, endTime, resourceId, title } = item;
        if (record) {
          record.setProperties({ startTime, endTime, resourceId });
          type === TYPES.EVENT ? record.set('isCalendarEvent', true) : record.set('isExternalEvent', true);
        } else {
          let isCalendarEvent = type === TYPES.EVENT;
          record = this.store.createRecord('event', {
            id,
            startTime,
            endTime,
            resourceId,
            title,
            isCalendarEvent,
            isExternalEvent: !isCalendarEvent
          });
        }
      } else if (type === TYPES.RESOURCE) {
        record = this.store.peekRecord('resource', item.id);
        let { id, name } = item;
        if(!record) {
          record = this.store.createRecord('resource', { id, name });
        }
      }
      _data.set(item.id, record);
    });
  },

  update(type, item) {
    let event = this.get(type).get(item.id);
    let record = this.store.peekRecord('event', item.id);
    if(record) {
      let prevData = getEventMandates(record);
      record.set('prevData', prevData);
    }
    if(event) {
      let { id, startTime, endTime, resourceId } = item;
      record.setProperties({ startTime, endTime, resourceId });

      this.events.set(id, undefined);
      run.next(() => this.events.set(id, record));
    } else {
      this.add(TYPES.EVENT, [item]);
    }
  },

  revertEvent(id) {
    let event = this.events.get(id);
    if(event) {
      let record = this.store.peekRecord('event', id);
      if(record.prevData) {
        let { startTime, endTime, resourceId, isCalendarEvent } = record.prevData;
        record.setProperties({ startTime, endTime, resourceId, isCalendarEvent, prevData: null });

        if (isCalendarEvent) {
          this.events.set(id, undefined);
          run.next(() => this.events.set(id, record));
        } else {
          this.delete(TYPES.EVENT, id);
        }
      }
    }
  },

  delete(type, id) {
    let _data = this.get(type);
    if (_data.get(id)) {
      this.clearStore(type, id);
      _data.set(id, undefined); // This will trigger the observers/computed properties
      delete _data[id]; // This will delete the property from the object
    }
  },

  clearStore(type, id) {
    if (type === TYPES.EVENT) {
      let record = this.store.peekRecord('event', id);
      !record.isExternalEvent && this.store.unloadRecord(record);
    } else if(type === TYPES.EXTERNAL_EVENT) {
      let record = this.store.peekRecord('event', id);
      !record.isCalendarEvent && this.store.unloadRecord(record);
    } else if (type === TYPES.RESOURCE) {
      let record = this.store.peekRecord('resource', id);
      this.store.unloadRecord(record);
    }
  },

  deleteAll(types) {
    types.forEach((type) => {
      if([TYPES.EVENT, TYPES.EXTERNAL_EVENT].includes(type)) {
        let _data = this.get(type);
        Object.keys(_data).forEach((id) => {
          let event = _data.get(id);
          if((type === TYPES.EVENT && !event.isExternalEvent)
            || (type === TYPES.EXTERNAL_EVENT && !event.isCalendarEvent)) {
            this.store.unloadRecord(event);
          }
        });
      } else if (type === TYPES.RESOURCE) {
        this.store.unloadAll('resource');
      }
      this.set(type, EmberObject.create())
    });
  },

  resetCalendar() {
    this.deleteAll(['events', 'resources']);
  },

  resetExternalEvents() {
    this.deleteAll(['externalEvents']);
  }
});
