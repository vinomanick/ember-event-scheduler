import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupScheduler, renderScheduler } from 'dummy/tests/test-support';
import { getEventPosition } from 'dummy/tests/helpers/utils/scheduler-util';
import { find, settled } from '@ember/test-helpers';

const SELECTORS = {
  externalEvents: '[data-test-es=external-event-wrapper]',
  events: '[data-test-es=event-wrapper]',
  resources: '[data-test-es=resource]'
};

module('Integration | Component | event-scheduler | Public API', function(hooks) {
  setupRenderingTest(hooks);
  setupScheduler(hooks);

  let element;

  hooks.beforeEach(async function() {
    await renderScheduler();
  });

  test('#update - should update the calendar event and revert to original position if reverted', async function(assert) {
    element = find(SELECTORS.events);

    // Initial state assertions
    assert.equal(this.store.peekAll('event').length, 1);
    let { startPosition, endPosition } = getEventPosition(element);
    assert.equal(find(`[data-resource-id="${this.resourceId}"]`).querySelectorAll(SELECTORS.events).length, 1);
    assert.equal(startPosition, '5');
    assert.equal(endPosition, '7');


    this.publicApi.actions.update('events', {
      id: this.eventId,
      resourceId: this.resourceId2,
      title: 'First event for Resource 1',
      startTime: this.currentDate.clone().set({ h: 4, m: 0 }),
      endTime: this.currentDate.clone().set({ h: 7, m: 0 })
    });
    await settled();

    // After update state assertions
    assert.equal(this.store.peekAll('event').length, 1);
    let { startPosition: updateStartPos, endPosition: updateEndPos } = getEventPosition(find(SELECTORS.events));
    assert.equal(find(`[data-resource-id="${this.resourceId}"]`).querySelectorAll(SELECTORS.events).length, 0);
    assert.equal(find(`[data-resource-id="${this.resourceId2}"]`).querySelectorAll(SELECTORS.events).length, 1);
    assert.equal(updateStartPos, '9');
    assert.equal(updateEndPos, '15');

    this.publicApi.actions.revertEvent(this.eventId);
    await settled();

    let { startPosition: revertedStartPos, endPosition: revertedEndPos } = getEventPosition(find(SELECTORS.events));
    assert.equal(find(`[data-resource-id="${this.resourceId}"]`).querySelectorAll(SELECTORS.events).length, 1);
    assert.equal(find(`[data-resource-id="${this.resourceId2}"]`).querySelectorAll(SELECTORS.events).length, 0);
    assert.equal(revertedStartPos, '5');
    assert.equal(revertedEndPos, '7');

  });

  test('#update - should add the event to the calendar and if reverted it should be removed from calendar', async function(assert) {
    element = find(SELECTORS.events);

    // Initial state assertions
    assert.equal(this.store.peekAll('event').length, 1);
    assert.equal(find(`[data-resource-id="${this.resourceId}"]`).querySelectorAll(SELECTORS.events).length, 1);

    this.publicApi.actions.update('externalEvents', {
      id: 2,
      resourceId: this.resourceId,
      title: 'Second event for Resource 1',
      startTime: this.currentDate.clone().set({ h: 4, m: 0 }),
      endTime: this.currentDate.clone().set({ h: 7, m: 0 })
    });

    this.publicApi.actions.update('events', {
      id: 2,
      resourceId: this.resourceId,
      title: 'Second event for Resource 1',
      startTime: this.currentDate.clone().set({ h: 4, m: 0 }),
      endTime: this.currentDate.clone().set({ h: 7, m: 0 })
    });
    await settled();

    // After update state assertions
    assert.equal(this.store.peekAll('event').length, 2);
    let { startPosition, endPosition } = getEventPosition(find('[data-event-id="2"]'));
    assert.equal(find(`[data-resource-id="${this.resourceId}"]`).querySelectorAll(SELECTORS.events).length, 2);
    assert.equal(startPosition, '9');
    assert.equal(endPosition, '15');

    this.publicApi.actions.revertEvent(this.eventId);
    await settled();

    assert.equal(this.store.peekAll('event').length, 2); // It will remain 2 as this is present in sidebar
    assert.equal(find(`[data-resource-id="${this.resourceId}"]`).querySelectorAll(SELECTORS.events).length, 1);
  });

  test('#resetCalendar should delete all the events and resources inside the calendar', async function(assert) {
    this.publicApi.actions.add('events', [{
      id: 2,
      resourceId: this.resourceId2,
      title: 'First event for Resource 2',
      startTime: this.currentDate.clone().set({ h: 4, m: 0 }),
      endTime: this.currentDate.clone().set({ h: 7, m: 0 })
    }]);
    await settled();

    assert.dom(SELECTORS.resources).exists({ count: 2 });
    assert.dom(SELECTORS.events).exists({ count: 2 });
    assert.equal(this.store.peekAll('resource').length, 2);
    assert.equal(this.store.peekAll('event').length, 2);


    this.publicApi.actions.resetCalendar();
    await settled();

    assert.dom(SELECTORS.resources).doesNotExist();
    assert.dom(SELECTORS.events).doesNotExist();
    assert.equal(this.store.peekAll('resource').length, 0);
    assert.equal(this.store.peekAll('event').length, 1); // 1 event is not removed from the store as it's present in sidebar
  });

  test('#resetExternalEvents should delete all the external events from the sidebar', async function(assert) {
    this.publicApi.actions.add('externalEvents', [{
      id: 2,
      resourceId: this.resourceId2,
      title: 'First event for Resource 2',
      startTime: this.currentDate.clone().set({ h: 4, m: 0 }),
      endTime: this.currentDate.clone().set({ h: 7, m: 0 })
    }]);
    await settled();

    assert.dom(SELECTORS.externalEvents).exists({ count: 2 });

    this.publicApi.actions.resetExternalEvents();
    await settled();

    assert.dom(SELECTORS.externalEvents).doesNotExist();
    assert.equal(this.store.peekAll('event').length, 1); // Event is not removed from the store as it's present in calendar
  });
});
