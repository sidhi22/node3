import useSWR, { Fetcher } from "swr";
import { EmployeeNode } from "@/types/neo4j";

const fetcher: Fetcher<EmployeeNode[], string> = (url) =>
  fetch(url).then((r) => r.json());

export default function useEmployees(api: string) {
  const { data, error, isLoading } = useSWR<EmployeeNode[]>(
    `/api/${api}`,
    fetcher
  );

  return {
    employees: data,
    isError: error,
    isLoading,
  };
}
