// FlowAxon v4 — k6 zero-origin resilience test.
// Same load profile as k6-smoke.js, but pointed at the Cloudflare Pages
// edge (Pages production or preview URL) while the homelab origin is PAUSED.
// Purpose: prove the public site stays 200 purely from the CF edge, with zero
// dependency on the homelab origin.
// See LOADTEST-RUNBOOK.md for the pause-origin procedure.

import http from 'k6/http';
import { check } from 'k6';

// TARGET: Pages production or preview URL. Default = production public site.
const TARGET = __ENV.TARGET || 'https://flowaxon.com';
const ASSET_PATH = __ENV.ASSET_PATH || '/assets/css/flowaxon.css';

export const options = {
  scenarios: {
    edge_resilience: {
      executor: 'constant-vus',
      vus: 25,
      duration: '60s',
      tags: { testRunId: 'fxv4-edge-resilience' },
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<800'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const res = http.get(TARGET, {
    tags: { testRunId: 'fxv4-edge-resilience', name: 'homepage' },
  });
  check(res, {
    'homepage is 200 (edge serves without origin)': (r) => r.status === 200,
    'served by cache (cf-cache-status not BYPASS)': (r) => {
      const cfs = r.headers['Cf-Cache-Status'] || r.headers['cf-cache-status'] || '';
      return cfs !== 'BYPASS';
    },
  });

  const assetRes = http.get(`${TARGET}${ASSET_PATH}`, {
    tags: { testRunId: 'fxv4-edge-resilience', name: 'asset' },
  });
  check(assetRes, {
    'asset is 200 (edge serves without origin)': (r) => r.status === 200,
  });
}
