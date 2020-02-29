import EmberObject from '@ember/object';
import { reads } from '@ember/object/computed';
import { assert } from '@ember/debug';
import { isPresent } from '@ember/utils';
import CalendarEvent from './event';

export default EmberObject.extend({
  calendarEvents: undefined,
  slotInterval: reads('slotConfig.internal'),
  slotsLength: reads('slots.length'),

  init() {
    assert('selected date is required', isPresent(this.get('selectedDate')));
    assert('slotConfig is required', isPresent(this.get('slotConfig')));
    assert('slots is required', isPresent(this.get('slots')));

    this.set('calendarEvents', new Map());
  },

  addEvents(events = []) {
    let calendarEvents = this.get('calendarEvents');
    let { selectedDate, slotInterval, slotsLength, viewType }
      = this.getProperties(['selectedDate', 'slotInterval', 'slotsLength', 'viewType']);
    events.forEach(({ id, startTime, endTime }) => {
      let eventObj = CalendarEvent.create({
        id,
        startTime,
        endTime,
        selectedDate,
        slotInterval,
        slotsLength,
        viewType
      });
      calendarEvents.set(`event-${id}`, eventObj);
    });
  }
});