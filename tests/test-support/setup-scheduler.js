import { DEFAULT_CONFIG } from 'dummy/tests/constants/event-scheduler';
import sinon from 'sinon';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

const setupScheduler = (hooks) => {
  hooks.beforeEach(function() {
    // Inject moment service and setting the zone
    this.moment = this.owner.lookup('service:moment');
    this.moment.setTimeZone('Europe/Amsterdam');
    this.moment.setLocale('en');

    this.store = this.owner.lookup('service:store');

    let resourceId = 101;
    let resourceId2 = 102;
    let eventId = 1;
    let currentDate = this.get('moment').moment().startOf('day');

    let config = DEFAULT_CONFIG();

    // Exposing this default properties to tests so that they can modify it if needed
    this.setProperties({
      currentDate,
      config,
      resourceId,
      resourceId2,
      eventId
    });

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
          id: eventId,
          resourceId,
          title: 'First event for Resource 1',
          startTime: currentDate.clone().set({ h: 2, m: 0 }),
          endTime: currentDate.clone().set({ h: 3, m: 0 })
        }]);
        this.publicApi.actions.add('resources', [
          { id: resourceId, name: 'Resource 1' },
          { id: resourceId2, name: 'Resource 2' }]);
        this.publicApi.actions.add('events', [{
          id: eventId,
          resourceId,
          title: 'First event for Resource 1',
          startTime: currentDate.clone().set({ h: 2, m: 0 }),
          endTime: currentDate.clone().set({ h: 3, m: 0 })
        }]);
      }
    });
  });
};

const renderScheduler = async () => {
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

  await settled();
};


export { setupScheduler, renderScheduler };
