import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { BrowserMultiFormatReader } from '@zxing/library';

import { useStore } from '../../utils/store';
import { saveBook } from '../../utils/api';
import { Type } from '../../../../src/types';

interface Props {
  show: boolean;
  hide: () => void;
}

const AddBookModal = ({ show, hide }: Props) => {
  const mounted = useRef<boolean>();
  const timer = useRef<number>();
  const errorTimer = useRef<number>();
  const webcam = useRef<Webcam>(null);

  const locations = useStore(store => store.locations);
  const addBook = useStore(store => store.addBook);

  const [isbn, setIsbn] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState<string>();
  const [type, setType] = useState<Type>('auto');
  const [locationId, setLocationId] = useState(locations[0]?.id);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const result = await saveBook({ type, isbn, title, author, locationId });
    if ('error' in result) {
      setError(result.error);
      errorTimer.current = window.setTimeout(() => setError(void 0), 5000);
      return;
    }

    addBook(result);
    hide();
  };

  useEffect(
    () => () => {
      setIsbn('');
      setTitle('');
      setAuthor('');
      setError(void 0);
      window.clearTimeout(errorTimer.current);
    },
    [show],
  );

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    (async () => {
      const run = async () => {
        const image = webcam.current?.getScreenshot();
        if (image) {
          const scanner = new BrowserMultiFormatReader();
          try {
            const result = await scanner.decodeFromImage(undefined, image);
            setIsbn(result.getText());
          } catch {}
        }

        if (!mounted.current) return;

        timer.current = window.setTimeout(run, 1000);
      };

      run();
      return () => {
        window.clearTimeout(timer.current);
      };
    })();
  }, []);

  return (
    <div
      className={clsx(
        'fixed left-0 right-0 top-0 z-50 flex h-full max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-white bg-opacity-80 p-4 dark:bg-gray-800 dark:bg-opacity-80 md:inset-0',
        { hidden: !show },
      )}
    >
      <div className="relative max-h-full w-full max-w-md">
        <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
          <button
            type="button"
            className="absolute right-2.5 top-3 ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
            onClick={hide}
          >
            <svg
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          <div className="px-6 py-6 lg:px-8">
            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
              Add new book
            </h3>
            <div className="mb-6 flex w-full">
              <button
                className={clsx(
                  'grow rounded-l-full border-r-0 px-6 py-2 text-base font-semibold leading-5',
                  type === 'auto'
                    ? 'bg-primary-700 text-white'
                    : 'border border-gray-300',
                )}
                onClick={() => setType('auto')}
              >
                Auto
              </button>
              <button
                className={clsx(
                  'grow rounded-r-full border-l-0 px-6 py-2 text-base font-semibold leading-5',
                  type === 'manual'
                    ? 'bg-primary-700 text-white'
                    : 'border border-gray-300',
                )}
                onClick={() => setType('manual')}
              >
                Manual
              </button>
            </div>
            <form className="space-y-6" onSubmit={onSubmit}>
              <div>
                <label
                  htmlFor="isbn"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  ISBN
                </label>
                <input
                  type="number"
                  name="isbn"
                  id="isbn"
                  className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                  placeholder="9780134093413"
                  value={isbn}
                  onChange={e => setIsbn(e.target.value)}
                  required
                />
              </div>
              {type === 'manual' && (
                <>
                  <div>
                    <label
                      htmlFor="title"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Title
                    </label>
                    <input
                      name="title"
                      id="title"
                      className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                      placeholder="Harry Potter and the Philosopher's Stone"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="author"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Author
                    </label>
                    <input
                      name="author"
                      id="author"
                      className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                      placeholder="J. K. Rowling"
                      value={author}
                      onChange={e => setAuthor(e.target.value)}
                    />
                  </div>
                </>
              )}
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Locations
                </label>
                <select
                  value={locationId}
                  onChange={e => setLocationId(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                >
                  {locations.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.title}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="bg-primary-700 hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 w-full rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4"
              >
                Add book to your library
              </button>

              <Webcam ref={webcam} />
            </form>
          </div>
        </div>
      </div>
      {error && (
        <div className="z-51 fixed bottom-0 left-0 p-4">
          <div
            className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            {error}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddBookModal;
