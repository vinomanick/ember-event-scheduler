import Component from '@ember/component';
import layout from '../templates/components/scheduling-dashboard';
import { config } from '../constants/scheduling-dashboard';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';
import { buildResources, buildEvents } from '../utils/entity-builder';

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
      // eslint-disable-next-line no-console
      console.log('Update event called', updatedEvent);
      // run.later(() => this.publicApi.actions.revertEvent(updatedEvent.id), 2000);
    },

    changeDateView(selectedDate, selectedView) {
      this.set('selectedDate', selectedDate);
      this.set('selectedView', selectedView);
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
