import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { DEFAULT_CONFIG } from 'dummy/tests/constants/event-scheduler';
import sinon from 'sinon';
import { setupMoment } from 'dummy/tests/test-support';

const renderComponent = async () => {
  await render(hbs`{{event-scheduler/toolbar/wrappers/left-panel
    selectedDate=selectedDate viewType=viewType showExternalEventsToggle=showExternalEventsToggle
    maxDate=maxDate minDate=minDate
    onDateChange=(action onDateChangeSpy)
    onExternalEventToggle=(action onExternalEventToggleSpy)}}`);
};

module('Integration | Component | event-scheduler/toolbar/wrappers/left-panel', function(hooks) {
  setupRenderingTest(hooks);
  setupMoment(hooks);


  hooks.beforeEach(function() {
    let { toolbar: { showExternalEventsToggle, dateFormat }, views: { day: { type: viewType } } } = DEFAULT_CONFIG();

    this.setProperties({
      selectedDate: this.currentDate,
      viewType,
      showExternalEventsToggle,
      dateFormat,
      isExternalEventsExpanded: true,
      maxDate: null,
      minDate: null,
      onDateChangeSpy: sinon.spy(),
      onExternalEventToggleSpy: sinon.spy()
    });
  });

  test('should display the toggle btn if showExternalEventsToggle is true', async function(assert) {
    await renderComponent();
    assert.dom('[data-test-es="external-events-toggle-btn"]').exists();
    await click('[data-test-es="external-events-toggle-btn"]');
    assert.equal(this.onExternalEventToggleSpy.calledOnce, true);
  });

  test('should not display the toggle btn if showExternalEventsToggle is false', async function(assert) {
    this.set('showExternalEventsToggle', false);
    await renderComponent();
    assert.dom('[data-test-es="external-events-toggle-btn"]').doesNotExist();
  });

  test('today button should be in disabled state if the selected date is current date', async function(assert) {
    await renderComponent();
    assert.dom('[data-test-es=today-btn]').isDisabled();
  });

  test('next button should be in disabled state if the selected date is the max date', async function(assert) {
    this.set('maxDate', this.selectedDate);
    await renderComponent();
    assert.dom('[data-test-es=next-btn]').isDisabled();
  });

  test('previous button should be in disabled state if the selected date is the min date', async function(assert) {
    this.set('minDate', this.selectedDate);
    await renderComponent();
    assert.dom('[data-test-es=previous-btn]').isDisabled();
  });

  test('should trigger the date change action with next date on clicking the next icon', async function(assert) {
    let nextDate = this.currentDate.clone().add(1, 'day');
    await renderComponent();
    await click('[data-test-es=next-btn]');
    assert.equal(this.onDateChangeSpy.args[0][0].format(this.dateFormat), nextDate.format(this.dateFormat));
  });

  test('should trigger the date change action with today on clicking the today button', async function(assert) {
    this.set('selectedDate', this.currentDate.clone().add(1, 'day'));
    await renderComponent();
    await click('[data-test-es=today-btn]');
    assert.equal(this.onDateChangeSpy.args[0][0].format(this.dateFormat), this.currentDate.format(this.dateFormat));
  });

  test('should trigger the date change action with previous date on clicking the previous icon', async function(assert) {
    let previousDate = this.currentDate.clone().subtract(1, 'day');
    await renderComponent();
    await click('[data-test-es=previous-btn]');
    assert.equal(this.onDateChangeSpy.args[0][0].format(this.dateFormat), previousDate.format(this.dateFormat));
  });
});
