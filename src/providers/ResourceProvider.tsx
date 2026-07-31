"use client";

import { getData } from "@/app/[locale]/explorer/[resource_id]/actions";
import {
  FilterOperatorAll,
  INITIAL_PAGE,
  PAGE_SIZES,
} from "@/services/consts/explorer";
import {
  DatasetProfileResponse,
  FilterOperatorType,
  PaginatedDataResponse,
  ResourceDataResponse,
} from "@/services/types";
import { getInitialOperator } from "@/services/utils/data";
import { prepareUrlSearchParams } from "@/utils/urlParams";
import { useToastContext } from "@ama-pt/agora-design-system";
import { useSearchParams } from "next/navigation";
import {
  createContext,
  Dispatch,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { useTranslation } from "react-i18next";

export type ResourceContextType = {
  resourceId: string;

  isLoadingData: boolean;
  loadData: () => void;
  errorData: string | null;
  data: PaginatedDataResponse | null;

  structure: DatasetProfileResponse;

  headers: string[];
  headersVisibility: Record<string, boolean>;
  setHeadersVisibility: Dispatch<Record<string, boolean>>;
  nHeadersVisible: number;
  appliedHeadersVisibility: Record<string, boolean>;

  total: number;
  totalFiltered: number;
  nFiltersApplied: number;

  page: number;
  setPage: Dispatch<number>;
  pageSize: number;
  setPageSize: Dispatch<number>;

  sortColumn: string | null;
  setSortColumn: Dispatch<string | null>;
  sortDirection: "asc" | "desc" | null;
  setSortDirection: Dispatch<"asc" | "desc" | null>;

  showFilters: boolean;
  setShowFilters: Dispatch<boolean>;
  filters: Record<string, any>;
  setFilters: Dispatch<Record<string, any>>;
  removeFilter: (filter: string) => void;
  applyFilters: () => void;
  clearFilters: () => void;
  filtersOperator: Record<string, FilterOperatorType>;
  setFiltersOperator: Dispatch<Record<string, FilterOperatorType>>;

  invalidFilters: boolean;
  setInvalidFilters: Dispatch<boolean>;
};

export const ResourceContext = createContext<ResourceContextType | undefined>(
  undefined,
);

export type ResourceProviderI = {
  resourceId: string;
  structure: DatasetProfileResponse;
  children: ReactNode;
};

export function ResourceProvider({
  resourceId,
  structure,
  children,
}: ResourceProviderI) {
  const searchParams = useSearchParams();
  const toastContext = useToastContext();
  const { t } = useTranslation("common");
  const { t: te } = useTranslation("explorer");

  const [isReady, setIsReady] = useState<boolean>(false);

  const [data, setData] = useState<PaginatedDataResponse | null>(null);
  const [errorData, setErrorData] = useState<string | null>(null);

  const [headersVisibility, setHeadersVisibility] = useState<
    Record<string, boolean>
  >({});

  const [page, setPage] = useState<number>(INITIAL_PAGE);
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZES[0]);

  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null,
  );

  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [filtersOperator, setFiltersOperator] = useState<
    Record<string, FilterOperatorType>
  >({});

  const [invalidFilters, setInvalidFilters] = useState<boolean>(false);

  const [isLoadingData, startDataTransition] = useTransition();

  const appliedFilters = useRef<Record<string, any>>({});
  const appliedFiltersOperator = useRef<Record<string, any>>({});
  const appliedHeadersVisibility = useRef<Record<string, boolean>>({});

  const headers: string[] = structure?.profile.header ?? [];
  const nHeaders: number = Object.values(headers).length;
  const nHeadersVisible: number = Object.values(headersVisibility).filter(
    (v) => v === true,
  ).length;

  const total: number = structure?.profile.total_lines ?? 0;
  const totalFiltered: number = data?.meta.total ?? 0;
  const nFiltersApplied: number = Object.keys(appliedFilters.current).filter(
    (filter) => !!appliedFilters.current[filter],
  ).length;

  const getColumnsForFilters = useCallback(() => {
    const applied = appliedHeadersVisibility.current;
    const nVisible = Object.values(applied).filter((v) => v === true).length;
    return nVisible < nHeaders
      ? Object.keys(applied).filter((h) => applied[h] === true)
      : [];
  }, [nHeaders]);

  const loadData = useCallback(async () => {
    if (!resourceId.trim()) return;

    const columnsForFilters = getColumnsForFilters();

    startDataTransition(async () => {
      setErrorData(null);
      try {
        const response: ResourceDataResponse = await getData(
          resourceId,
          page,
          pageSize,
          sortColumn,
          sortDirection,
          headers,
          appliedFiltersOperator.current ?? {},
          appliedFilters.current ?? {},
          columnsForFilters,
        );
        if (response.status === 200 && response.data) {
          setData(response.data || { data: [], links: {}, meta: {} });
        } else {
          setData(null);
          setErrorData(
            response.errors?.map((error) => error.detail.hint).join(" ") ||
              te("errors.data.badRequest"),
          );
          toastContext.showToast(
            {
              id: +new Date(),
              title: te("errors.data.title"),
              description:
                response.errors?.map((error) => error.detail.hint).join(" ") ||
                te("errors.data.badRequest"),
              type: "failure",
              closeLabel: t("close"),
            },
            5000,
          );
        }
      } catch (err) {
        setData(null);
        setErrorData(te("errors.data.failed"));
        toastContext.showToast(
          {
            id: +new Date(),
            title: te("errors.data.title"),
            description: te("errors.data.failed"),
            type: "failure",
            closeLabel: t("close"),
          },
          5000,
        );
      }
    });
  }, [
    startDataTransition,
    resourceId,
    page,
    pageSize,
    sortColumn,
    sortDirection,
    headers,
    getColumnsForFilters,
  ]);

  const setUrlParams = useCallback(() => {
    const columnsForFilters = getColumnsForFilters();

    const params = prepareUrlSearchParams(
      page,
      pageSize,
      sortColumn,
      sortDirection,
      headers,
      appliedFiltersOperator.current,
      appliedFilters.current ?? {},
      columnsForFilters,
    );
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${params}`,
    );
  }, [
    page,
    pageSize,
    sortColumn,
    sortDirection,
    headers,
    getColumnsForFilters,
  ]);

  const removeFilter = useCallback(
    (filter: string) => {
      const { [filter]: _, ...rest } = filters;
      setFilters(rest);
    },
    [filters],
  );

  const applyFilters = useCallback(() => {
    let trimmedFilters = {};
    Object.keys(filters).forEach((key) => {
      trimmedFilters = {
        ...trimmedFilters,
        [key]: String(filters[key]).trim(),
      };
    });
    setFilters(trimmedFilters);
    appliedFilters.current = { ...trimmedFilters };

    appliedFiltersOperator.current = { ...filtersOperator };

    appliedHeadersVisibility.current = { ...headersVisibility };

    setPage(INITIAL_PAGE);

    void setUrlParams();
    void loadData();
  }, [filters, filtersOperator, setUrlParams, loadData, headersVisibility]);

  const clearFilters = useCallback(() => {
    setFilters({});
    appliedFilters.current = {};

    let fo = {};
    let fv = {};
    headers.forEach((h) => {
      const value = getInitialOperator(h, structure);
      fo = { ...fo, [h]: value };
      fv = { ...fv, [h]: true };
    });

    setFiltersOperator(fo);
    appliedFiltersOperator.current = { ...fo };

    setHeadersVisibility(fv);
    appliedHeadersVisibility.current = { ...fv };

    setPage(INITIAL_PAGE);

    void setUrlParams();
    void loadData();
  }, [headers, setUrlParams, loadData, structure]);

  useEffect(() => {
    let filtersToSet: Record<string, string> = {};
    let operatorsToSet: Record<string, FilterOperatorType> = {};
    let showCol: Record<string, boolean> = {};

    headers.forEach((h) => {
      const value = getInitialOperator(h, structure);
      filtersToSet = { ...filtersToSet, [h]: value };
      showCol = { ...showCol, [h]: true };
    });

    searchParams
      .entries()
      .toArray()
      .forEach((param) => {
        const key = param[0];
        const value = param[1];

        switch (key) {
          case "page":
            setPage(value ? Number(value) || INITIAL_PAGE : INITIAL_PAGE);
            break;
          case "page_size":
            setPageSize(value ? Number(value) || PAGE_SIZES[0] : PAGE_SIZES[0]);
            break;
          case "columns": {
            const colsParams = value.split(",");
            let hv: Record<string, boolean> = {};
            headers.forEach((h) => {
              hv = { ...hv, [h]: colsParams.includes(h) };
            });
            showCol = { ...hv };
            break;
          }
          default: {
            if (key.endsWith("__sort")) {
              setSortColumn(key.replace("__sort", ""));
              setSortDirection(value === "desc" ? "desc" : "asc");
            } else {
              const operator = FilterOperatorAll.find((candidate) =>
                key.endsWith(`__${candidate}`),
              );

              if (operator) {
                const filterKey = key.replace(`__${operator}`, "");
                filtersToSet = {
                  ...filtersToSet,
                  [filterKey]: value,
                };
                operatorsToSet = {
                  ...operatorsToSet,
                  [filterKey]: operator,
                };
              }
            }
            break;
          }
        }
      });

    setFilters(filtersToSet);
    appliedFilters.current = { ...filtersToSet };
    setFiltersOperator(operatorsToSet);
    appliedFiltersOperator.current = { ...operatorsToSet };
    setHeadersVisibility(showCol);
    appliedHeadersVisibility.current = { ...showCol };

    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    void setUrlParams();
  }, [page, pageSize, sortColumn, sortDirection, isReady]);

  useEffect(() => {
    if (!resourceId || !isReady) return;

    void loadData();
  }, [
    resourceId,
    isReady,
    page,
    pageSize,
    sortColumn,
    sortDirection,
    loadData,
  ]);

  useEffect(() => {
    if (structure === null) return;

    const nextOperators: Record<string, FilterOperatorType> = {
      ...filtersOperator,
    };
    const nextFilters: Record<string, string> = { ...filters };
    let hasChanges = false;

    headers.forEach((h) => {
      if (!nextOperators[h]) {
        nextOperators[h] = getInitialOperator(h, structure);
        hasChanges = true;
      }
      if (nextFilters[h] === undefined) {
        nextFilters[h] = "";
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setFiltersOperator(nextOperators);
      setFilters(nextFilters);
      appliedFilters.current = { ...appliedFilters.current, ...nextFilters };
    }
  }, [headers, structure]);

  useEffect(() => {
    if (isReady) {
      if (nHeadersVisible < 1) {
        toastContext.showToast(
          {
            id: +new Date(),
            title: te("errors.visibleColumns.title"),
            description: te("errors.visibleColumns.description"),
            type: "warning",
            closeLabel: t("close"),
          },
          5000,
        );
      }
    }
  }, [isReady, nHeadersVisible]);

  const value = useMemo(
    () => ({
      resourceId,

      isLoadingData,
      loadData,
      errorData,
      data,

      structure,

      headers,
      headersVisibility,
      setHeadersVisibility,
      nHeadersVisible,
      appliedHeadersVisibility: appliedHeadersVisibility.current,

      total,
      totalFiltered,
      nFiltersApplied,

      page,
      setPage,
      pageSize,
      setPageSize,

      sortColumn,
      setSortColumn,
      sortDirection,
      setSortDirection,

      showFilters,
      setShowFilters,
      filters,
      setFilters,
      removeFilter,
      applyFilters,
      clearFilters,
      filtersOperator,
      setFiltersOperator,

      invalidFilters,
      setInvalidFilters,
    }),
    [
      resourceId,
      isLoadingData,
      loadData,
      errorData,
      data,
      structure,
      headers,
      headersVisibility,
      nHeadersVisible,
      total,
      totalFiltered,
      nFiltersApplied,
      page,
      pageSize,
      sortColumn,
      sortDirection,
      showFilters,
      filters,
      filtersOperator,
      invalidFilters,
    ],
  );

  return (
    <ResourceContext.Provider value={value}>
      {children}
    </ResourceContext.Provider>
  );
}
