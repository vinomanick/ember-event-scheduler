import Component from '@ember/component';
import layout from '../../../../../templates/components/event-scheduler/calendar/wrappers/event/event-card';
import { reads } from '@ember/object/computed';
import { get, computed, set, getProperties } from '@ember/object';
import { htmlSafe } from '@ember/template';

export default Component.extend({
  layout,
  classNames: ['event-wrapper'],
  classNameBindings: ['isExtendedLeft:extended-left', 'isExtendedRight:extended-right', 'dragState'],
  attributeBindings: ['style', 'data-test-es', 'data-event-id', 'draggable'],
  'data-test-es': 'event-wrapper',
  'data-event-id': reads('event.id'),
  style: computed('eventStartPosition', 'eventEndPosition', function() {
    let _columnStart = get(this, 'isExtendedLeft') ? 1 : get(this, 'eventStartPosition');
    let _columnEnd = get(this, 'isExtendedRight') ? get(this, 'slotsLength') + 1 : get(this, 'eventEndPosition');
    return htmlSafe(`grid-column-start:${_columnStart}; grid-column-end:${_columnEnd}`);
  }),
  isExtendedLeft: computed('eventStartPosition', function() {
    return get(this, 'eventStartPosition') < 1;
  }),
  isExtendedRight: computed('eventEndPosition', function() {
    return get(this, 'eventEndPosition') > get(this, 'slotsLength') + 1;
  }),
  dragStart(event) {
    if (get(this, 'draggable')) {
      let offset = 4;
      let schedulerEvent = get(this, 'event');
      let { id, startTime, endTime } = getProperties(schedulerEvent, ['id', 'startTime', 'endTime']);
      let data = { id, startTime, endTime, offset };
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