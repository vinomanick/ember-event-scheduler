import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { getTimeDropdownChoices } from 'ember-event-scheduler/utils/date-util';
import { DEFAULT_CONFIG } from 'dummy/tests/constants/event-scheduler';
import sinon from 'sinon';
import { selectChoose } from 'ember-power-select/test-support/helpers';
import wait from 'ember-test-helpers/wait';

module('Integration | Component | event-scheduler/calendar/time-field-dialog', function(hooks) {
  setupRenderingTest(hooks);

  let currentDate;

  hooks.beforeEach(function() {
    let { timePicker } = DEFAULT_CONFIG();

    // Inject moment service and setting the zone
    this.moment = this.owner.lookup('service:moment');
    this.moment.setTimeZone('Europe/Amsterdam');
    this.moment.setLocale('en');
    currentDate = this.get('moment').moment().startOf('day');

    this.setProperties({
      timeFieldChoices: getTimeDropdownChoices(currentDate, timePicker),
      onSubmitSpy: sinon.spy(),
      onCloseSpy: sinon.spy()
    });
  });

  // TODO: Assert with translations
  test('renders', async function(assert) {
    await render(hbs`
    <div id="es-app-overlays" class="es-app-overlays"></div>
    {{event-scheduler/calendar/time-field-dialog timeFieldChoices=timeFieldChoices
      onSubmit=(action onSubmitSpy) onClose=(action onCloseSpy)}}`);
    assert.dom('[data-test-es="time-dialog-title"]').hasText('Set appointment start time');
  });

  test('should return the selected time on submit', async function(assert) {
    await render(hbs`
    <div id="es-app-overlays" class="es-app-overlays"></div>
    {{event-scheduler/calendar/time-field-dialog timeFieldChoices=timeFieldChoices
      onSubmit=(action onSubmitSpy) onClose=(action onCloseSpy)}}`);

    await selectChoose('[data-test-es="start-time-field"]', '.ember-power-select-option', 2);
    return wait().then(async() => {
      await click('[data-test-es="update-time"]');
      assert.equal(this.onSubmitSpy.calledWith('01:00 AM'), true);
    });
  });

  test('should trigger the cancel action on clicking the cancel', async function(assert) {
    await render(hbs`
    <div id="es-app-overlays" class="es-app-overlays"></div>
    {{event-scheduler/calendar/time-field-dialog timeFieldChoices=timeFieldChoices
      onSubmit=(action onSubmitSpy) onClose=(action onCloseSpy)}}`);

    await selectChoose('[data-test-es="start-time-field"]', '.ember-power-select-option', 2);
    return wait().then(async() => {
      await click('[data-test-es="cancel-update-time"]');
      assert.equal(this.onCloseSpy.calledOnce, true);
    });
  });
});
