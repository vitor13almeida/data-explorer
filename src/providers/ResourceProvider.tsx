"use client";

import {
  getData,
  getStructure,
} from "@/app/[locale]/explore/[resource_id]/actions";
import { PAGE_SIZES } from "@/services/consts/explorer";
import {
  DatasetProfileResponse,
  FilterOperatorType,
  PaginatedDataResponse,
  ResourceDataResponse,
  ResourceStructureResponse,
} from "@/services/types/Resources";
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
  setResourceId: Dispatch<string>;

  isLoadingData: boolean;
  loadData: () => void;
  errorData: string | null;
  data: PaginatedDataResponse | null;

  isLoadingStructure: boolean;
  errorStructure: string | null;
  structure: DatasetProfileResponse | null;

  headers: string[];
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
  applyFilters: () => void;
  clearFilters: () => void;
  filtersOperator: Record<string, FilterOperatorType>;
  setFiltersOperator: Dispatch<Record<string, FilterOperatorType>>;
};

export const ResourceContext = createContext<ResourceContextType | undefined>(
  undefined,
);

export function ResourceProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const toastContext = useToastContext();
  const { t } = useTranslation("common");
  const { t: te } = useTranslation("explorer");

  const [isReady, setIsReady] = useState<boolean>(false);

  const [resourceId, setResourceId] = useState<string>("");

  const [data, setData] = useState<PaginatedDataResponse | null>(null);
  const [errorData, setErrorData] = useState<string | null>(null);

  const [structure, setStructure] = useState<DatasetProfileResponse | null>(
    null,
  );
  const [errorStructure, setErrorStructure] = useState<string | null>(null);

  const [page, setPage] = useState<number>(0);
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

  const [isLoadingData, startDataTransition] = useTransition();
  const [isLoadingStructure, startStructureTransition] = useTransition();

  const appliedFilters = useRef<Record<string, any>>({});

  const headers: string[] = structure?.profile.header ?? [];
  const total: number = structure?.profile.total_lines ?? 0;
  const totalFiltered: number = data?.meta.total ?? 0;
  const nFiltersApplied: number = Object.keys(appliedFilters.current).filter(
    (filter) => !!appliedFilters.current[filter],
  ).length;

  const loadData = useCallback(async () => {
    if (!resourceId.trim()) return;

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
          filtersOperator,
          appliedFilters.current ?? {},
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
    filtersOperator,
    appliedFilters,
  ]);

  const loadStructure = useCallback(async () => {
    if (!resourceId.trim()) return;

    startStructureTransition(async () => {
      setErrorStructure(null);
      try {
        const response: ResourceStructureResponse =
          await getStructure(resourceId);
        if (response.status === 200 && response.data) {
          setStructure(
            response.data || {
              profile: {},
              dataset_id: "",
              deleted_at: "",
              indexes: null,
            },
          );
        } else {
          setErrorStructure(
            response.errors?.map((error) => error.detail.hint).join(" ") ||
              te("errors.structure.badRequest"),
          );
          toastContext.showToast(
            {
              id: +new Date(),
              title: te("errors.structure.title"),
              description:
                response.errors?.map((error) => error.detail.hint).join(" ") ||
                te("errors.structure.badRequest"),
              type: "failure",
              closeLabel: t("close"),
            },
            5000,
          );
        }
      } catch (err) {
        setErrorStructure(te("errors.structure.failed"));
        toastContext.showToast(
          {
            id: +new Date(),
            title: te("errors.structure.title"),
            description: te("errors.structure.failed"),
            type: "failure",
            closeLabel: t("close"),
          },
          5000,
        );
      }
    });
  }, [startStructureTransition, resourceId]);

  const setUrlParams = (
    page: number = 0,
    page_size: number = 20,
    sortCol: string | null = null,
    sortOrder: string | null = null,
    filters: Record<string, any> | null = null,
  ) => {
    const params = prepareUrlSearchParams(
      page,
      page_size,
      sortCol,
      sortOrder,
      headers,
      filtersOperator,
      filters ?? {},
    );
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${params}`,
    );
  };

  const applyFilters = () => {
    let trimmedFilters = {};
    Object.keys(filters).forEach((key) => {
      trimmedFilters = {
        ...trimmedFilters,
        [key]: String(filters[key]).trim(),
      };
    });
    setFilters(trimmedFilters);
    appliedFilters.current = { ...trimmedFilters };

    void setUrlParams(
      page,
      pageSize,
      sortColumn,
      sortDirection,
      appliedFilters.current,
    );
    void loadData();
  };

  const clearFilters = () => {
    setFilters({});
    appliedFilters.current = {};

    let fo = {};
    headers.forEach((h) => {
      fo = { ...fo, [h]: "contains" };
    });
    setFiltersOperator(fo);

    void setUrlParams(
      page,
      pageSize,
      sortColumn,
      sortDirection,
      appliedFilters.current,
    );
    void loadData();
  };

  useEffect(() => {
    let filtersToSet: Record<string, string> = {};
    searchParams
      .entries()
      .toArray()
      .forEach((param) => {
        const key = param[0];
        const value = param[1];
        switch (key) {
          case "page":
            setPage(value ? (Number(value) ?? 0) : 0);
            break;
          case "page_size":
            setPageSize(value ? (Number(value) ?? 0) : 0);
            break;
          default:
            if (key.endsWith("__sort")) {
              setSortColumn(key.replace("__sort", ""));
              setSortDirection(value === "desc" ? "desc" : "asc");
            } else if (key.endsWith("__contains")) {
              filtersToSet = {
                ...filtersToSet,
                [key.replace("__contains", "")]: value,
              };
            }
            break;
        }
        setFilters(filtersToSet);
        appliedFilters.current = filtersToSet;
      });
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!resourceId && !isReady) return;

    void setUrlParams(
      page,
      pageSize,
      sortColumn,
      sortDirection,
      appliedFilters.current,
    );
    void loadData();
  }, [resourceId, page, pageSize, sortColumn, sortDirection, appliedFilters]);

  useEffect(() => {
    if (!resourceId) return;

    void loadStructure();
  }, [resourceId]);

  useEffect(() => {
    if (structure === null) return;
    let fo = {};
    headers.forEach((h) => {
      fo = { ...fo, [h]: "contains" };
    });
    setFiltersOperator(fo);
  }, [headers]);

  const value = useMemo(
    () => ({
      resourceId,
      setResourceId,

      isLoadingData,
      loadData,
      errorData,
      data,

      isLoadingStructure,
      errorStructure,
      structure,

      headers,
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
      applyFilters,
      clearFilters,
      filtersOperator,
      setFiltersOperator,
    }),
    [
      resourceId,
      isLoadingData,
      loadData,
      errorData,
      data,
      isLoadingStructure,
      errorStructure,
      structure,
      headers,
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
    ],
  );

  return (
    <ResourceContext.Provider value={value}>
      {children}
    </ResourceContext.Provider>
  );
}
