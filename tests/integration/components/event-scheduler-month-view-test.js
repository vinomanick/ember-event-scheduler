import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find, click } from '@ember/test-helpers';
import { triggerDrop } from 'dummy/tests/helpers/utils/scheduler-util';
import wait from 'ember-test-helpers/wait';
import { setupScheduler, renderScheduler } from 'dummy/tests/test-support';
import { selectChoose } from 'ember-power-select/test-support/helpers';

const SELECTORS = {
  event: '[data-test-es=event-wrapper]',
  selectOptions: '.ember-power-select-option'
};

module('Integration | Component | event-scheduler | Month view', function(hooks) {
  setupRenderingTest(hooks);
  setupScheduler(hooks);

  let dataTransfer;

  hooks.beforeEach(function() {
    dataTransfer = new DataTransfer();
  });

  module('event drop test', function(hooks) {
    let slotWidth = 120;
    let viewStart, startTime, endTime, element, data, dropTime;

    hooks.beforeEach(async function() {
      this.set('selectedView', 'month');
      await renderScheduler();
      element = find(`[data-resource-id="${this.resourceId}"]`);
      element.classList.add('activated');

      data = {
        id: 2,
        offset: 4,
        startTime: this.currentDate.clone().add(4, 'h').toISOString(),
        endTime: this.currentDate.clone().add(7, 'h').toISOString(),
        title: 'Event 2'
      };
      dataTransfer.setData('text/data', JSON.stringify(data));
      viewStart = this.currentDate.clone().startOf('month');
      dropTime = viewStart.clone().add(2, 'd');
      startTime = dropTime.clone().add(4, 'h').toISOString();
      endTime = dropTime.clone().add(7, 'h').toISOString();
    });

    function validate(assert, dropEvent) {
      assert.deepEqual(JSON.parse(dropEvent.dataTransfer.getData('text/data')), data);
      assert.dom(element).doesNotHaveClass('activated');
      assert.equal(this.onEventDropSpy.calledWith({ id: data.id, resourceId: this.resourceId, startTime, endTime, title: data.title }), true);
      assert.equal(find(`[data-resource-id="${this.resourceId}"]`).querySelectorAll(SELECTORS.event).length, 2);
    }

    test('should place the event at the respective cell and remove the activated class on drop', async function(assert) {
      assert.dom(element).hasClass('activated');
      let eventDropPosition = 2 * slotWidth;
      let dropEvent = triggerDrop.call(this, element, data.offset + eventDropPosition, dataTransfer);

      return wait().then(validate.bind(this, assert, dropEvent));
    });

    test('should place the event at the respective cell and set the start and end time to prev start and end time if present', async function(assert) {
      assert.dom(element).hasClass('activated');
      let eventDropPosition = 2 * slotWidth;
      dataTransfer.setData('text/data', JSON.stringify(data));
      let dropEvent = triggerDrop.call(this, element, data.offset + eventDropPosition, dataTransfer);

      return wait().then(validate.bind(this, assert, dropEvent));
    });

    test('should place the event at respective cell and set start and end times to prev times based on selected duration if end time is absent', async function(assert) {
      assert.dom(element).hasClass('activated');
      endTime = dropTime.clone().add(5, 'h').toISOString();

      let eventDropPosition = 2 * slotWidth;
      data.endTime = null;
      dataTransfer.setData('text/data', JSON.stringify(data));
      let dropEvent = triggerDrop.call(this, element, data.offset + eventDropPosition, dataTransfer);

      return wait().then(validate.bind(this, assert, dropEvent));
    });

    test('should show popup when prev start time is empty and set date as dropped date, startTime to selected choice, duration as selected duration', async function(assert) {
      assert.dom(element).hasClass('activated');
      startTime = dropTime.clone().add(1, 'h').toISOString();
      endTime = dropTime.clone().add(2, 'h').toISOString();

      let eventDropPosition = 2 * slotWidth;
      data.startTime = null;
      data.endTime = null;
      dataTransfer.setData('text/data', JSON.stringify(data));
      let dropEvent = triggerDrop.call(this, element, data.offset + eventDropPosition, dataTransfer);

      return wait().then(async() => {
        assert.deepEqual(JSON.parse(dropEvent.dataTransfer.getData('text/data')), data);
        assert.dom(element).doesNotHaveClass('activated');
        assert.dom('[data-test-es="time-dialog-title"]').exists();
        await selectChoose('[data-test-es="start-time-field"]', SELECTORS.selectOptions, 2);
        return wait().then(async() => {
          await click('[data-test-es="update-time"]');
          assert.equal(this.onEventDropSpy.calledWith({ id: data.id, resourceId: this.resourceId, startTime, endTime, title: data.title }), true);
          assert.equal(find(`[data-resource-id="${this.resourceId}"]`).querySelectorAll(SELECTORS.event).length, 2);
        });
      });
    });

    test('should show popup when prev start time is empty and ignore the drop action when user failed to set the start time', async function(assert) {
      assert.dom(element).hasClass('activated');
      startTime = dropTime.clone().add(1, 'h').toISOString();
      endTime = dropTime.clone().add(2, 'h').toISOString();

      let eventDropPosition = 2 * slotWidth;
      data.startTime = null;
      data.endTime = null;
      dataTransfer.setData('text/data', JSON.stringify(data));
      let dropEvent = triggerDrop.call(this, element, data.offset + eventDropPosition, dataTransfer);

      return wait().then(async() => {
        assert.deepEqual(JSON.parse(dropEvent.dataTransfer.getData('text/data')), data);
        assert.dom(element).doesNotHaveClass('activated');
        assert.dom('[data-test-es="time-dialog-title"]').exists();
        await selectChoose('[data-test-es="start-time-field"]', SELECTORS.selectOptions, 2);
        await click('[data-test-es="cancel-update-time"]');
        assert.equal(this.onEventDropSpy.calledOnce, false);
        assert.equal(find(`[data-resource-id="${this.resourceId}"]`).querySelectorAll(SELECTORS.event).length, 1);
      });
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
      let eventDropPosition = (31 * slotWidth) - 5;
      startTime = viewStart.clone().add({ days: 30, hours: 4 }).toISOString();
      endTime = viewStart.clone().add({ days: 30, hours: 7 }).toISOString();

      let dropEvent = triggerDrop.call(this, element, data.offset + eventDropPosition, dataTransfer);

      return wait().then(validate.bind(this, assert, dropEvent));
    });
  });
});
