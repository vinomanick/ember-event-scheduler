import faker from 'faker';
import moment from 'moment';

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

const buildEvents = (count, idStart = 0, hasAppointment = true) => {
  let events = [];
  let startTime, endTime;
  for(let i=0; i<count; i++) {
    if(hasAppointment) {
      startTime = moment().startOf('day').add(faker.random.number({ min:0, max:2 }), 'd').add(faker.random.number({ min:0, max:5 }), 'h');
      endTime = startTime.clone().add(faker.random.number({ min:1, max:4 }), 'h');
    }
    events.push({
      id: idStart+1,
      resourceId: faker.random.number({ min:101, max:110 }),
      title: faker.lorem.sentence(),
      startTime: startTime ? startTime.toISOString() : null,
      endTime: endTime ? endTime.toISOString() : null
    });
  }
  return events;
};

export { buildResources, buildEvents };
