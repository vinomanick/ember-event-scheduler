import Component from '@ember/component';
import layout from '../../../../../templates/components/event-scheduler/calendar/wrappers/event/event-card';
import { reads } from '@ember/object/computed';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/template';

export default Component.extend({
  layout,
  classNames: ['event-wrapper'],
  classNameBindings: ['isExtendedLeft:extended-left', 'isExtendedRight:extended-right', 'dragState'],
  attributeBindings: ['style', 'data-test-es', 'data-event-id', 'draggable'],
  'data-test-es': 'event-wrapper',
  'data-event-id': reads('event.id'),
  style: computed('startPosition', 'endPosition', function() {
    let _columnStart = this.isExtendedLeft ? 1 : this.startPosition;
    let _columnEnd = this.isExtendedRight ? this.slotsLength + 1 : this.endPosition;
    return htmlSafe(`grid-column-start:${_columnStart}; grid-column-end:${_columnEnd}`);
  }),

  isExtendedLeft: computed('startPosition', function() {
    return this.startPosition < 1;
  }),

  isExtendedRight: computed('endPosition', function() {
    return this.endPosition > this.slotsLength + 1;
  }),

  dragStart(event) {
    if (this.draggable) {
      let offset = 4;
      let schedulerEvent = this.event;
      let { id, startTime, endTime, title } = schedulerEvent;
      let data = { id, startTime, endTime, offset, title };
      this.set('dragState', 'dragged');
      event.dataTransfer.setData('text/data', JSON.stringify(data));
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setDragImage(event.target, offset, offset);
    }
  },
  dragEnd() {
    this.set('dragState', null);
  }
});
