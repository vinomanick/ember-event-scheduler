import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { DEFAULT_CONFIG } from 'dummy/tests/constants/event-scheduler';
import sinon from 'sinon';

// TODO: Add tests for external event toggle or move it to wormhole like in freshdesk
module('Integration | Component | event-scheduler/toolbar/wrappers/left-panel', function(hooks) {
  setupRenderingTest(hooks);

  let currentDate;

  hooks.beforeEach(function() {
    // Inject moment service and setting the zone
    this.moment = this.owner.lookup('service:moment');
    this.get('moment').setTimeZone('Europe/Amsterdam');
    currentDate = this.get('moment').moment().startOf('day');

    let { toolbar: { showExternalEventsToggle, dateFormat }, views: { day: { type: viewType } } } = DEFAULT_CONFIG();

    this.setProperties({
      selectedDate: currentDate,
      viewType,
      showExternalEventsToggle,
      dateFormat,
      isExternalEventsExpanded: true,
      onDateChangeSpy: sinon.spy(),
      onExternalEventToggleSpy: sinon.spy()
    });
  });

  test('today button should be in disabled state if the selected date is current date', async function(assert) {
    await render(hbs`{{event-scheduler/toolbar/wrappers/left-panel
      selectedDate=selectedDate viewType=viewType showExternalEventsToggle=showExternalEventsToggle
      onDateChange=(action onDateChangeSpy)
      onExternalEventToggle=(action onExternalEventToggleSpy)}}`);
    assert.dom('[data-test-es=today-btn]').isDisabled();
  });

  test('next button should be in disabled state if the selected date is the max date', async function(assert) {
    await render(hbs`{{event-scheduler/toolbar/wrappers/left-panel maxDate=selectedDate
      selectedDate=selectedDate viewType=viewType showExternalEventsToggle=showExternalEventsToggle
      onDateChange=(action onDateChangeSpy)
      onExternalEventToggle=(action onExternalEventToggleSpy)}}`);
    assert.dom('[data-test-es=next-btn]').isDisabled();
  });

  test('previous button should be in disabled state if the selected date is the min date', async function(assert) {
    await render(hbs`{{event-scheduler/toolbar/wrappers/left-panel minDate=selectedDate
      selectedDate=selectedDate viewType=viewType showExternalEventsToggle=showExternalEventsToggle
      onDateChange=(action onDateChangeSpy)
      onExternalEventToggle=(action onExternalEventToggleSpy)}}`);
    assert.dom('[data-test-es=previous-btn]').isDisabled();
  });

  test('should trigger the date change action with next date on clicking the next icon', async function(assert) {
    let nextDate = currentDate.clone().add(1, 'day');
    await render(hbs`{{event-scheduler/toolbar/wrappers/left-panel
      selectedDate=selectedDate viewType=viewType showExternalEventsToggle=showExternalEventsToggle
      onDateChange=(action onDateChangeSpy)
      onExternalEventToggle=(action onExternalEventToggleSpy)}}`);
    await click('[data-test-es=next-btn]');
    assert.equal(this.onDateChangeSpy.args[0][0].format(this.dateFormat), nextDate.format(this.dateFormat));
  });

  test('should trigger the date change action with previous date on clicking the previous icon', async function(assert) {
    let previousDate = currentDate.clone().subtract(1, 'day');
    await render(hbs`{{event-scheduler/toolbar/wrappers/left-panel
      selectedDate=selectedDate viewType=viewType showExternalEventsToggle=showExternalEventsToggle
      onDateChange=(action onDateChangeSpy)
      onExternalEventToggle=(action onExternalEventToggleSpy)}}`);
    await click('[data-test-es=previous-btn]');
    assert.equal(this.onDateChangeSpy.args[0][0].format(this.dateFormat), previousDate.format(this.dateFormat));
  });
});
