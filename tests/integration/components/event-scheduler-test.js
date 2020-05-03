import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';
import { DEFAULT_CONFIG } from 'dummy/tests/constants/event-scheduler';

module('Integration | Component | event-scheduler', function(hooks) {
  setupRenderingTest(hooks);

  let currentDate;

  hooks.beforeEach(function() {
    // Inject moment service and setting the zone
    this.moment = this.owner.lookup('service:moment');
    this.moment.setTimeZone('Europe/Amsterdam');
    this.moment.setLocale('en');

    currentDate = this.get('moment').moment().startOf('day');

    let config = DEFAULT_CONFIG();

    this.setProperties({
      selectedDate: currentDate,
      selectedView: config.defaultView,
      selectedDuration: config.toolbar.duration.default,
      isExternalEventsLoading: true,
      isCalendarLoading: true,
      isExternalEventsLoadedAll: false,
      onEventDropSpy: sinon.spy(),
      loadScheduler: (publicApi) => {
        this.setProperties({
          publicApi,
          isCalendarLoading: false,
          isExternalEventsLoading: false,
        });
        this.publicApi.actions.add('externalEvents', [{
          id: '1',
          resourceId: '101',
          title: 'First event for Resource 1',
          startTime: currentDate.clone().set({ h: 2, m: 0 }),
          endTime: currentDate.clone().set({ h: 3, m: 0 })
        }]);
        this.publicApi.actions.add('resources', [{ id: 101, name: 'Resource 1' }]);
        this.publicApi.actions.add('events', [{
          id: '1',
          resourceId: '101',
          title: 'First event for Resource 1',
          startTime: currentDate.clone().set({ h: 2, m: 0 }),
          endTime: currentDate.clone().set({ h: 3, m: 0 })
        }]);
      }
    });
  });

  test('it render', async function(assert) {

    await render(hbs`
    {{#event-scheduler options=config
      selectedView=selectedView
      selectedDuration=selectedDuration
      selectedDate=selectedDate
      isExternalEventsExpanded=true
      onSchedulerLoad=(action loadScheduler)
      onEventDrop=(action onEventDropSpy)
      as |scheduler|}}

      {{#scheduler.toolbar
        as |toolbar|}}
        {{toolbar.left}}
        {{toolbar.right}}
        {{toolbar.center}}
      {{/scheduler.toolbar}}

      {{#scheduler.calendar
        isLoading=isCalendarLoading
        as |calendar|}}
        {{calendar.resourceHeader name="Resources"}}
        {{calendar.gridHeader}}
        {{calendar.empty}}
      {{/scheduler.calendar}}


      {{#scheduler.externalEvents
        isLoading=isExternalEventsLoading
        isLoadedAll=isExternalEventsLoadedAll
        as |externalEvents|}}
        {{externalEvents.header name="Events"}}
        {{externalEvents.empty}}
      {{/scheduler.externalEvents}}

    {{/event-scheduler}}`);

    assert.dom('[data-test-es="event-scheduler"]').exists();
    assert.dom('[data-test-es="es-external-events"]').exists();
    assert.dom('[data-test-es="es-calendar"]').exists();

    await settled();

    assert.ok(this.publicApi);
    assert.dom('[data-test-es=resource]').exists({ count: 1 });
    assert.dom('[data-test-es=event-wrapper]').exists({ count: 1 });
    assert.dom('[data-test-es="external-event-wrapper"]').exists({ count: 1 });
  });
});
