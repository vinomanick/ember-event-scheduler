import Component from '@ember/component';
import layout from '../../../../templates/components/event-scheduler/calendar/wrappers/event';
import { computed } from '@ember/object';

export default Component.extend({
  layout,
  tagName: '',
  resource: computed('event.resourceId', function() {
    let _resourceId = this.get('event.resourceId');
    return document.querySelector(`[data-resource-id="${_resourceId}"]`);
  }),
  canDisplayEvent: computed('resource', 'event.isValidEvent', function() {
    return this.get('resource') && this.get('event.isValidEvent');
  })
});

