import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { render } from '@ember/test-helpers';
import sinon from 'sinon';
import { DEFAULT_CONFIG } from 'dummy/tests/constants/event-scheduler';
import { getSlots } from 'ember-event-scheduler/utils/event-scheduler';
import { setupMoment } from 'dummy/tests/test-support';
import { set } from '@ember/object';

const renderComponent = async () => {
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
};


module('Integration | Component | event-scheduler/calendar', function(hooks) {
  setupRenderingTest(hooks);
  setupMoment(hooks);

  let config;

  hooks.beforeEach(function() {

    config = DEFAULT_CONFIG();

    let viewConfig = config.views.day;
    let { type: viewType, slot: slotConfig } = viewConfig;
    let slots = getSlots(this.currentDate, slotConfig);

    this.setProperties({
      events: {},
      resources: {},
      isLoading: false,
      config,
      viewConfig,
      slotConfig,
      slots,
      viewType,
      selectedDate: this.currentDate,
      selectedView: config.defaultView,
      selectedDuration: config.toolbar.duration.default,
      onEventUpdateSpy: sinon.spy()
    });
  });

  test('renders', async function(assert) {
    let { events, resources } = this;
    set(events, '1', {
      id: '1',
      resourceId: '101',
      title: 'First event for Resource 1',
      startTime: this.currentDate.clone().set({ h: 2, m: 0 }),
      endTime: this.currentDate.clone().set({ h: 3, m: 0 })
    });
    set(resources, '101', { id: 101, name: 'Resource 1' });
    await renderComponent();
    assert.dom('[data-test-es="es-calendar"]').exists();
    assert.dom('[data-test-es="es-calendar-header"]').exists();
    assert.dom('[data-test-es="empty-row"]').doesNotExist();
    assert.dom('[data-test-es="resource-loader"]').doesNotExist();
    assert.dom('[data-test-es="resource"]').exists();
    assert.dom('[data-test-es=resource]').exists({ count: 1 });
    assert.dom('[data-test-es=event-wrapper]').exists({ count: 1 });
  });

  test('should display empty message when the agents are empty', async function(assert) {
    await renderComponent();
    assert.dom('[data-test-es="es-calendar"]').exists();
    assert.dom('[data-test-es="es-calendar-header"]').exists();
    assert.dom('[data-test-es="resource"]').doesNotExist();
    assert.dom('[data-test-es="resource-loader"]').doesNotExist();
    assert.dom('[data-test-es="empty-row"]').hasText('No resources to display');
  });

  test('should display the shim loader when the events are loading', async function(assert) {
    this.set('isLoading', true);
    await renderComponent();
    assert.dom('[data-test-es="es-calendar"]').exists();
    assert.dom('[data-test-es="es-calendar-header"]').exists();
    assert.dom('[data-test-es="resource"]').doesNotExist();
    assert.dom('[data-test-es="empty-row"]').doesNotExist();
    assert.dom('[data-test-es="resource-loader"]').exists();
  });
});
