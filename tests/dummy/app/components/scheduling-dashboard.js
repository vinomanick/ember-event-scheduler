import Component from '@ember/component';
import layout from '../templates/components/scheduling-dashboard';
import { config } from '../constants/scheduling-dashboard';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';
import { buildResources, buildEvents } from '../utils/entity-builder';

// const externalEventsData = [
//   { id: '11', resourceId: '103', title: 'Second service task for Sengo', startTime: null, endTime: null },
//   { id: '12', resourceId: '101', title: 'Fifth service task for Puneet', startTime: null, endTime: null },
//   { id: '13', resourceId: '101', title: 'Sixth service task for Puneet', startTime: null, endTime: null },
//   { id: '4', resourceId: '102', title: 'First service task for Balaji',  startTime: "2020-03-03T12:00:00+05:30", endTime: "2020-03-03T13:00:00+05:30" },
//   { id: '5', resourceId: '102', title: 'Second service task for Balaji',  startTime: "2020-03-06T15:00:00+05:30", endTime: "2020-03-06T18:00:00+05:30" },
//   { id: '6', resourceId: '103', title: 'First service task for Sengo', startTime: "2020-03-06T12:00:00+05:30", endTime: "2020-03-06T13:00:00+05:30" },
//   { id: '7', resourceId: '104', title: 'First service task for Deepak', startTime: "2020-03-06T10:00:00+05:30", endTime: "2020-03-06T10:30:00+05:30" },
//   { id: '8', resourceId: '106', title: 'First service task for Supraja', startTime: "2020-03-06T10:30:00+05:30", endTime: "2020-03-06T12:00:00+05:30"  },
//   { id: '9', resourceId: '101', title: 'Fourth service task for Puneet', startTime: "2020-03-06T08:00:00+05:30", endTime: "2020-03-06T08:30:00+05:30" },
//   { id: '10', resourceId: '101', title: 'Fifth service task for Puneet', startTime: "2020-03-06T09:00:00+05:30", endTime: "2020-03-06T09:30:00+05:30" },
//   { id: '3', resourceId: '101', title: 'Third service task for Puneet', startTime: "2020-03-06T15:00:00+05:30", endTime: "2020-03-06T16:00:00+05:30" },
// ];

export default Component.extend({
  moment: service(),
  layout,
  config,
  classNames: ['scheduling-dashboard'],
  attributeBindings: ['data-test-id'],
  'data-test-id': 'scheduling-dashboard',
  selectedView: 'day',
  selectedDate: computed(function() {
    return this.moment.moment().startOf('day');
  }),
  selectedDuration: computed(function() {
    return { value: 90, format: 'minute' };
  }),

  init() {
    this._super(...arguments);
    this.resources = buildResources(10);
    this.events = buildEvents(10);
    this.externalEventsData = [...this.events.slice(0, 5), ...buildEvents(5, 11, false)];
    console.log(this.externalEventsData);
  },

  actions: {
    loadScheduler(scheduler){
      this.set('schedulerInst', scheduler);
      this.set('calendarInst', scheduler.calendar);
      this.set('externalEventsInst', scheduler.externalEvents);
      this.addData();
    },

    updateEventTicket(updatedEvent) {
      // eslint-disable-next-line no-console
      console.log('Update event called', updatedEvent);
      // let calendar = this.calendarInst;
      // run.later(() => calendar.revertEventUpdate(updatedEvent.id), 2000);
    },

    updateCalendar() {
      let calendar = this.calendarInst;
      run.later(() => {
        calendar.set('isLoading', false);
        calendar.addResources(this.resources);
        calendar.addEvents(this.events);
      }, 1000);

    }
  },

  addData() {
    let calendar = this.calendarInst;
    let externalEvents = this.externalEventsInst;
    run.later(() => {
      calendar.set('isLoading', false);
      calendar.addResources(this.resources);
      calendar.addEvents(this.events);
      externalEvents.set('isLoading', false);
      externalEvents.addEvents(this.externalEventsData);
      externalEvents.set('isAllLoaded', true);
    }, 1000);
  }
});
