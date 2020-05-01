const triggerDrop = function(element, offset, dataTransfer) {
  let elementPosition = element.getBoundingClientRect().left;
  let dropEvent = new DragEvent('drop', {
    view: window, bubbles: true, cancelable: true, clientX: elementPosition + offset, dataTransfer
  });
  element.dispatchEvent(dropEvent);
  return dropEvent;
};

const getEventPosition = (element) => {
  let style = window.getComputedStyle(element);
  return { startPosition: style['grid-column-start'], endPosition: style['grid-column-end'] };
};

const getMonthSlotConfig = (slotConfig, selectedDate) => {
  let duration = { format: 'day', value: selectedDate.daysInMonth() };
  return Object.assign({ duration }, slotConfig);
};

export { triggerDrop, getEventPosition, getMonthSlotConfig };
