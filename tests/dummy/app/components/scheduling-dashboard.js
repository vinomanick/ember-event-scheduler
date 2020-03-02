import Component from '@ember/component';
import layout from '../templates/components/scheduling-dashboard';
import { config } from '../constants/scheduling-dashboard';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

const resources = {
  100: { id: 100, name: 'vino'},
  101: { id: 101, name: 'Ram'},
  102: { id: 102, name: 'Sri'},
  103: { id: 103, name: 'Dinesh'},
  104: { id: 104, name: 'Preeti'},
  105: { id: 105, name: 'Swathi'},
  106: { id: 106, name: 'Chira'},
  107: { id: 107, name: 'Ramya'},
  108: { id: 108, name: 'Selvi'},
  109: { id: 109, name: 'Manickam'},
  110: { id: 110, name: 'Venki'},
  111: { id: 111, name: 'Puneet'},
  112: { id: 112, name: 'Sengo'},
  113: { id: 113, name: 'Vignesh'},
  114: { id: 114, name: 'Deepak'},
  115: { id: 115, name: 'Harish'}
};

const events = [
  { id: '1', resourceId: '101', title: 'First service task for Puneet', startTime: "2020-03-02T10:00:00+05:30", endTime: "2020-03-02T11:00:00+05:30" },
  { id: '2', resourceId: '101', title: 'Second service task for Puneet', startTime: "2019-06-13T10:30:00+05:30", endTime: "2019-06-13T12:00:00+05:30"  },
  { id: '3', resourceId: '101', title: 'Third service task for Puneet', startTime: "2020-03-02T15:00:00+05:30", endTime: "2020-03-02T16:00:00+05:30" },
  { id: '4', resourceId: '102', title: 'First service task for Balaji',  startTime: "2019-06-09T12:00:00+05:30", endTime: "2019-06-09T13:00:00+05:30" },
  { id: '5', resourceId: '102', title: 'Second service task for Balaji',  startTime: "2020-03-02T15:00:00+05:30", endTime: "2020-03-02T18:00:00+05:30" },
  { id: '6', resourceId: '103', title: 'First service task for Sengo', startTime: "2020-03-02T12:00:00+05:30", endTime: "2020-03-02T13:00:00+05:30" },
  { id: '7', resourceId: '104', title: 'First service task for Deepak', startTime: "2020-03-02T10:00:00+05:30", endTime: "2020-03-02T10:30:00+05:30" },
  { id: '8', resourceId: '106', title: 'First service task for Supraja', startTime: "2020-03-02T10:30:00+05:30", endTime: "2020-03-02T12:00:00+05:30"  },
  { id: '9', resourceId: '101', title: 'Fourth service task for Puneet', startTime: "2020-03-02T08:00:00+05:30", endTime: "2020-03-02T08:30:00+05:30" },
  { id: '10', resourceId: '101', title: 'Fifth service task for Puneet', startTime: "2019-06-14T09:00:00+05:30", endTime: "2019-06-14T09:30:00+05:30" },
];

export default Component.extend({
  moment: service(),
  layout,
  config,
  classNames: ['scheduling-dashboard'],
  attributeBindings: ['data-test-id'],
  'data-test-id': 'scheduling-dashboard',
  selectedDate: computed(function() {
    return this.get('moment').moment().startOf('day');
  }),
  actions: {
    loadScheduler(scheduler){
      this.set('schedulerInst', scheduler);
      this.set('calendarInst', scheduler.get('calendar'));
      console.log(this.get('calendarInst'));
    },

    addData() {
      let calendar = this.get('calendarInst');
      calendar.addResources(resources)
      calendar.addEvents(events)
    },

    updateEventTicket() {
      console.log('Update event called');
    }
  }
});
