import Component from '@ember/component';
import layout from '../../../templates/components/event-scheduler/ui-components/button-throttle';
import { run } from '@ember/runloop';

export default Component.extend({
  layout,
  tagName: 'button',
  classNames: ['btn'],
  attributeBindings: ['type', 'data-test-id', 'aria-label', 'disabled'],
  type: 'button',
  click() {
    run.throttle(this, this._click, this.throttleSpeed || 500);
  },
  _click() {
    this.onclick();
  }
});
