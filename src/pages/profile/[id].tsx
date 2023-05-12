export default function Profile({ employee }) {

  return (
    <>
      <a href="/">
        <button>Home</button>
      </a>
      <h1>{employee.Preferred_Full_Name}</h1>
      <h3>Talent Group: {employee.Talent_Group}</h3>
      <h3>Location: {employee.Location_Name}</h3>
      <h3>
        <a href={`mailto:${employee.Business_Email_Information_Email_Address}`}>
          Email: {employee.Business_Email_Information_Email_Address}
        </a>
      </h3>
      <h3>Position: {employee.Position_Name}</h3>
      <h3>
        <a href={`/profile/${employee.Coach_User_Sys_ID}`}>
          Coach: {employee.Coach}
        </a>
      </h3>
      <h3>Status: {employee.Employee_Status}</h3>
    </>
  );
}

export async function getStaticPaths() {
  const res = await fetch(`http://localhost:3000/api/get-all-employee-id`);
  const employeeIds = await res.json();
  const paths = employeeIds.map(({ id }) => ({
    params: { id: String(id) },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const res = await fetch(
    `http://localhost:3000/api/get-employee-by-id?id=${params.id}`
  );
  const employee = await res
    .json()
    .then((employeeJSON) => employeeJSON[0].employee.properties);
  return { props: { employee } };
}
