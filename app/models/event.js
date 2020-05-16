import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  title: attr('string'),
  resourceId: attr('number'),
  startTime: attr('date'),
  endTime: attr('date'),
  prevData: attr(),
  isCalendarEvent: attr('boolean', { defaultValue: false }),
  isExternalEvent: attr('boolean', { defaultValue: false })
});
