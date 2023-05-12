import { EmployeeNode } from "@/types/neo4j";

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
      <a href="/">
        <button>Home</button>
      </a>
      <h1>{name}</h1>
      <h3>Talent Group: {talentGroup}</h3>
      <h3>Location: {location}</h3>
      <h3>
        <a href={`mailto:${email}`}>Email: {email}</a>
      </h3>
      <h3>Position: {position}</h3>
      <h3>
        <a href={`/profile/${coachEmployeeId}`}>Coach: {coachName}</a>
      </h3>
      <h3>Status: {status}</h3>
    </>
  );
}

export async function getStaticPaths() {
  const res = await fetch(`http://localhost:3000/api/get-ids`);
  const employeeIds = await res.json();
  const paths = employeeIds.map((id: string) => ({
    params: { id },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }: StaticProps) {
  const res = await fetch(
    `http://localhost:3000/api/get-employee-by-id?id=${params.id}`
  );
  console.log("HERE")
  const employee = await res.json();
  return { props: { employee } };
}
