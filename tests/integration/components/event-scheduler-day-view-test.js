import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find } from '@ember/test-helpers';
import { triggerDrop } from 'dummy/tests/helpers/utils/scheduler-util';
import wait from 'ember-test-helpers/wait';
import { setupScheduler, renderScheduler } from 'dummy/tests/test-support';

const SELECTORS = {
  event: '[data-test-es=event-wrapper]'
};

module('Integration | Component | event-scheduler | Day view', function(hooks) {
  setupRenderingTest(hooks);
  setupScheduler(hooks);

  let dataTransfer;

  hooks.beforeEach(function() {
    dataTransfer = new DataTransfer();
  });

  module('event drop test', function(hooks) {
    let slotWidth = 50;
    let startTime, endTime, element, data, dropTime;

    hooks.beforeEach(async function() {
      await renderScheduler();
      element = find(`[data-resource-id="${this.resourceId}"]`);
      element.classList.add('activated');
      data = { id: 2, offset: 4, startTime: null, endTime: null, title: 'Event 2' };
      dataTransfer.setData('text/data', JSON.stringify(data));
      dropTime = this.currentDate.clone().add(1, 'h');
      startTime = dropTime.toISOString();
      endTime = dropTime.clone().add(1, 'h').toISOString();
    });

    function validate(assert, dropEvent) {
      assert.deepEqual(JSON.parse(dropEvent.dataTransfer.getData('text/data')), data);
      assert.dom(element).doesNotHaveClass('activated');
      assert.equal(this.onEventDropSpy.calledWith({ id: data.id, resourceId: this.resourceId, startTime, endTime, title: data.title }), true);
      assert.equal(find(`[data-resource-id="${this.resourceId}"]`).querySelectorAll(SELECTORS.event).length, 2);
    }

    test('vino should place the event at the respective cell and remove the activated class on drop', async function(assert) {
      assert.dom(element).hasClass('activated');

      let eventDropPosition = 2 * slotWidth;
      let dropEvent = triggerDrop.call(this, element, data.offset + eventDropPosition, dataTransfer);

      return wait().then(validate.bind(this, assert, dropEvent));
    });

    test('should place the event at the respective cell and set the duration to prev event duration', async function(assert) {
      assert.dom(element).hasClass('activated');
      endTime = dropTime.clone().add(2, 'h').toISOString();

      let eventDropPosition = 2 * slotWidth;
      data.startTime = this.currentDate.clone().add(10, 'h').toISOString();
      data.endTime = this.currentDate.clone().add(12, 'h').toISOString();
      dataTransfer.setData('text/data', JSON.stringify(data));
      let dropEvent = triggerDrop.call(this, element, data.offset + eventDropPosition, dataTransfer);

      return wait().then(validate.bind(this, assert, dropEvent));
    });

    test('should place the event at the same cell when dropped between 0 to 80% of the placed cell width', async function(assert) {
      assert.dom(element).hasClass('activated');
      let eventDropPosition = (2 * slotWidth) + 5;

      let dropEvent = triggerDrop.call(this, element, data.offset + eventDropPosition, dataTransfer);

      return wait().then(validate.bind(this, assert, dropEvent));
    });

    test('should place the event at the next cell when dropped between 80% to 100% of the placed cell width', async function(assert) {
      assert.dom(element).hasClass('activated');
      let eventDropPosition = (2 * slotWidth) - 5;
      let dropEvent = triggerDrop.call(this, element, data.offset + eventDropPosition, dataTransfer);

      return wait().then(validate.bind(this, assert, dropEvent));
    });

    test('should place the event at the last cell when dropped between 0 to 100% of the last cell', async function(assert) {
      assert.dom(element).hasClass('activated');
      let eventDropPosition = (48 * slotWidth) - 5;
      startTime = this.currentDate.clone().add({ hours: 23, minutes: 30 }).toISOString();
      endTime = this.currentDate.clone().add({ hours: 24, minutes: 30 }).toISOString();

      let dropEvent = triggerDrop.call(this, element, data.offset + eventDropPosition, dataTransfer);

      return wait().then(validate.bind(this, assert, dropEvent));
    });
  });
});
