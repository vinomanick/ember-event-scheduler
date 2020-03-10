import Component from '@ember/component';
import layout from '../../templates/components/event-scheduler/toolbar';
import { reads } from '@ember/object/computed';

export default Component.extend({
  layout,
  classNames: ['es-toolbar'],
  attributeBindings: ['data-test-es'],
  'data-test-es': 'es-toolbar',

  selectedDate: reads('calendarInst.selectedDate'),
  selectedDuration: reads('calendarInst.selectedDuration'),
  selectedView: reads('calendarInst.selectedView'),
  viewType: reads('calendarInst.viewType'),
  toolbarConfig: reads('calendarInst.config.toolbar'),

  actions: {
    updateDateAndRefresh(newDate) {
      this.calendarInst.refreshCalendar(newDate);
      this.onCalendarRefresh();
    },
    updateDuration(newView) {
      this.calendarInst.setDuration(newView);
    },
    updateViewAndRefresh(view) {
      this.calendarInst.refreshCalendar(null, view);
      this.onCalendarRefresh();
    },
    updateEventsToggleState() {
      this.calendarInst.toggleProperty('isExternalEventsExpanded');
    }
  },


});
