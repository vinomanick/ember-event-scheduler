# Event Scheduler

Creating a scheduler is straight forward. The only required argument is the options.
Thanks to ember-wormhole and ember multiple yield hash, it helped us to provide a placeholder for all the
different sub-components.

The users can easily yield these placeholders with custom components by calling them as block components or stick with the basic implementation that is provided out of the box by the scheduler. It may sound confusing but once you see the contextual section components you will know sky is the limit.

## Actions

### onSchedulerLoad
The onSchedulerLoad hook will return the scheduler instance based on the options provided.
You can use this instance to manage your scheduler state and manage your events/resources.


### onEventDrop
The onEventDrop hook will return the updated event data whenever an event is dropped inside the calendar.
That event can be dragged from the external events list or the existing event from the calendar itself.

## Usage

{{demo-event-scheduler}}
