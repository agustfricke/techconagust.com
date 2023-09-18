/** @jsxImportSource react */

import { useCallback, useRef, useState } from "react";

import { ALGOLIA } from "../../config";

import "../../styles/algolia/style.css";

import * as docSearchReact from "@docsearch/react";
import clsx from "clsx";
import { createPortal } from "react-dom";

/** FIXME: This is still kinda nasty, but DocSearch is not ESM ready. */
const DocSearchModal =
  docSearchReact.DocSearchModal ||
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  (docSearchReact as any).default.DocSearchModal;
const useDocSearchKeyboardEvents =
  docSearchReact.useDocSearchKeyboardEvents ||
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  (docSearchReact as any).default.useDocSearchKeyboardEvents;

export default function Search({ isLanding }: { isLanding: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const [initialQuery, setInitialQuery] = useState("");

  const onOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const onInput = useCallback(
    (e: KeyboardEvent) => {
      setIsOpen(true);
      setInitialQuery(e.key);
    },
    [setIsOpen, setInitialQuery]
  );

  useDocSearchKeyboardEvents({
    isOpen,
    onOpen,
    onClose,
    onInput,
    searchButtonRef,
  });

  return (
    <>
      <button
        type="button"
        aria-label="Search"
        ref={searchButtonRef}
        onClick={onOpen}
        className={clsx(
          "flex w-full cursor-text items-center justify-between rounded-lg px-4 py-2 text-sm font-medium text-slate-800 !transition-colors !duration-300 dark:text-slate-100",
          {
            "border border-gris-200/20 bg-gris-200/10 duration-300 hover:border-gris-200/50":
              isLanding,
            "border bg-gris-200/50 duration-300 hover:bg-gris-200/75 dark:border-gris-200/20 dark:bg-gris-200/10 dark:text-slate-100 dark:hover:border-gris-200/50":
              !isLanding,
          }
        )}
      >
        <div className="flex items-center justify-center gap-1 lg:gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="text-white w-5 h-5"
            height="1em"
            viewBox="0 0 512 512"
          >
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
          </svg>
          <span>Search</span>
        </div>

        <span className="rounded-md border border-current px-1">
          <span className="sr-only">Press </span>
          <kbd>/</kbd>
          <span className="sr-only"> to search</span>
        </span>
      </button>

      {isOpen &&
        createPortal(
          <div className="z-50">
            <DocSearchModal
              initialQuery={initialQuery}
              initialScrollY={window.scrollY}
              onClose={onClose}
              indexName={ALGOLIA.indexName}
              appId={ALGOLIA.appId}
              apiKey={ALGOLIA.apiKey}
              transformItems={(items) => {
                return items.map((item) => {
                  // We transform the absolute URL into a relative URL to
                  // work better on localhost, preview URLS.
                  const a = document.createElement("a");
                  a.href = item.url;
                  const hash = a.hash === "#overview" ? "" : a.hash;
                  return {
                    ...item,
                    url: `${a.pathname}${hash}`,
                  };
                });
              }}
            />
          </div>,
          document.body
        )}
    </>
  );
}
