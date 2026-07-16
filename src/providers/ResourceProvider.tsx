"use client";

import {
  getData,
  getStructure,
} from "@/app/[locale]/explore/[resource_id]/actions";
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
  SetStateAction,
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
  data: PaginatedDataResponse | null;
  loadData: (page?: number, pageSize?: number) => void;
  errorData: string | null;

  isLoadingStructure: boolean;
  structure: DatasetProfileResponse | null;
  errorStructure: string | null;
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

  const [isLoadingData, startDataTransition] = useTransition();
  const [isLoadingStructure, startStructureTransition] = useTransition();

  // TODO: implement sorting (server side)
  const loadData = useCallback(
    async (page = 0, pageSize = 20) => {
      if (!resourceId.trim()) return;

      startDataTransition(async () => {
        setErrorData(null);
        try {
          const response: ResourceDataResponse = await getData(
            resourceId,
            page,
            pageSize,
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
    },
    [startDataTransition, resourceId],
  );

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
    void loadStructure();
  }, [resourceId]);

  const value = useMemo(
    () => ({
      resourceId,
      setResourceId,

      isLoadingData,
      data,
      loadData,
      errorData,

      isLoadingStructure,
      structure,
      errorStructure,
    }),
    [
      resourceId,
      structure,
      data,
      errorData,
      errorStructure,
      isLoadingData,
      isLoadingStructure,
      loadData,
    ],
  );

  return (
    <ResourceContext.Provider value={value}>
      {children}
    </ResourceContext.Provider>
  );
}
