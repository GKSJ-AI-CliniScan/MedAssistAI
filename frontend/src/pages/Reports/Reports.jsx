import Layout from "../../components/layout/Layout";
function Reports() {
  const reports = [
    {
      id: 1,
      date: "07 July 2026",
      disease: "Influenza",
      confidence: "92%",
      severity: "Medium",
    },
    {
      id: 2,
      date: "05 July 2026",
      disease: "Migraine",
      confidence: "89%",
      severity: "Low",
    },
    {
      id: 3,
      date: "02 July 2026",
      disease: "COVID-19",
      confidence: "96%",
      severity: "High",
    },
  ];

  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-8">
        Health Reports
      </h1>

      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-blue-600 text-white">

            <tr>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Disease</th>
              <th className="p-4 text-left">Confidence</th>
              <th className="p-4 text-left">Severity</th>
            </tr>

          </thead>

          <tbody>

            {reports.map((report) => (

              <tr
                key={report.id}
                className="border-b hover:bg-slate-50"
              >
                <td className="p-4">{report.date}</td>
                <td className="p-4">{report.disease}</td>
                <td className="p-4">{report.confidence}</td>
                <td className="p-4">{report.severity}</td>
              </tr>

            ))}

          </tbody>

        </table>

      </div>
    </Layout>
  );
}

export default Reports;