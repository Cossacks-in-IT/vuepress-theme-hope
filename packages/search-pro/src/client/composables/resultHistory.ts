import { useLocalStorage } from "@vueuse/core";
import type { Ref } from "vue";
import { useRouter } from "vue-router";

import { searchProOptions } from "../define.js";
import type { MatchedItem, Word } from "../typings/index.js";

const SEARCH_PRO_HISTORY_RESULT_STORAGE = "SEARCH_PRO_RESULT_HISTORY";

export interface SearchResult {
  header?: string;
  link: string;
  display: Word[][];
}

export interface SearchResultHistory {
  enabled: boolean;
  resultHistory: Ref<SearchResult[]>;
  addResultHistory: (item: MatchedItem) => void;
  removeResultHistory: (index: number) => void;
}

const { resultHistoryCount } = searchProOptions;

const searchProResultStorage = useLocalStorage<SearchResult[]>(
  SEARCH_PRO_HISTORY_RESULT_STORAGE,
  [],
);

export const useSearchResultHistory = (): SearchResultHistory => {
  const router = useRouter();

  const enabled = resultHistoryCount > 0;

  const getRealPath = (item: MatchedItem): string =>
    router.resolve({
      name: item.key,
      ...("anchor" in item ? { hash: `#${item.anchor}` } : {}),
    }).fullPath;

  const addResultHistory = (item: MatchedItem): void => {
    if (enabled) {
      const result: SearchResult = {
        link: getRealPath(item),
        display: item.display,
      };

      if ("header" in item) result.header = item.header;
      if (searchProResultStorage.value.length < resultHistoryCount)
        searchProResultStorage.value = [
          result,
          ...searchProResultStorage.value,
        ];
      else
        searchProResultStorage.value = [
          result,
          ...searchProResultStorage.value.slice(0, resultHistoryCount - 1),
        ];
    }
  };

  const removeResultHistory = (index: number): void => {
    searchProResultStorage.value = [
      ...searchProResultStorage.value.slice(0, index),
      ...searchProResultStorage.value.slice(index + 1),
    ];
  };

  return {
    enabled,
    resultHistory: searchProResultStorage,
    addResultHistory,
    removeResultHistory,
  };
};
