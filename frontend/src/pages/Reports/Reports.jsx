import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import api from "../../services/api";
import toast from "react-hot-toast";

function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await api.get("/api/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);
      setReports(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Unable to load reports.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-8">
        Health Reports
      </h1>

      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="bg-white rounded-3xl shadow-lg p-10 text-center text-gray-500">
            Loading reports...
          </div>
        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Top Disease</th>
                  <th className="p-4 text-left">Probability</th>
                  <th className="p-4 text-left">Risk</th>
                </tr>
              </thead>

              <tbody>

                {reports.map((report) => (
                  <tr
  key={report.id}
  onClick={() =>
    navigate("/prediction-details", {
      state: { report },
    })
  }
  className="border-b hover:bg-slate-100 cursor-pointer"
>
  <td className="p-4">
    {new Date(report.created_at).toLocaleString()}
  </td>

  <td className="p-4">
    {report.predicted_diseases?.[0]?.disease || "N/A"}
  </td>

  <td className="p-4">
    {report.predicted_diseases?.[0]
      ? `${(report.predicted_diseases[0].probability * 100).toFixed(2)}%`
      : "N/A"}
  </td>

  <td className="p-4 capitalize">
    {report.risk_level}
  </td>
</tr>
                ))}

                {reports.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="p-8 text-center text-gray-500"
                    >
                      No health reports available.
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        )}
      </div>

    </Layout>
  );
}

export default Reports;