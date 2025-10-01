export type Guid = string & { _guidBrand: undefined };

import { v4 as uuidv4 } from 'uuid';

export function createGuid(): Guid {
  return uuidv4() as Guid;
}