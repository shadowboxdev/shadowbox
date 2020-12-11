import { addIndex, always, call, ifElse, lensProp, map, over } from 'ramda';
import { isFunction } from 'ramda-adjunct';

export const result = over(lensProp('y'), ifElse(isFunction, call, always(null)));
export const mapIndexed = addIndex(map);