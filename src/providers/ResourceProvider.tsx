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
  setData: Dispatch<SetStateAction<PaginatedDataResponse | null>>;
  errorData: string | null;

  isLoadingStructure: boolean;
  structure: DatasetProfileResponse | null;
  setStructure: Dispatch<SetStateAction<DatasetProfileResponse | null>>;
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

  // get data when the resourceId changes and isn't an empty string
  // TODO: implement pagination (server side)
  // TODO: implement sorting (server side)
  useEffect(() => {
    if (!resourceId.trim()) return;

    startDataTransition(async () => {
      setErrorData(null);
      try {
        const response: ResourceDataResponse = await getData(resourceId);
        if (response.status === 200 && response.data) {
          setData(response.data || { data: [], links: {}, meta: {} });
        } else {
          setErrorData(response.error || "Erro ao carregar os dados.");
        }
      } catch (err) {
        setErrorData("Falha de rede ao carregar os dados.");
      }
    });
  }, [resourceId]);

  useEffect(() => {
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
  }, [resourceId]);

  const value = useMemo(
    () => ({
      resourceId,
      setResourceId,

      isLoadingData: !isLoadingData,
      data,
      setData,
      errorData,

      isLoadingStructure: !isLoadingStructure,
      structure,
      setStructure,
      errorStructure,
    }),
    [resourceId, structure, data],
  );

  return (
    <ResourceContext.Provider value={value}>
      {children}
    </ResourceContext.Provider>
  );
}
