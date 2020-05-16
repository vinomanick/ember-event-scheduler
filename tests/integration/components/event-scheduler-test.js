import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find } from '@ember/test-helpers';
import { setupScheduler, renderScheduler } from 'dummy/tests/test-support';

const SELECTORS = {
  externalEvents: '[data-test-es=external-event-wrapper]',
  events: '[data-test-es=event-wrapper]',
  resources: '[data-test-es=resource]'
};

module('Integration | Component | event-scheduler', function(hooks) {
  setupRenderingTest(hooks);
  setupScheduler(hooks);

  test('it render', async function(assert) {
    await renderScheduler();
    assert.dom('[data-test-es="event-scheduler"]').exists();
    assert.dom('[data-test-es="es-external-events"]').exists();
    assert.dom('[data-test-es="es-calendar"]').exists();

    assert.ok(this.publicApi);

    // Store Assertions
    assert.equal(this.store.peekAll('event').length, 1);
    assert.equal(this.store.peekAll('resource').length, 2);

    // Dom Assertions
    assert.dom(SELECTORS.resources).exists({ count: 2 });
    assert.dom(SELECTORS.externalEvents).exists({ count: 1 });
    assert.equal(find(`[data-resource-id="${this.resourceId}"]`).querySelectorAll(SELECTORS.events).length, 1);
  });
});
