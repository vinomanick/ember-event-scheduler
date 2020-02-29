import { helper } from '@ember/component/helper';

export function modulus([dividend, divisor]) {
  return dividend % divisor;
}

export default helper(modulus);
