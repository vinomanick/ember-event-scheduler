import { find, render, click } from '@ember/test-helpers';
import { module, test, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';
import { DEFAULT_CONFIG } from 'dummy/tests/constants/event-scheduler';
import EmberObject from '@ember/object';

module('Integration | Component | event-scheduler/external-events', function(hooks) {
  setupRenderingTest(hooks);

  let currentDate;

  hooks.beforeEach(function() {
  // Inject moment service and setting the zone
  this.moment = this.owner.lookup('service:moment');
  this.get('moment').setTimeZone('Europe/Amsterdam');
  currentDate = this.get('moment').moment().startOf('day');

    let { externalEvents: config } = DEFAULT_CONFIG();

    this.setProperties({
      config,
      events: EmberObject.create(),
      isLoading: false,
      isLoadedAll: false
    });
  });

  test('renders', async function(assert) {
    this.events.set('1', {
      id: '1',
      resourceId: '101',
      title: 'First event for Resource 1',
      startTime: currentDate.clone().set({ h: 2, m: 0 }),
      endTime: currentDate.clone().set({ h: 3, m: 0 })
    });
    await render(hbs`
    {{#event-scheduler/external-events config=config events=events isLoading=isLoading isLoadedAll=isLoadedAll as |externalEvents|}}
      {{externalEvents.header name="Events"}}
      {{externalEvents.empty}}
    {{/event-scheduler/external-events}}
    `);
    assert.dom('[data-test-es="es-external-events"]').exists();
    assert.dom('[data-test-es="external-events-header"]').exists();
    assert.dom('[data-test-es="external-event-wrapper"]').exists({ count: 1 });
  });

  test('should display the empty message if no events are there and isLoading is false', async function(assert) {
    await render(hbs`
    {{#event-scheduler/external-events config=config events=events isLoading=isLoading isLoadedAll=isLoadedAll as |externalEvents|}}
      {{externalEvents.header name="Events"}}
      {{externalEvents.empty}}
    {{/event-scheduler/external-events}}
    `);
    assert.dom('[data-test-es="es-external-events"]').exists();
    assert.dom('[data-test-es="external-events-header"]').exists();
    assert.dom('[data-test-es="external-events-empty"]').exists();
    assert.dom('[data-test-es="external-event-loader"]').doesNotExist();
  });

  test('should display the shim loader when the events are loading', async function(assert) {
    this.set('isLoading', true);
    await render(hbs`
    {{#event-scheduler/external-events config=config events=events isLoading=isLoading isLoadedAll=isLoadedAll as |externalEvents|}}
      {{externalEvents.header name="Events"}}
      {{externalEvents.empty}}
    {{/event-scheduler/external-events}}
    `);
    assert.dom('[data-test-es="es-external-events"]').exists();
    assert.dom('[data-test-es="external-events-header"]').exists();
    assert.dom('[data-test-es="external-events-empty"]').doesNotExist();
    assert.dom('[data-test-es="external-event-loader"]').exists();
  });

  // TODO: Should try to implement this in wormhole
  skip('should display the toggle btn inside the wormhole if showToggle is true', async function(assert) {
    // let schedulerConfig = copy(config, true);
    // schedulerConfig.showToggle = true;
    // this.set('config', schedulerConfig);
    let toggleSpy = sinon.spy();
    this.set('toggleSpy', toggleSpy);
    await render(hbs`
    <div id="externalEventsToggle"></div>
    {{#event-scheduler/external-events
      config=config
      isEmpty=isEmpty
      nextPage=nextPage
      onExternalEventToggle=(action toggleSpy)
      as |wrapper|}}
      {{wrapper.header name=name}}
    {{/event-scheduler/external-events}}
    `);
    assert.ok(find('#externalEventsToggle').querySelector('[data-test-id="external-events-toggle-btn"]'));
    await click('[data-test-id="external-events-toggle-btn"]');
    assert.equal(toggleSpy.calledOnce, true);
  });
});
