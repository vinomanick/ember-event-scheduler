import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find } from '@ember/test-helpers';
import { setupScheduler, renderScheduler } from 'dummy/tests/test-support';
import wait from 'ember-test-helpers/wait';

module('Integration | Component | event-scheduler | Drag test', function(hooks) {
  setupRenderingTest(hooks);
  setupScheduler(hooks);

  let element, dataTransfer;

  hooks.beforeEach(function() {
    dataTransfer = new DataTransfer();
  });

  module('Calendar events drag test', function(hooks) {

    hooks.beforeEach(async function() {
      let data = { id: 2, offset: 4, startTime: null, endTime: null, title: 'Event 2' };
      dataTransfer.setData('text/data', JSON.stringify(data));
      await renderScheduler();
      element = find(`[data-resource-id="${this.resourceId}"]`);
    });

    test('should add activated class when an event is dragged over the grid', async function(assert) {
      assert.dom(element).doesNotHaveClass('activated');

      let dragOverEvent = new DragEvent('dragover', {
        view: window, bubbles: true, cancelable: true, dataTransfer
      });
      element.dispatchEvent(dragOverEvent);
      return wait().then(() => {
        assert.dom(element).hasClass('activated');
      });
    });

    test('should remove activated class when an event is dragged out of the grid', async function(assert) {
      element.classList.add('activated');
      assert.dom(element).hasClass('activated');

      let dragLeaveEvent = new DragEvent('dragleave', {
        view: window, bubbles: true, cancelable: true, dataTransfer
      });
      element.dispatchEvent(dragLeaveEvent);
      return wait().then(() => {
        assert.dom(element).doesNotHaveClass('activated');
      });
    });

  });

  module('External events drag test', function(hooks) {

    hooks.beforeEach(async function() {
      await renderScheduler();
      element = find(`[data-external-event-id="${this.eventId}"]`);
    });

    test('should add dragged class when the event is dragged', async function(assert) {
      assert.dom(element).hasAttribute('draggable', 'true');

      let dragStartEvent = new DragEvent('dragstart', {
        view: window, bubbles: true, cancelable: true, dataTransfer
      });
      element.dispatchEvent(dragStartEvent);

      let startTime = this.currentDate.clone().set({ h: 2, m: 0 }).toISOString();
      let endTime = this.currentDate.clone().set({ h: 3, m: 0 }).toISOString();

      return wait().then(() => {
        assert.deepEqual(JSON.parse(dragStartEvent.dataTransfer.getData('text/data')), {
          id: 1, offset: 4, startTime, endTime, title: 'First event for Resource 1'
        });
        assert.dom(element).hasClass('dragged');
      });
    });

    test('should remove the dragged class when the drag is stopped', async function(assert) {
      element.classList.add('dragged');
      assert.dom(element).hasClass('dragged');

      let dragEndEvent = new DragEvent('dragend', {
        view: window, bubbles: true, cancelable: true, dataTransfer
      });
      element.dispatchEvent(dragEndEvent);
      return wait().then(() => {
        assert.dom(element).doesNotHaveClass('dragged');
      });
    });
  });
});
