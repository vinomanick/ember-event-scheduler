// BEGIN-SNIPPET demo-events.js
import Component from '@ember/component';
import layout from '../templates/components/scheduling-dashboard';
import { config } from '../constants/demo-events';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';
import { buildResources, buildEvents } from '../utils/entity-builder';

export default Component.extend({
  moment: service(),
  layout,
  config,
  isExternalEventsExpanded: true,
  isCalendarLoading: true,
  isExternalEventsLoading: true,
  isExternalEventsLoadedAll: false,
  init() {
    this._super(...arguments);
    this.setProperties({
      selectedView: 'week',
      viewType: 'week',
      selectedDate: this.moment.moment().startOf('day'),
      selectedDuration: { value: 90, format: 'minute' }
    });
  },

  actions: {
    loadScheduler(publicApi) {
      this.set('publicApi', publicApi);

      this.setProperties({
        isCalendarLoading: false,
        isExternalEventsLoading: false,
        resourcesData: buildResources(20)
      });
      this.addCalendarData();
      this.addExternalEventsData();
    },

    updateEventTicket(updatedEvent) {
      let { id, startTime, endTime, resourceId } = updatedEvent;
      startTime = this.moment.moment(startTime).format('DD-MM-YYYY hh:mma');
      endTime = this.moment.moment(endTime).format('DD-MM-YYYY hh:mma');
      alert(`
      Event ${id} is updated with
      resource - ${resourceId},
      startTime - ${startTime},
      endTime -  ${endTime}`);
    },

    changeDateView(selectedDate, selectedView) {
      this.setProperties({ selectedDate, selectedView});
      this.updateCalendarData();
    },

    changeView(selectedView, viewType) {
      this.setProperties({ selectedView, viewType });
      this.updateCalendarData();
    },
    changeDate(selectedDate) {
      this.set('selectedDate', selectedDate);
      this.updateCalendarData();
    },
    changeDuration(selectedDuration) {
      this.set('selectedDuration', selectedDuration);
    },
    toggleExternalEvent() {
      this.toggleProperty('isExternalEventsExpanded');
    }
  },

  updateCalendarData() {
    this.publicApi.actions.resetCalendar();
    this.set('isCalendarLoading', true);
    run.later(() => {
      this.set('isCalendarLoading', false);
      this.addCalendarData();
    }, 1000);
  },

  addExternalEventsData() {
    let externalEventswithAppointments = buildEvents(this.selectedDate, this.viewType, 5, 21, false);
    let externalEventswithNoAppointments = buildEvents(this.selectedDate, this.viewType, 15, 26, true);
    let externalEventsData = [...externalEventswithAppointments, ...externalEventswithNoAppointments];
    this.publicApi.actions.resetExternalEvents();
    this.publicApi.actions.add('externalEvents', externalEventsData);
  },

  addCalendarData() {
    let eventsData= buildEvents(this.selectedDate, this.viewType, 20, 1, true);
    this.publicApi.actions.add('resources', this.resourcesData);
    this.publicApi.actions.add('events', eventsData);
  }
});
// END-SNIPPET
