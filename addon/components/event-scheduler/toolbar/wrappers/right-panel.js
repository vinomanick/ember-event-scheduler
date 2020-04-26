import Component from '@ember/component';
import layout from '../../../../templates/components/event-scheduler/toolbar/wrappers/right-panel';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  moment: service(),
  intl: service(),
  layout,
  durationOptions: reads('durationConfig.options'),
  viewsList: computed(function() {
    return Object.keys(this.views);
  }),

  durationSelected: computed('selectedDuration', function() {
    let { format: selectedFormat, value: selectedValue } = this.selectedDuration;
    return this.durationOptions.find(({ format, value }) => format === selectedFormat && value === selectedValue);
  }),

  classNames: ['es-toolbar__panel', 'align-items--center'],
  actions: {
    changeEventDuration(newDuration) {
      this.onDurationChange && this.onDurationChange(newDuration);
    },
    changeView(view) {
      let { type } = this.views[view];
      this.onViewChange &&  this.onViewChange(view, type);
    }
  }
});
