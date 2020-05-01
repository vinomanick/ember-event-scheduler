import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { clickTrigger } from 'ember-basic-dropdown/test-support/helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';
import { DEFAULT_CONFIG } from 'dummy/tests/constants/event-scheduler';

module('Integration | Component | event-scheduler/toolbar/wrappers/center-panel', function(hooks) {
  setupRenderingTest(hooks);

  let currentDate;

  hooks.beforeEach(function() {
    // Inject moment service and setting the zone
    this.moment = this.owner.lookup('service:moment');
    this.get('moment').setTimeZone('Europe/Amsterdam');
    currentDate = this.get('moment').moment().startOf('day');

    let { toolbar: { dateFormat },  views: { day: { type: viewType, slot: slotConfig }} } = DEFAULT_CONFIG();

    this.setProperties({
      selectedDate: currentDate,
      viewType,
      slotConfig,
      dateFormat,
      onDateChangeSpy: sinon.spy()
    });
  });

  test('should trigger the date change action with selected date on selecting a date from the date picker and current date on clicking today', async function(assert) {
    let newDate = currentDate.clone().add(1, 'day');
    await render(hbs`{{event-scheduler/toolbar/wrappers/center-panel
      selectedDate=selectedDate dateFormat=dateFormat
      viewType=viewType slotConfig=slotConfig
      onDateChange=(action onDateChangeSpy)
    }}`);
    assert.dom('[data-test-es="current-period"]').hasText(currentDate.format(this.dateFormat));

    await clickTrigger('[data-test-es=date-picker]');
    await click(`[data-date="${newDate.format('YYYY-MM-DD')}"]`);
    assert.equal(this.onDateChangeSpy.args[0][0].format(this.dateFormat), newDate.format(this.dateFormat));

    await clickTrigger('[data-test-es=date-picker]');
    await click('.ember-power-calendar-day--today');
    assert.dom('[data-test-es="current-period"]').hasText(currentDate.format(this.dateFormat));
  });
});
