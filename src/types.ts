import { Optional, Record, Static, String } from 'runtypes';

export const BookRequest = Record({
  title: String,
  author: Optional(String),
  thumbnail: Optional(String),
});
export type BookRequest = Static<typeof BookRequest>;
