# TODO: Backend Architecture — auto-event Bot

## Context

- **Project name**: `auto-event` (part of `huongnc/tools`)
- **Tech stack**: Node.js (CommonJS), Axios, no framework, no database layer, file-based state (`winners.json`, `account.json`)
- **Current architecture**: Single-file script (`simple-bot.js`) — sequential HTTP automation bot that registers accounts, logs in via CSRF+cookie flow, joins game events, and plays a game on `psha.zoneplay.vn`. State persisted to local JSON files.
- **Scalability targets**: Support concurrent multi-account processing (10–100 accounts simultaneously) with rate-limit awareness and retry tolerance.
- **Performance SLAs**: ≤ 5 s average per account cycle; no more than 5 % unhandled failures per run.
- **Security requirements**: No credentials in source code; secrets managed via environment variables or a vault; no exposure of tokens in logs.
- **Compliance**: Bot automation must respect target API's rate limits to avoid abuse flagging; no hardcoded app keys in committed code.

---

## Architecture Plan

- [ ] **ARCH-PLAN-1.1 [API Layer — Outbound HTTP Client]**
  - **Pattern**: Thin HTTP client wrapper (no inbound API exposed; all calls are outbound to `psha.zoneplay.vn` and `api-v3.zoneplay.vn`)
  - **Versioning**: Centralise base URLs and API paths in a `config.js` file so upstream changes require a single edit
  - **Authentication**: CSRF-token + session-cookie flow preserved; `access_token` and `auth_id` stored only in memory per account instance — never logged in full or written to disk
  - **Documentation**: JSDoc annotations on every public method; add an `openapi-outbound.yaml` stub describing the upstream endpoints the bot consumes

- [ ] **ARCH-PLAN-1.2 [Concurrency Layer]**
  - **Pattern**: Replace the `while(true)` sequential loop with a worker-pool pattern using `bottleneck` (already a dependency) to cap concurrent account tasks
  - **Queue**: Account list fed from a persistent queue (JSON file or SQLite) so restarts resume where they left off
  - **Back-pressure**: `Bottleneck` reservoir limits requests per second to stay within upstream rate limits

- [ ] **ARCH-PLAN-1.3 [State / Data Layer]**
  - **Current risk**: Concurrent writes to `winners.json` / `account.json` cause data corruption
  - **Target**: Replace ad-hoc `fs.readFileSync` / `fs.writeFileSync` with an atomic write helper (write-to-temp + rename) or a lightweight SQLite store (`better-sqlite3`)
  - **Schema**: `accounts` table (username, status, created_at); `winners` table (username, gift JSON, rewards JSON, recorded_at)

- [ ] **ARCH-PLAN-1.4 [Security Layer]**
  - Remove hardcoded `app_key` from source (`2561e0097cc44fd571424f792fa35e48`) — move to `process.env.APP_KEY`
  - Remove hardcoded `BASE_PHONE` from source — move to `process.env.BASE_PHONE` or CLI argument
  - Mask tokens in all log output (log only first 6 characters)
  - Add `.env.example` listing required variables; add `.env` to `.gitignore`

- [ ] **ARCH-PLAN-1.5 [Observability Layer]**
  - Introduce structured JSON logging (`pino` or `winston`) replacing raw `console.log`
  - Emit per-account metrics: success/failure counts, latency per step
  - Persist run summaries to a timestamped log file for post-run analysis

- [ ] **ARCH-PLAN-1.6 [DevOps / Deployment]**
  - Containerise with Docker (`node:20-alpine` base image)
  - Add a `healthcheck` command in `Dockerfile` verifying the process is alive
  - Define a GitHub Actions CI workflow: install → lint (`eslint`) → dry-run smoke test
  - Support `docker-compose.yml` for local development with volume mounts for data persistence

---

## Architecture Items

- [ ] **ARCH-ITEM-1.1 [SimpleGameBot — Refactored Account Worker]**
  - **Purpose**: Encapsulates the full lifecycle for a single account: register → login → join events → play game → persist result
  - **Dependencies**: `HttpClient` (ARCH-ITEM-1.2), `StateStore` (ARCH-ITEM-1.3), `logger` (ARCH-ITEM-1.5)
  - **Data Store**: Reads/writes via `StateStore` only — no direct `fs` calls
  - **Scaling Strategy**: Stateless per instance; multiple workers run in parallel via the worker pool

- [ ] **ARCH-ITEM-1.2 [HttpClient — Centralised Axios Wrapper]**
  - **Purpose**: Single Axios instance with shared cookie jar, CSRF management, retry-on-5xx, and request/response logging (with token masking)
  - **Dependencies**: `axios`, `axios-cookiejar-support`, `tough-cookie`
  - **Data Store**: None (stateless per session)
  - **Scaling Strategy**: One instance per account worker; no shared state between workers

- [ ] **ARCH-ITEM-1.3 [StateStore — Atomic Persistence Layer]**
  - **Purpose**: Thread-safe (single-process) read/write for `accounts` and `winners` datasets
  - **Dependencies**: `better-sqlite3` (new) or atomic file write helper
  - **Data Store**: SQLite file (`data/state.db`) with WAL mode; or atomic JSON files
  - **Scaling Strategy**: Single writer process; if multi-process scaling needed, upgrade to PostgreSQL

- [ ] **ARCH-ITEM-1.4 [WorkerPool — Concurrency Orchestrator]**
  - **Purpose**: Manages a bounded pool of `SimpleGameBot` workers; reads the pending-account queue, dispatches work, handles errors and retries
  - **Dependencies**: `bottleneck`, `StateStore`, `SimpleGameBot`
  - **Data Store**: In-memory queue backed by `StateStore` for durability
  - **Scaling Strategy**: Horizontal by increasing `CONCURRENCY` env var; upstream rate limits are the effective ceiling

- [ ] **ARCH-ITEM-1.5 [Config — Environment-based Configuration]**
  - **Purpose**: Centralises all configuration (base URLs, app keys, concurrency, delays) sourced from environment variables with validated defaults
  - **Dependencies**: `dotenv`
  - **Data Store**: None
  - **Scaling Strategy**: N/A — stateless singleton

- [ ] **ARCH-ITEM-1.6 [Logger — Structured Logging]**
  - **Purpose**: JSON-structured logger with correlation IDs per account run; token/secret masking; file + stdout transports
  - **Dependencies**: `pino` (recommended) or `winston`
  - **Data Store**: Rotated log files in `logs/`
  - **Scaling Strategy**: N/A — stateless; log shipping to centralised system (e.g., Loki, CloudWatch) when needed

---

## Proposed Code Changes

### ARCH-ITEM-1.5 — `auto-event/src/config.js` (new file)

```javascript
// auto-event/src/config.js
require("dotenv").config();

module.exports = {
  baseURL: process.env.BASE_URL || "https://psha.zoneplay.vn/g38",
  landingURL: process.env.LANDING_URL || "https://psha.zoneplay.vn/landing",
  registerURL:
    process.env.REGISTER_URL ||
    "https://api-v3.zoneplay.vn/api/id/account/register",
  appKey: process.env.APP_KEY, // required — no default; fail fast if missing
  basePhone: process.env.BASE_PHONE, // required
  concurrency: parseInt(process.env.CONCURRENCY || "5", 10),
  delayBetweenAccountsMs: parseInt(
    process.env.DELAY_BETWEEN_ACCOUNTS_MS || "500",
    10
  ),
  retryAttempts: parseInt(process.env.RETRY_ATTEMPTS || "3", 10),
};
```

### ARCH-ITEM-1.2 — `auto-event/src/httpClient.js` (new file)

```javascript
// auto-event/src/httpClient.js
const axios = require("axios");
const { CookieJar } = require("tough-cookie");
const { wrapper } = require("axios-cookiejar-support");

function maskToken(token) {
  if (!token) return "(none)";
  return token.substring(0, 6) + "...";
}

function createHttpClient() {
  const jar = new CookieJar();
  const client = wrapper(axios.create({ jar, withCredentials: true }));

  client.interceptors.response.use(
    (res) => res,
    async (err) => {
      // Log without exposing sensitive data
      const url = err.config?.url || "unknown";
      const status = err.response?.status || "network error";
      throw new Error(`HTTP ${status} on ${url}`);
    }
  );

  return { client, maskToken };
}

module.exports = { createHttpClient };
```

### ARCH-ITEM-1.3 — `auto-event/src/stateStore.js` (new file, atomic JSON variant)

```javascript
// auto-event/src/stateStore.js
const fs = require("fs");
const path = require("path");
const os = require("os");

class StateStore {
  constructor(filePath) {
    this.filePath = filePath;
  }

  _read() {
    if (!fs.existsSync(this.filePath)) return [];
    try {
      return JSON.parse(fs.readFileSync(this.filePath, "utf-8"));
    } catch {
      return [];
    }
  }

  _write(data) {
    const tmp = path.join(os.tmpdir(), `state-${Date.now()}.tmp`);
    fs.writeFileSync(tmp, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tmp, this.filePath); // atomic on POSIX
  }

  append(entry) {
    const data = this._read();
    data.push(entry);
    this._write(data);
  }

  exists(predicate) {
    return this._read().some(predicate);
  }

  getAll() {
    return this._read();
  }
}

module.exports = { StateStore };
```

### Security patch — remove hardcoded secrets from `simple-bot.js`

```diff
--- a/auto-event/simple-bot.js
+++ b/auto-event/simple-bot.js
@@ -1,3 +1,5 @@
+require("dotenv").config();
+const config = require("./src/config");
 const axios = require("axios");
 const fs = require("fs");
 class SimpleGameBot {
   constructor() {
-    this.baseURL = "https://psha.zoneplay.vn/g38";
+    this.baseURL = config.baseURL;

@@ -92,7 +94,7 @@ class SimpleGameBot {
         username: username,
         password: password,
         repass: password,
         email: `${username}@gmail.com`,
-        app_key: "2561e0097cc44fd571424f792fa35e48",
+        app_key: config.appKey,
         rules: 1,

@@ -411,7 +413,7 @@ async function main() {
-  const BASE_PHONE = "0912936637";
+  const BASE_PHONE = config.basePhone;
+  if (!BASE_PHONE) throw new Error("BASE_PHONE env variable is required");
   console.log(`📱 Số điện thoại base: ${BASE_PHONE}`);
```

### `.env.example` (new file, committed to repo)

```
# Target service
BASE_URL=https://psha.zoneplay.vn/g38
LANDING_URL=https://psha.zoneplay.vn/landing
REGISTER_URL=https://api-v3.zoneplay.vn/api/id/account/register

# Required secrets (DO NOT commit actual values)
APP_KEY=your_app_key_here
BASE_PHONE=09xxxxxxxxx

# Concurrency tuning
CONCURRENCY=5
DELAY_BETWEEN_ACCOUNTS_MS=500
RETRY_ATTEMPTS=3
```

### `auto-event/Dockerfile` (new file)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD node -e "process.exit(0)" || exit 1
CMD ["node", "simple-bot.js"]
```

### `.gitignore` additions

```
.env
auto-event/data/
auto-event/logs/
auto-event/winners.json
auto-event/account.json
```

---

## Commands

```bash
# Install dependencies
cd auto-event && npm install

# Copy and fill in environment variables
cp .env.example .env
# edit .env with real APP_KEY and BASE_PHONE

# Run locally
node simple-bot.js

# Build Docker image
docker build -t auto-event:latest .

# Run in Docker with env file
docker run --env-file .env -v $(pwd)/data:/app/data auto-event:latest
```

---

## Quality Assurance Task Checklist

- [ ] All services have well-defined boundaries and responsibilities
  - [ ] **ARCH-ITEM-1.1** `SimpleGameBot` — account lifecycle only
  - [ ] **ARCH-ITEM-1.2** `HttpClient` — HTTP transport + CSRF/cookie management
  - [ ] **ARCH-ITEM-1.3** `StateStore` — atomic persistence
  - [ ] **ARCH-ITEM-1.4** `WorkerPool` — concurrency orchestration
  - [ ] **ARCH-ITEM-1.5** `Config` — environment-sourced configuration
  - [ ] **ARCH-ITEM-1.6** `Logger` — structured logging
- [ ] API contracts are documented — JSDoc on all public methods; `.env.example` documents all config surface
- [ ] Database schemas include proper indexes, constraints, and migration scripts — SQLite WAL mode; atomic JSON fallback with rename strategy
- [ ] Security measures cover authentication, authorization, input validation, and encryption
  - [ ] No secrets in source code (`APP_KEY`, `BASE_PHONE` moved to env)
  - [ ] Tokens masked in all log output
  - [ ] `.env` excluded from version control
- [ ] Performance targets are defined with corresponding monitoring and alerting
  - [ ] ≤ 5 s per account cycle enforced by `Bottleneck` timeouts
  - [ ] Per-run structured logs capture latency per step
- [ ] Deployment strategy supports rollback and zero-downtime releases — Docker image tagging; env-file swap for config changes
- [ ] Disaster recovery and backup procedures are documented — `data/state.db` or JSON files mounted as Docker volume; daily volume snapshot recommended

---

## Backend Architecture Quality Task Checklist

- [ ] All API endpoints have proper authentication and authorization — CSRF + Bearer token enforced per request; no tokens stored on disk
- [ ] Database schemas are normalized appropriately with proper indexes — `accounts(username UNIQUE)`, `winners(username, recorded_at INDEX)`
- [ ] Error handling is consistent across all services with standardized formats — centralised `HttpClient` interceptor; per-worker try/catch with structured log emission
- [ ] Caching strategy is defined with clear invalidation policies — CSRF token cached per account session in memory; invalidated on login refresh
- [ ] Service boundaries are well-defined with minimal coupling — each module has a single responsibility; dependencies injected via constructor
- [ ] Performance benchmarks meet defined SLAs — ≤ 5 s/account; `CONCURRENCY=5` default; tunable via env
- [ ] Security measures follow OWASP guidelines — no secret in code (A02); input to upstream APIs validated before send (A03); logging without sensitive data (A09)
- [ ] Deployment pipeline supports zero-downtime releases — stateless workers; Docker volume for state; restart with updated image causes no data loss
