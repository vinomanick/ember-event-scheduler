import Component from '@ember/component';
import layout from '../../../../../templates/components/event-scheduler/calendar/wrappers/event/event-card';
import { reads } from '@ember/object/computed';
import { get, set, getProperties } from '@ember/object';
import TransitionMixin from 'ember-css-transitions/mixins/transition-mixin';

export default Component.extend(TransitionMixin,{
  layout,
  classNames: ['event-wrapper'],
  classNameBindings: ['event.isExtendedLeft:extended-left', 'event.isExtendedRight:extended-right', 'dragState'],
  attributeBindings: ['event.style:style', 'data-test-es', 'data-event-id', 'draggable'],
  transitionClass: 'event-wrapper',
  'data-test-es': 'event-wrapper',
  'data-event-id': reads('event.id'),

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
