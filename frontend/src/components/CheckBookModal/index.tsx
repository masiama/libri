import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import Scanner from '../Scanner/Scanner';
import { getBook } from '../../utils/api';

interface Props {
  show: boolean;
  hide: () => void;
}

const CheckBookModal = ({ show, hide }: Props) => {
  const timer = useRef<number>();

  const [isbn, setIsbn] = useState('');
  const [state, setState] = useState<'found' | 'not-found'>();

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const result = await getBook(isbn);
    setIsbn('');
    setState('data' in result ? 'found' : 'not-found');
    timer.current = window.setTimeout(() => setState(void 0), 5000);
  };

  useEffect(
    () => () => {
      setIsbn('');
      setState(void 0);
      window.clearTimeout(timer.current);
    },
    [show],
  );

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
              Check existing book
            </h3>
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
              <button
                type="submit"
                className="bg-primary-700 hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 w-full rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4"
              >
                Search for the book
              </button>

              {!isbn && (
                <Scanner
                  width={500}
                  height={500}
                  onUpdate={(_, result) => {
                    if (result) setIsbn(result.getText());
                  }}
                />
              )}
            </form>
          </div>
        </div>
      </div>
      {state === 'found' && (
        <div className="z-51 fixed bottom-0 left-0 p-4">
          <div
            className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            Book is already in your library
          </div>
        </div>
      )}
      {state === 'not-found' && (
        <div className="z-51 fixed bottom-0 left-0 p-4">
          <div
            className="mb-4 rounded-lg bg-green-50 p-4 text-sm text-green-800 dark:bg-gray-800 dark:text-green-400"
            role="alert"
          >
            Book is not in your library yet!
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckBookModal;
