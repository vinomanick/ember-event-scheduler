import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/template';

export function gridPosition([rowPosition, rowOffset, rowSpan, colPosition, colOffset, colSpan]) {
  return htmlSafe(`grid-row: ${rowPosition + rowOffset} / span ${rowSpan}; grid-column: ${colPosition + colOffset} / span ${colSpan}`);
}

export default helper(gridPosition);
