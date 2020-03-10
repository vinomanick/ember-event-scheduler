import Component from '@ember/component';
import layout from '../../../../../templates/components/event-scheduler/calendar/wrappers/event/event-card';
import { reads } from '@ember/object/computed';

export default Component.extend({
  layout,
  classNames: ['event-wrapper'],
  classNameBindings: ['event.isExtendedLeft:extended-left', 'event.isExtendedRight:extended-right', 'dragState'],
  attributeBindings: ['event.style:style', 'data-test-es', 'data-event-id', 'draggable'],
  'data-test-es': 'event-wrapper',
  'data-event-id': reads('event.id'),

  dragStart(event) {
    if (this.draggable) {
      let offset = 4;
      let schedulerEvent = this.event;
      let { id, startTime, endTime, title } = schedulerEvent;
      let data = { id, startTime, endTime, offset, title };
      this.dragState = 'dragged';
      event.dataTransfer.setData('text/data', JSON.stringify(data));
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setDragImage(event.target, offset, offset);
    }
  },
  dragEnd() {
    this.dragState = null;
  }
});