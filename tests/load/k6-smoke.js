// FlowAxon v4 — k6 smoke load test (baseline).
// Profile: 25 VUs for 60s against the production public site.
// See LOADTEST-RUNBOOK.md for execution and pass criteria.

import http from 'k6/http';
import { check } from 'k6';

const TARGET = __ENV.TARGET || 'https://flowaxon.com';
const ASSET_PATH = __ENV.ASSET_PATH || '/assets/css/flowaxon.css';

export const options = {
  scenarios: {
    smoke: {
      executor: 'constant-vus',
      vus: 25,
      duration: '60s',
      tags: { testRunId: 'fxv4-baseline' },
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<800'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const res = http.get(TARGET, {
    tags: { testRunId: 'fxv4-baseline', name: 'homepage' },
  });
  check(res, {
    'homepage is 200': (r) => r.status === 200,
  });

  const assetRes = http.get(`${TARGET}${ASSET_PATH}`, {
    tags: { testRunId: 'fxv4-baseline', name: 'asset' },
  });
  check(assetRes, {
    'asset is 200': (r) => r.status === 200,
  });
}
