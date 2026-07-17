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
import {
  createContext,
  Dispatch,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
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
  sortDirection: string | null;
  setSortDirection: Dispatch<string | null>;
};

export const ResourceContext = createContext<ResourceContextType | undefined>(
  undefined,
);

export function ResourceProvider({ children }: { children: ReactNode }) {
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
  const [sortDirection, setSortDirection] = useState<string | null>(null);

  const [isLoadingData, startDataTransition] = useTransition();
  const [isLoadingStructure, startStructureTransition] = useTransition();

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

  useEffect(() => {
    if (!resourceId) return;

    void loadData();
  }, [resourceId, page, pageSize, sortColumn, sortDirection]);

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
    ],
  );

  return (
    <ResourceContext.Provider value={value}>
      {children}
    </ResourceContext.Provider>
  );
}
