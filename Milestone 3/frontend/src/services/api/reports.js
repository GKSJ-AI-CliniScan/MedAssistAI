import client from './client';

/**
 * GET /reports/my
 * Returns: Array of ReportResponse
 */
export async function getMyReports() {
  const response = await client.get('/reports/my');
  return response.data;
}

/**
 * GET /reports/{id}
 */
export async function getReport(id) {
  const response = await client.get(`/reports/${id}`);
  return response.data;
}

/**
 * GET /reports/{id}/download
 * Returns plain text report (Content-Type: text/plain)
 */
export async function downloadReportText(id) {
  const response = await client.get(`/reports/${id}/download`, {
    responseType: 'text',
  });
  // Backend returns raw text/plain — return it directly
  return { report_text: response.data };
}
