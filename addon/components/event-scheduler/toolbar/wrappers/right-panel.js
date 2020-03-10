import Component from '@ember/component';
import layout from '../../../../templates/components/event-scheduler/toolbar/wrappers/right-panel';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  moment: service(),
  intl: service(),
  layout,
  viewsList: computed(function() {
    return Object.keys(this.get('views'));
  }),

  classNames: ['es-toolbar__panel', 'align-items--center'],
  actions: {
    changeEventDuration(newDuration) {
      this.onDurationChange(newDuration);
    },
    changeView(view) {
      this.onViewChange(view);
    }
  }
});
