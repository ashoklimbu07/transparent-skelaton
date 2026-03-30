export interface HealthStatusViewModel {
    status: string;
    geminiKeyBrollConfigured: boolean;
    geminiKeyBrollCount: number;
}

export function renderHealthStatusPage(data: HealthStatusViewModel): string {
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Backend Health</title>
  <style>
    body {
      margin: 0;
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
      background: #f8fafc;
      color: #0f172a;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      min-height: 100vh;
      padding: 28px 20px 20px;
    }
    .card {
      width: min(560px, 100%);
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 18px 20px;
      box-shadow: 0 6px 24px rgba(15, 23, 42, 0.06);
    }
    h1 { margin: 0 0 14px; font-size: 20px; }
    .ok { color: #15803d; font-weight: 700; }
    .row { margin: 7px 0; font-size: 14px; color: #334155; }
    .label { color: #64748b; }
  </style>
</head>
<body>
  <main class="card">
    <h1>Server Status: <span class="ok">${data.status}</span></h1>
    <div class="row"><span class="label">API key configured:</span> ${data.geminiKeyBrollConfigured ? 'Yes' : 'No'}</div>
    <div class="row"><span class="label">B-roll API keys:</span> ${data.geminiKeyBrollCount}</div>
  </main>
</body>
</html>`;
}
