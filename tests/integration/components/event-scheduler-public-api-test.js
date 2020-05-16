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

  test('#update should update the calendar event if type is events', async function(assert) {
    element = find(SELECTORS.events);
    assert.ok(this.publicApi);

    // Initial state assertions
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
    let { startPosition: updateStartPos, endPosition: updateEndPos } = getEventPosition(find(SELECTORS.events));
    assert.equal(find(`[data-resource-id="${this.resourceId}"]`).querySelectorAll(SELECTORS.events).length, 0);
    assert.equal(find(`[data-resource-id="${this.resourceId2}"]`).querySelectorAll(SELECTORS.events).length, 1);
    assert.equal(updateStartPos, '9');
    assert.equal(updateEndPos, '15');
  });

  test('#update should add the event to the calendar if type is events and the event is not present already', async function(assert) {
    element = find(SELECTORS.events);
    assert.ok(this.publicApi);

    // Initial state assertions
    assert.equal(find(`[data-resource-id="${this.resourceId}"]`).querySelectorAll(SELECTORS.events).length, 1);

    this.publicApi.actions.update('events', {
      id: 2,
      resourceId: this.resourceId,
      title: 'Second event for Resource 1',
      startTime: this.currentDate.clone().set({ h: 4, m: 0 }),
      endTime: this.currentDate.clone().set({ h: 7, m: 0 })
    });

    await settled();

    // After update state assertions
    let { startPosition, endPosition } = getEventPosition(find('[data-event-id="2"]'));
    assert.equal(find(`[data-resource-id="${this.resourceId}"]`).querySelectorAll(SELECTORS.events).length, 2);
    assert.equal(startPosition, '9');
    assert.equal(endPosition, '15');
  });

  test('#update should update the sidebar event if the type is externalEvents', async function(assert) {
    element = find(SELECTORS.externalEvents);
    assert.ok(this.publicApi);

    // Initial state assertions
    let appointmentTimeOld = element.querySelector('[data-test-es="service-time"]');
    assert.dom(appointmentTimeOld).doesNotIncludeText('--');

    this.publicApi.actions.update('externalEvents', {
      id: this.eventId,
      resourceId: this.resourceId2,
      title: 'First event for Resource 1',
      startTime: null,
      endTime: null
    });

    await settled();

    // After update state assertions
    let appointmentTimeNew = element.querySelector('[data-test-es="service-time"]');
    assert.dom(SELECTORS.externalEvents).exists({ count: 1 });
    assert.dom(appointmentTimeNew).hasText('--');
  });

  test('#update should silently ignore the external event update if its not present already', async function(assert) {

    this.publicApi.actions.update('externalEvents', {
      id: 10,
      resourceId: this.resourceId2,
      title: 'Tenth event for Resource 1',
      startTime: null,
      endTime: null
    });

    await settled();

    // After update state assertions
    assert.dom(SELECTORS.externalEvents).exists({ count: 1 });
  });

  test('#resetCalendar should delete all the events and resources inside the calendar', async function(assert) {
    assert.ok(this.publicApi);
    assert.dom(SELECTORS.resources).exists({ count: 2 });
    assert.dom(SELECTORS.events).exists({ count: 1 });

    this.publicApi.actions.resetCalendar();
    await settled();

    assert.dom(SELECTORS.resources).doesNotExist();
    assert.dom(SELECTORS.events).doesNotExist();
  });

  test('#resetExternalEvents should delete all the external events from the sidebar', async function(assert) {
    assert.ok(this.publicApi);
    assert.dom(SELECTORS.externalEvents).exists({ count: 1 });

    this.publicApi.actions.resetExternalEvents();
    await settled();

    assert.dom(SELECTORS.externalEvents).doesNotExist();
  });
});
