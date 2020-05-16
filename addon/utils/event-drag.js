const getEventElement = (target) => {
  let targetName = target && target.getAttribute('data-name');
  if (targetName === 'event') {
    return target;
  } else {
    return target.closest('[data-name="event"]');
  }
};

const getEventId = (eventElement) => {
  if(eventElement) {
    return eventElement.getAttribute('data-external-event-id');
  }
};

export { getEventElement, getEventId };
