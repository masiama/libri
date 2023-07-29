import { Literal, Optional, Record, Static, String } from 'runtypes';

export const Type = Literal('auto').Or(Literal('manual'));

export type Type = Static<typeof Type>;

export const BookRequest = Record({
  type: Type,
  title: String,
  locationId: String,
  author: Optional(String),
  thumbnail: Optional(String),
});
export type BookRequest = Static<typeof BookRequest>;
