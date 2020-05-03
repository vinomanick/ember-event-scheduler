import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { render } from '@ember/test-helpers';
import sinon from 'sinon';
import { DEFAULT_CONFIG } from 'dummy/tests/constants/event-scheduler';
import { getSlots } from 'ember-event-scheduler/utils/event-scheduler';
import EmberObject from '@ember/object';

module('Integration | Component | event-scheduler/calendar', function(hooks) {
  setupRenderingTest(hooks);

  let config, currentDate;

  hooks.beforeEach(function() {
    // Inject moment service and setting the zone
    this.moment = this.owner.lookup('service:moment');
    this.moment.setTimeZone('Europe/Amsterdam');
    this.moment.setLocale('en');
    currentDate = this.get('moment').moment().startOf('day');

    config = DEFAULT_CONFIG();

    let viewConfig = config.views.day;
    let { type: viewType, slot: slotConfig } = viewConfig;
    let slots = getSlots(currentDate, slotConfig);

    this.setProperties({
      events: EmberObject.create(),
      resources: EmberObject.create(),
      isLoading: false,
      config,
      viewConfig,
      slotConfig,
      slots,
      viewType,
      selectedDate: currentDate,
      selectedView: config.defaultView,
      selectedDuration: config.toolbar.duration.default,
      onEventUpdateSpy: sinon.spy()
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
    this.resources.set('101', { id: 101, name: 'Resource 1' });
    await render(hbs`
    {{#event-scheduler/calendar config=config slots=slots isLoading=isLoading
      viewConfig=viewConfig slotConfig=slotConfig viewType=viewType
      selectedDate=selectedDate selectedDuration=selectedDuration selectedView=selectedView
      events=events resources=resources
      onEventUpdate=(action onEventUpdateSpy)
      as |calendar|}}
      {{calendar.resourceHeader name="Resources"}}
      {{calendar.gridHeader}}
      {{calendar.empty}}
    {{/event-scheduler/calendar}}`);
    assert.dom('[data-test-es="es-calendar"]').exists();
    assert.dom('[data-test-es="es-calendar-header"]').exists();
    assert.dom('[data-test-es="empty-row"]').doesNotExist();
    assert.dom('[data-test-es="resource-loader"]').doesNotExist();
    assert.dom('[data-test-es="resource"]').exists();
    assert.dom('[data-test-es=resource]').exists({ count: 1 });
    assert.dom('[data-test-es=event-wrapper]').exists({ count: 1 });
  });

  test('should display empty message when the agents are empty', async function(assert) {
    await render(hbs`
    {{#event-scheduler/calendar config=config slots=slots isLoading=isLoading
      viewConfig=viewConfig slotConfig=slotConfig viewType=viewType
      selectedDate=selectedDate selectedDuration=selectedDuration selectedView=selectedView
      events=events resources=resources
      onEventUpdate=(action onEventUpdateSpy)
      as |calendar|}}
      {{calendar.resourceHeader name="Resources"}}
      {{calendar.gridHeader}}
      {{calendar.empty}}
    {{/event-scheduler/calendar}}`);
    assert.dom('[data-test-es="es-calendar"]').exists();
    assert.dom('[data-test-es="es-calendar-header"]').exists();
    assert.dom('[data-test-es="resource"]').doesNotExist();
    assert.dom('[data-test-es="resource-loader"]').doesNotExist();
    assert.dom('[data-test-es="empty-row"]').hasText('No resources to display');
  });

  test('should display the shim loader when the events are loading', async function(assert) {
    this.set('isLoading', true);
    await render(hbs`
    {{#event-scheduler/calendar config=config slots=slots isLoading=isLoading
      viewConfig=viewConfig slotConfig=slotConfig viewType=viewType
      selectedDate=selectedDate selectedDuration=selectedDuration selectedView=selectedView
      events=events resources=resources
      onEventUpdate=(action onEventUpdateSpy)
      as |calendar|}}
      {{calendar.resourceHeader name="Resources"}}
      {{calendar.gridHeader}}
      {{calendar.empty}}
    {{/event-scheduler/calendar}}`);
    assert.dom('[data-test-es="es-calendar"]').exists();
    assert.dom('[data-test-es="es-calendar-header"]').exists();
    assert.dom('[data-test-es="resource"]').doesNotExist();
    assert.dom('[data-test-es="empty-row"]').doesNotExist;
    assert.dom('[data-test-es="resource-loader"]').exists();
  });
});
