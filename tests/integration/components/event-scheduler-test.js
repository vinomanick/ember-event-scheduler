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

  test('should render the event scheduler as expected', async function(assert) {
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

  test('should render the calendar with defaults if not provided by default', async function(assert) {
    this.setProperties({ selectedDate: null, selectedView: null, selectedDuration: null });
    this.intl.setLocale([]);
    this.moment.setLocale();

    assert.equal(this.intl.get('locale').length, 0);
    assert.notOk(this.moment.locale);

    await renderScheduler();

    assert.equal(this.intl.get('locale').length, 1);
    assert.equal(this.intl.get('locale')[0], 'en-us');
    assert.equal(this.moment.locale, 'en');

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
