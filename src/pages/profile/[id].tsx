import { EmployeeNode } from "@/types/neo4j";
import Link from "next/link";
import { getEmployeeIds, getEmployeeById } from "@/services/db-service";

interface StaticProps {
  params: {
    id: string;
  };
}

interface ProfileProps {
  employee: EmployeeNode;
}

export default function Profile({ employee }: ProfileProps) {
  const {
    name,
    talentGroup,
    location,
    email,
    position,
    coachEmployeeId,
    coachName,
    status,
  } = employee.properties;
  return (
    <>
      <Link href="/">
        <button>Home</button>
      </Link>
      <h1>{name}</h1>
      <h3>Talent Group: {talentGroup}</h3>
      <h3>Location: {location}</h3>
      <h3>
        <Link href={`mailto:${email}`}>Email: {email}</Link>
      </h3>
      <h3>Position: {position}</h3>
      <h3>
        <Link href={`/profile/${coachEmployeeId}`}>Coach: {coachName}</Link>
      </h3>
      <h3>Status: {status}</h3>
    </>
  );
}

export async function getStaticPaths() {
  const employeeIds = await getEmployeeIds();
  const paths = JSON.parse(employeeIds).map((id: string) => ({
    params: { id },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }: StaticProps) {
  const employee = await getEmployeeById(params.id);
  return { props: { employee: JSON.parse(employee) } };
}
