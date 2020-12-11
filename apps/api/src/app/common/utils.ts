import {
  assoc,
  compose,
  curryN,
  filter,
  isNil,
  keys,
  map,
  reduce,
} from 'ramda';
import { isNilOrEmpty } from 'ramda-adjunct';

const filterEnumPropKeys = filter((key) => isNaN(+key));

const createMapConstructorArgs = curryN(1, (input: object) =>
  compose<object, string[], string[], [string, string | number][]>(
    map((key) => [key, input[key]]),
    filterEnumPropKeys,
    keys
  )(input)
);

export function enumToMap(input: object): Map<string, string | number> {
  if (isNilOrEmpty(input)) return new Map<string, string | number>();

  const args = createMapConstructorArgs(input);

  return new Map<string, string | number>(args);
}

const createDictionary = curryN(1, (input: object) =>
  compose<object, string[], string[], Record<string, string | number>>(
    reduce((acc, key) => (acc = assoc(key, input[key], acc)), {}),
    filterEnumPropKeys,
    keys
  )(input)
);

export function enumToDictionary(
  input: object
): Record<string, string | number> {
  if (isNil(input)) return {};

  return createDictionary(input);
}

export function getEnumKeys<T>(input: T): (keyof typeof input)[] {
  if (isNil(input)) return [];

  const enumKeys = keys<T>(input) as (keyof typeof input)[];

  return filterEnumPropKeys(enumKeys);
}
