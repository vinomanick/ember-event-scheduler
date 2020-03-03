import Component from '@ember/component';
import layout from '../../../../../templates/components/event-scheduler/calendar/wrappers/event/event-card';
import { reads } from '@ember/object/computed';
import { get, set, getProperties } from '@ember/object';

export default Component.extend({
  layout,
  classNames: ['event-wrapper'],
  classNameBindings: ['event.isExtendedLeft:extended-left', 'event.isExtendedRight:extended-right', 'dragState'],
  attributeBindings: ['event.style:style', 'data-test-es', 'data-event-id', 'draggable'],
  'data-test-es': 'event-wrapper',
  'data-event-id': reads('event.id'),

  dragStart(event) {
    if (get(this, 'draggable')) {
      let offset = 4;
      let schedulerEvent = get(this, 'event');
      let { id, startTime, endTime, title } = getProperties(schedulerEvent, ['id', 'startTime', 'endTime', 'title']);
      let data = { id, startTime, endTime, offset, title };
      set(this, 'dragState', 'dragged');
      event.dataTransfer.setData('text/data', JSON.stringify(data));
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setDragImage(event.target, offset, offset);
    }
  },
  dragEnd() {
    set(this, 'dragState', undefined);
  }
});