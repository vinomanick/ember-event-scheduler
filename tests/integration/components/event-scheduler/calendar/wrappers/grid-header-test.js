import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { getSlots } from 'ember-event-scheduler/utils/event-scheduler';
import { getMonthSlotConfig } from 'dummy/tests/helpers/utils/scheduler-util';
import { find, render, click } from '@ember/test-helpers';
import sinon from 'sinon';
import { DEFAULT_CONFIG } from 'dummy/tests/constants/event-scheduler';

const headerElement = '[data-test-es="grid-header"]';

module('Integration | Component | event-scheduler/calendar/wrappers/grid-header', function(hooks) {
  setupRenderingTest(hooks);

  let currentDate, dateViewChangeSpy;

  hooks.beforeEach(function() {
    // Inject moment service and setting the zone
    this.moment = this.owner.lookup('service:moment');
    this.get('moment').setTimeZone('Europe/Amsterdam');
    currentDate = this.get('moment').moment().startOf('day');

    this.set('selectedDate', currentDate);
    dateViewChangeSpy = sinon.spy();
    this.set('dateViewChangeSpy', dateViewChangeSpy);
  });

  module('Day view', function(hooks) {

    hooks.beforeEach(function() {
      let { type: viewType, slot: slotConfig } = DEFAULT_CONFIG().views.day;
      let slots = getSlots(currentDate, slotConfig);

      this.setProperties({ viewType, slots, slotFormat: slotConfig.format });
    });

    test('should render day view as expected', async function(assert) {
      await render(hbs`{{event-scheduler/calendar/wrappers/grid-header
        slots=slots
        slotFormat=slotFormat
        viewType=viewType
        selectedDate=selectedDate
        onDateViewChange=(action dateViewChangeSpy)
      }}`);
      assert.dom(headerElement).exists();
      // In day view, for 0th and 24th hour alone we are displaying it as two separate slots
      assert.dom('.calendar__row__slot').exists({ count: (this.slots.length / 2) + 1 });
    });

    test('yield block content', async function(assert) {
      await render(hbs`
        {{#event-scheduler/calendar/wrappers/grid-header}}
          {{#each slots as |slot columnIndex|}}
            {{#if (eq (modulus columnIndex 2) 0)}}
              <div class="calendar__row__slot" style={{grid-position 1 0 1 columnIndex 0 2}}>
                {{moment-format slot 'HH:mm'}}
              </div>
            {{/if}}
          {{/each}}
        {{/event-scheduler/calendar/wrappers/grid-header}}
      `);
      assert.dom(headerElement).exists();
      assert.equal(find('.calendar__row__slot:first-child').innerText.trim(), '00:00');
    });
  });

  module('Week view', function(hooks) {

    hooks.beforeEach(function() {
      let { type: viewType, slot: slotConfig } = DEFAULT_CONFIG().views.week;
      let slots = getSlots(currentDate, slotConfig);

      this.setProperties({ viewType, slots, slotFormat: slotConfig.format });
    });

    test('should render week view as expected', async function(assert) {
      await render(hbs`{{event-scheduler/calendar/wrappers/grid-header
        slots=slots
        slotFormat=slotFormat
        viewType=viewType
        selectedDate=selectedDate
        onDateViewChange=(action dateViewChangeSpy)
      }}`);
      assert.dom(headerElement).exists();
      assert.dom('.calendar__row__slot').exists({ count: this.get('slots').length });
    });

    test('should trigger the day view change action on clicking the date button', async function(assert) {
      await render(hbs`{{event-scheduler/calendar/wrappers/grid-header
        slots=slots
        slotFormat=slotFormat
        viewType=viewType
        selectedDate=selectedDate
        onDateViewChange=(action dateViewChangeSpy)
      }}`);
      let startOfWeek = currentDate.clone().startOf('week');
      await click(`[data-test-es="${startOfWeek.format('DD-MM-YYYY')}"]`);
      assert.equal(dateViewChangeSpy.args[0][0].toISOString(), startOfWeek.toISOString());
      assert.equal(dateViewChangeSpy.args[0][1], 'day');
    });
  });

  module('Month view', function(hooks) {

    hooks.beforeEach(function() {
      let { type: viewType, slot } = DEFAULT_CONFIG().views.month;
      let slotConfig = getMonthSlotConfig(slot, currentDate);
      let slots = getSlots(currentDate, slotConfig);

      this.setProperties({ viewType, slots, slotFormat: slotConfig.format });
    });

    test('should render month view as expected', async function(assert) {
      await render(hbs`{{event-scheduler/calendar/wrappers/grid-header
        slots=slots
        slotFormat=slotFormat
        viewType=viewType
        selectedDate=selectedDate
        onDateViewChange=(action dateViewChangeSpy)
      }}`);
      assert.dom(headerElement).exists();
      assert.dom('.calendar__row__slot').exists({ count: this.get('slots').length });
    });

    test('should trigger the day view change action on clicking the date button', async function(assert) {
      await render(hbs`{{event-scheduler/calendar/wrappers/grid-header
        slots=slots
        slotFormat=slotFormat
        viewType=viewType
        selectedDate=selectedDate
        onDateViewChange=(action dateViewChangeSpy)
      }}`);
      let startOfMonth = currentDate.clone().startOf('month');
      await click(`[data-test-es="${startOfMonth.format('DD-MM-YYYY')}"]`);
      assert.equal(dateViewChangeSpy.args[0][0].toISOString(), startOfMonth.toISOString());
      assert.equal(dateViewChangeSpy.args[0][1], 'day');
    });
  });
});
