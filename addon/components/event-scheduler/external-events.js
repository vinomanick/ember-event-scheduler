import EmberObject from '@ember/object';
import Component from '@ember/component';
import layout from '../../templates/components/event-scheduler/external-events';
import { getEventElement, getEventId } from '../../utils/event-drag';
import { getCustomEventId } from '../../utils/event-scheduler';
import externalEventsData from 'ember-event-scheduler/mixins/external-events-data';

export default Component.extend(externalEventsData, {
  layout,
  classNames: ['es-external-events'],
  attributeBindings: ['data-test-es'],
  'data-test-es': 'es-external-events',
  isLoading: true,
  isAllLoaded: false,

  init() {
    this._super(...arguments);
    this.set('events', EmberObject.create());
  },

  actions: {
    dragStarted(event) {
      let eventElement = getEventElement(event.target);
      if(eventElement) {
        let offset = 4;
        let eventId = getEventId(eventElement);
        let externalEvent = this.events[getCustomEventId(eventId)];
        let { id, startTime, endTime, title } = externalEvent;
        let data = { id, startTime, endTime, title, offset };
        eventElement.classList.add('dragged');
        event.dataTransfer.setData('text/data', JSON.stringify(data));
        event.dataTransfer.effectAllowed = 'copy';
        event.dataTransfer.setDragImage(eventElement, offset, offset);
      }
    },
    dragEnded() {
      let eventElement = getEventElement(event.target);
      if(eventElement) {
        eventElement.classList.remove('dragged');
      }
    }
  }
});
