export interface HealthStatusViewModel {
    status: string;
    environment: string;
    geminiKeyBrollCount: number;
    uptimeSeconds: number;
    timestamp: string;
}

export function renderHealthStatusPage(data: HealthStatusViewModel): string {
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Backend Health</title>
  <style>
    :root { color-scheme: light dark; }
    body {
      margin: 0;
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
      background: #f8fafc;
      color: #0f172a;
      display: grid;
      place-items: center;
      min-height: 100vh;
      padding: 20px;
    }
    .card {
      width: min(560px, 100%);
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 18px 20px;
      box-shadow: 0 6px 24px rgba(15, 23, 42, 0.06);
    }
    h1 { margin: 0 0 12px; font-size: 20px; }
    .ok { color: #15803d; font-weight: 700; }
    .row { margin: 7px 0; font-size: 14px; color: #334155; }
    .label { color: #64748b; }
    code {
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 1px 6px;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <main class="card">
    <h1>Server Status: <span class="ok">${data.status}</span></h1>
    <div class="row"><span class="label">Environment:</span> ${data.environment}</div>
    <div class="row"><span class="label">B-roll API keys:</span> ${data.geminiKeyBrollCount}</div>
    <div class="row"><span class="label">Uptime:</span> ${data.uptimeSeconds}s</div>
    <div class="row"><span class="label">Updated:</span> ${data.timestamp}</div>
    <div class="row"><span class="label">Raw JSON:</span> <code>/api/health?format=json</code></div>
  </main>
</body>
</html>`;
}
