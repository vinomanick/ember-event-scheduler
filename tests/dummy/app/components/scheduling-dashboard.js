import Component from '@ember/component';
import layout from '../templates/components/scheduling-dashboard';
import { config } from '../constants/scheduling-dashboard';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';

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
  { id: '1', resourceId: '101', title: 'First service task for Puneet', startTime: "2020-04-24T10:00:00+05:30", endTime: "2020-04-24T11:00:00+05:30" },
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
  { id: '12', resourceId: '101', title: 'Fifth service task for Puneet', startTime: null, endTime: null },
  { id: '13', resourceId: '101', title: 'Sixth service task for Puneet', startTime: null, endTime: null },
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
  isExternalEventsExpanded: true,
  isCalendarLoading: true,
  isExternalEventsLoading: true,
  isExternalEventsLoadedAll: false,

  init() {
    this._super(...arguments);
    this.setProperties({
      selectedView: 'day',
      selectedDate: this.moment.moment().startOf('day'),
      selectedDuration: { value: 90, format: 'minute' }
    });
  },

  actions: {
    loadScheduler(publicApi){
      this.setProperties({
        isCalendarLoading: false,
        isExternalEventsLoading: false
      });
      this.publicApi = publicApi;
      this.addData();
    },

    updateEventTicket(updatedEvent) {
      // eslint-disable-next-line no-console
      console.log('Update event called', updatedEvent);
      // run.later(() => this.publicApi.actions.revertEvent(updatedEvent.id), 2000);
    },

    changeView(selectedView) {
      this.set('selectedView', selectedView);
      this.fetchData();
    },
    changeDate(selectedDate) {
      this.set('selectedDate', selectedDate);
      this.fetchData();
    },
    changeDateView(selectedDate, selectedView) {
      this.set('selectedDate', selectedDate);
      this.set('selectedView', selectedView);
      this.fetchData();
    },
    changeDuration(selectedDuration) {
      this.set('selectedDuration', selectedDuration);
    },
    toggleExternalEvent() {
      this.toggleProperty('isExternalEventsExpanded');
    }
  },

  fetchData() {
    this.set('isCalendarLoading', true);
    this.publicApi.actions.resetCalendar();
    run.later(() => {
      this.set('isCalendarLoading', false);
      this.publicApi.actions.add('resources', resources);
      this.publicApi.actions.add('events', events);
    }, 1000);
  },

  addData() {
    this.publicApi.actions.add('resources', resources);
    this.publicApi.actions.add('events', events);
    this.publicApi.actions.add('externalEvents', externalEventsData);
  }
});
