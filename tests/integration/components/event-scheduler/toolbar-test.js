import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';
import { DEFAULT_CONFIG } from 'dummy/tests/constants/event-scheduler';
import { selectChoose } from 'ember-power-select/test-support/helpers';
import { clickTrigger } from 'ember-basic-dropdown/test-support/helpers';

module('Integration | Component | event-scheduler/toolbar', function(hooks) {
  setupRenderingTest(hooks);

  let currentDate;

  hooks.beforeEach(function() {
    // Inject moment service and setting the zone
    this.moment = this.owner.lookup('service:moment');
    this.moment.setTimeZone('Europe/Amsterdam');
    this.moment.setLocale('en');
    currentDate = this.get('moment').moment().startOf('day');

    let config = DEFAULT_CONFIG();

    let viewConfig = config.views.day;
    let { type: viewType, slot: slotConfig } = viewConfig;

    this.setProperties({
      config,
      viewConfig,
      slotConfig,
      viewType,
      selectedDate: currentDate,
      selectedView: config.defaultView,
      selectedDuration: config.toolbar.duration.default,
      isExternalEventsExpanded: true,
      onDateChangeSpy: sinon.spy(),
      onDurationChangeSpy: sinon.spy(),
      onViewChangeSpy: sinon.spy(),
      onExternalEventToggleSpy: sinon.spy()
    });
  });

  test('it renders', async function(assert) {

    await render(hbs`
    {{#event-scheduler/toolbar
      config=config viewConfig=viewConfig slotConfig=slotConfig
      viewType=viewType isExternalEventsExpanded=isExternalEventsExpanded
      selectedView=selectedView selectedDuration=selectedDuration selectedDate=selectedDate
      onDateChange=(action onDateChangeSpy)
      onViewChange=(action onViewChangeSpy)
      onDurationChange=(action onDurationChangeSpy)
      onExternalEventToggle=(action onExternalEventToggleSpy) as |toolbar|
    }}
      {{toolbar.left}}
      {{toolbar.center}}
      {{toolbar.right}}
    {{/event-scheduler/toolbar}}`);

    assert.dom('[data-test-es="external-events-toggle-btn"').exists();

    assert.dom('[data-test-es="today-btn"').exists();

    assert.dom('[data-test-es="next-btn"').exists();
    await click('[data-test-es=next-btn]');
    assert.equal(this.onDateChangeSpy.calledOnce, true);

    assert.dom('[data-test-es="previous-btn"').exists();
    await click('[data-test-es=previous-btn]');
    assert.equal(this.onDateChangeSpy.calledTwice, true);

    let newDate = currentDate.clone().add(1, 'day');
    await clickTrigger('[data-test-es=date-picker]');
    await click(`[data-date="${newDate.format('YYYY-MM-DD')}"]`);
    assert.equal(this.onDateChangeSpy.callCount, 3);

    assert.dom('[data-test-es="event-duration"] .ember-power-select-selected-item').hasText('60 minutes');
    await selectChoose('[data-test-es="event-duration"]', '.ember-power-select-option', 2);
    assert.deepEqual(this.onDurationChangeSpy.calledOnce, true);

    assert.dom('[data-test-es="view-type"] .ember-power-select-selected-item').hasText('Day');
    await selectChoose('[data-test-es="view-type"]', '.ember-power-select-option', 1);
    assert.equal(this.onViewChangeSpy.calledOnce, true);

  });
});
