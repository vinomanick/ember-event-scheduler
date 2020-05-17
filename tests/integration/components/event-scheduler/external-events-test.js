import { render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { DEFAULT_CONFIG } from 'dummy/tests/constants/event-scheduler';
import { setupMoment } from 'dummy/tests/test-support';
import { set } from '@ember/object';

const renderComponent = async () => {
  await render(hbs`
  {{#event-scheduler/external-events config=config events=events isLoading=isLoading isLoadedAll=isLoadedAll as |externalEvents|}}
    {{externalEvents.header name="Events"}}
    {{externalEvents.empty}}
  {{/event-scheduler/external-events}}
  `);
};

module('Integration | Component | event-scheduler/external-events', function(hooks) {
  setupRenderingTest(hooks);
  setupMoment(hooks);

  hooks.beforeEach(function() {
    let { externalEvents: config } = DEFAULT_CONFIG();

    this.setProperties({
      config,
      events: {},
      isLoading: false,
      isLoadedAll: false
    });
  });

  test('renders', async function(assert) {
    let _events = this.events;
    set(_events, '1', {
      id: '1',
      resourceId: '101',
      title: 'First event for Resource 1',
      startTime: this.currentDate.clone().set({ h: 2, m: 0 }),
      endTime: this.currentDate.clone().set({ h: 3, m: 0 })
    });
    await renderComponent();
    assert.dom('[data-test-es="es-external-events"]').exists();
    assert.dom('[data-test-es="external-events-header"]').exists();
    assert.dom('[data-test-es="external-event-wrapper"]').exists({ count: 1 });
  });

  test('should display the empty message if no events are there and isLoading is false', async function(assert) {
    await renderComponent();
    assert.dom('[data-test-es="es-external-events"]').exists();
    assert.dom('[data-test-es="external-events-header"]').exists();
    assert.dom('[data-test-es="external-events-empty"]').exists();
    assert.dom('[data-test-es="external-event-loader"]').doesNotExist();
  });

  test('should display the shim loader when the events are loading', async function(assert) {
    this.set('isLoading', true);
    await renderComponent();
    assert.dom('[data-test-es="es-external-events"]').exists();
    assert.dom('[data-test-es="external-events-header"]').exists();
    assert.dom('[data-test-es="external-events-empty"]').doesNotExist();
    assert.dom('[data-test-es="external-event-loader"]').exists();
  });
});
