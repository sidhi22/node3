import driver from "@/lib/neo4j";
import { Session, QueryResult, Record } from "neo4j-driver";

export async function getRecords(query: string) {
  const session: Session = driver.session();
  const result: QueryResult = await session.run(query);
  await session.close();
  return result.records;
}

export async function getEmployeeIds() {
  const DATA_VARIABLE = "id";
  const query = `MATCH (e:Employee) RETURN e.employeeId as ${DATA_VARIABLE}`;
  const records: Record[] = await getRecords(query);
  return JSON.stringify(
    records.map((record: Record) => record.get(DATA_VARIABLE))
  );
}

export async function getEmployeeById(id: string) {
  const DATA_VARIABLE = "employee";
  const query = `MATCH (e:Employee) WHERE e.employeeId = "${id}" RETURN e as ${DATA_VARIABLE}`;
  const records: Record[] = await getRecords(query);
  return JSON.stringify(records[0].get(DATA_VARIABLE));
}
