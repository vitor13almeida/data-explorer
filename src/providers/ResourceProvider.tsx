"use client";

import {
  getData,
  getStructure,
} from "@/app/[locale]/explore/[resource_id]/actions";
import { PAGE_SIZES } from "@/services/consts/explorer";
import {
  DatasetProfileResponse,
  PaginatedDataResponse,
  ResourceDataResponse,
  ResourceStructureResponse,
} from "@/services/types/Resources";
import { prepareUrlSearchParams } from "@/utils/urlParams";
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
};

export const ResourceContext = createContext<ResourceContextType | undefined>(
  undefined,
);

export function ResourceProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();

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

  const [isLoadingData, startDataTransition] = useTransition();
  const [isLoadingStructure, startStructureTransition] = useTransition();

  const appliedFilters = useRef<Record<string, any>>({});

  const headers = structure?.profile.header ?? [];
  const total = structure?.profile.total_lines ?? 0;
  const totalFiltered = data?.meta.total ?? 0;

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
          appliedFilters.current,
        );
        if (response.status === 200 && response.data) {
          setData(response.data || { data: [], links: {}, meta: {} });
        } else {
          setErrorData(response.error || "Erro ao carregar os dados.");
        }
      } catch (err) {
        setErrorData("Falha de rede ao carregar os dados.");
      }
    });
  }, [
    startDataTransition,
    resourceId,
    page,
    pageSize,
    sortColumn,
    sortDirection,
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
          setErrorStructure(response.error || "Erro ao carregar a estrutura.");
        }
      } catch (err) {
        setErrorStructure("Falha de rede ao carregar a estrutura.");
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
      filters,
    );
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${params}`,
    );
  };

  const applyFilters = () => {
    appliedFilters.current = { ...filters };

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
    if (!resourceId && isReady) return;

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
      page,
      pageSize,
      sortColumn,
      sortDirection,
      showFilters,
      filters,
    ],
  );

  return (
    <ResourceContext.Provider value={value}>
      {children}
    </ResourceContext.Provider>
  );
}
