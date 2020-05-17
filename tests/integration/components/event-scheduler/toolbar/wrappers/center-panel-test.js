import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { clickTrigger } from 'ember-basic-dropdown/test-support/helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';
import { DEFAULT_CONFIG } from 'dummy/tests/constants/event-scheduler';
import { setupMoment } from 'dummy/tests/test-support';

const renderComponent = async () => {
  await render(hbs`{{event-scheduler/toolbar/wrappers/center-panel
    selectedDate=selectedDate dateFormat=dateFormat
    viewType=viewType slotConfig=slotConfig
    onDateChange=(action onDateChangeSpy)
  }}`);
};

module('Integration | Component | event-scheduler/toolbar/wrappers/center-panel', function(hooks) {
  setupRenderingTest(hooks);
  setupMoment(hooks);

  hooks.beforeEach(function() {
    let { toolbar: { dateFormat },  views: { day: { type: viewType, slot: slotConfig }} } = DEFAULT_CONFIG();

    this.setProperties({
      selectedDate: this.currentDate,
      viewType,
      slotConfig,
      dateFormat,
      onDateChangeSpy: sinon.spy()
    });
  });

  test('should trigger the date change action with selected date on selecting a date from the date picker and current date on clicking today', async function(assert) {
    let newDate = this.currentDate.clone().add(1, 'day');
    await renderComponent();
    assert.dom('[data-test-es="current-period"]').hasText(this.currentDate.format(this.dateFormat));

    await clickTrigger('[data-test-es=date-picker]');
    await click(`[data-date="${newDate.format('YYYY-MM-DD')}"]`);
    assert.equal(this.onDateChangeSpy.args[0][0].format(this.dateFormat), newDate.format(this.dateFormat));

    await clickTrigger('[data-test-es=date-picker]');
    await click('.ember-power-calendar-day--today');
    assert.dom('[data-test-es="current-period"]').hasText(this.currentDate.format(this.dateFormat));
  });
});
