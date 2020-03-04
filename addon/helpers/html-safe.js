import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/template';

export function htmlSafeHelper(params/*, hash*/) {
  return htmlSafe(params);
}

export default helper(htmlSafeHelper);
