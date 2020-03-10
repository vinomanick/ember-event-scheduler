import Component from '@ember/component';
import layout from '../templates/components/scheduling-dashboard';
import { config } from '../constants/scheduling-dashboard';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';

// const resources = {
//   100: { id: 100, name: 'vino'},
//   101: { id: 101, name: 'Ram'},
//   102: { id: 102, name: 'Sri'},
//   103: { id: 103, name: 'Dinesh'},
//   104: { id: 104, name: 'Preeti'},
//   105: { id: 105, name: 'Swathi'},
//   106: { id: 106, name: 'Chira'},
//   107: { id: 107, name: 'Ramya'},
//   108: { id: 108, name: 'Selvi'},
//   109: { id: 109, name: 'Manickam'},
//   110: { id: 110, name: 'Venki'},
//   111: { id: 111, name: 'Puneet'},
//   112: { id: 112, name: 'Sengo'},
//   113: { id: 113, name: 'Vignesh'},
//   114: { id: 114, name: 'Deepak'},
//   115: { id: 115, name: 'Harish'}
// };

const resources = [
  { id: 100, name: 'vino'},
  { id: 101, name: 'Ram'},
  { id: 102, name: 'Sri'},
  { id: 103, name: 'Dinesh'},
  { id: 104, name: 'Preeti'},
  { id: 105, name: 'Swathi'},
  { id: 106, name: 'Chira'},
  { id: 107, name: 'Ramya'},
  { id: 108, name: 'Selvi'},
  { id: 109, name: 'Manickam'},
  { id: 110, name: 'Venki'},
  { id: 111, name: 'Puneet'},
  { id: 112, name: 'Sengo'},
  { id: 113, name: 'Vignesh'},
  { id: 114, name: 'Deepak'},
  { id: 115, name: 'Harish'}
];

const events = [
  { id: '1', resourceId: '101', title: 'First service task for Puneet', startTime: "2020-03-06T10:00:00+05:30", endTime: "2020-03-06T11:00:00+05:30" },
  { id: '2', resourceId: '101', title: 'Second service task for Puneet', startTime: "2020-03-05T10:30:00+05:30", endTime: "2020-03-05T12:00:00+05:30"  },
  { id: '4', resourceId: '102', title: 'First service task for Balaji',  startTime: "2020-03-03T12:00:00+05:30", endTime: "2020-03-03T13:00:00+05:30" },
  { id: '5', resourceId: '102', title: 'Second service task for Balaji',  startTime: "2020-03-06T15:00:00+05:30", endTime: "2020-03-06T18:00:00+05:30" },
  { id: '6', resourceId: '103', title: 'First service task for Sengo', startTime: "2020-03-06T12:00:00+05:30", endTime: "2020-03-06T13:00:00+05:30" },
  { id: '7', resourceId: '104', title: 'First service task for Deepak', startTime: "2020-03-06T10:00:00+05:30", endTime: "2020-03-06T10:30:00+05:30" },
  { id: '8', resourceId: '106', title: 'First service task for Supraja', startTime: "2020-03-06T10:30:00+05:30", endTime: "2020-03-06T12:00:00+05:30"  },
  { id: '9', resourceId: '101', title: 'Fourth service task for Puneet', startTime: "2020-03-06T08:00:00+05:30", endTime: "2020-03-06T08:30:00+05:30" },
  { id: '10', resourceId: '101', title: 'Fifth service task for Puneet', startTime: "2020-03-06T09:00:00+05:30", endTime: "2020-03-06T09:30:00+05:30" },
];

const externalEventsData = [
  { id: '11', resourceId: '103', title: 'Second service task for Sengo', startTime: null, endTime: null },
  { id: '1', resourceId: '101', title: 'First service task for Puneet', startTime: "2020-03-06T10:00:00+05:30", endTime: "2020-03-06T11:00:00+05:30" },
  { id: '2', resourceId: '101', title: 'Second service task for Puneet', startTime: "2020-03-05T10:30:00+05:30", endTime: "2020-03-05T12:00:00+05:30"  },
  { id: '4', resourceId: '102', title: 'First service task for Balaji',  startTime: "2020-03-03T12:00:00+05:30", endTime: "2020-03-03T13:00:00+05:30" },
  { id: '5', resourceId: '102', title: 'Second service task for Balaji',  startTime: "2020-03-06T15:00:00+05:30", endTime: "2020-03-06T18:00:00+05:30" },
  { id: '6', resourceId: '103', title: 'First service task for Sengo', startTime: "2020-03-06T12:00:00+05:30", endTime: "2020-03-06T13:00:00+05:30" },
  { id: '7', resourceId: '104', title: 'First service task for Deepak', startTime: "2020-03-06T10:00:00+05:30", endTime: "2020-03-06T10:30:00+05:30" },
  { id: '8', resourceId: '106', title: 'First service task for Supraja', startTime: "2020-03-06T10:30:00+05:30", endTime: "2020-03-06T12:00:00+05:30"  },
  { id: '9', resourceId: '101', title: 'Fourth service task for Puneet', startTime: "2020-03-06T08:00:00+05:30", endTime: "2020-03-06T08:30:00+05:30" },
  { id: '10', resourceId: '101', title: 'Fifth service task for Puneet', startTime: "2020-03-06T09:00:00+05:30", endTime: "2020-03-06T09:30:00+05:30" },
  { id: '3', resourceId: '101', title: 'Third service task for Puneet', startTime: "2020-03-06T15:00:00+05:30", endTime: "2020-03-06T16:00:00+05:30" },
];

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

  actions: {
    loadScheduler(scheduler){
      this.set('schedulerInst', scheduler);
      this.set('calendarInst', scheduler.get('calendar'));
      this.set('externalEventsInst', scheduler.get('externalEvents'));
      this.addData();
    },

    updateEventTicket(updatedEvent) {
      // eslint-disable-next-line no-console
      console.log('Update event called', updatedEvent);
      // let calendar = this.calendarInst');
      // run.next(() => calendar.removeEvent(updatedEvent.id));
    },

    updateCalendar() {
      let calendar = this.calendarInst;
      run.later(() => {
        calendar.set('isLoading', false);
        calendar.addResources(resources);
        calendar.addEvents(events);
      }, 1000);

    }
  },

  addData() {
    let calendar = this.calendarInst;
    let externalEvents = this.externalEventsInst;
    run.later(() => {
      calendar.set('isLoading', false);
      calendar.addResources(resources);
      calendar.addEvents(events);
      externalEvents.set('isLoading', false);
      externalEvents.addEvents(externalEventsData);
      externalEvents.set('isAllLoaded', true);
    }, 1000);
  }
});
