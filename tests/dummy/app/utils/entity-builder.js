// BEGIN-SNIPPET entity-builder.js
import faker from 'faker';

const buildResources = (count) => {
  let resources = [];
  for(let i=0; i<count; i++) {
    resources.push({
      id: (101+i),
      name: faker.name.firstName()
    });
  }
  return resources;
};

const buildEvents = (selectedDate, viewType, count, idStart = 1, hasAppointment = true) => {
  let events = [];
  let startTime, endTime;
  for(let i=0; i<count; i++) {
    if(hasAppointment) {
      startTime = selectedDate.clone().startOf(viewType).add(faker.random.number({ min:0, max:5 }), 'h');
      if (viewType === 'week') {
        startTime.add(faker.random.number({ min:0, max:7 }), 'd');
      } else if ( viewType === 'month') {
        startTime.add(faker.random.number({ min:0, max:25 }), 'd');
      }
      endTime = startTime.clone().add(faker.random.number({ min:1, max:4 }), 'h');
    }
    events.push({
      id: idStart + i,
      resourceId: faker.random.number({ min:101, max:120 }),
      title: faker.lorem.sentence(),
      startTime: startTime ? startTime.toISOString() : null,
      endTime: endTime ? endTime.toISOString() : null
    });
  }
  return events;
};

export { buildResources, buildEvents };
// END-SNIPPET
