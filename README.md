# Intelligent Investor Backend

NestJS REST API for salary bucket calculations, 15-year investment projections,
and persisted financial profiles.

## API

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/calculations` | Calculate buckets and the wealth projection |
| `POST` | `/profiles` | Save a profile and spending plan |
| `GET` | `/profiles` | List saved profiles |
| `GET` | `/profiles/:id` | Reload one profile |
| `PATCH` | `/profiles/:id` | Update a profile and create a new plan |
| `DELETE` | `/profiles/:id` | Delete a profile and its plans |
| `GET` | `/health` | Verify API and PostgreSQL readiness |

## Environment

Copy `.env.example` to `.env`. All configuration is environment-based:

| Variable | Purpose | Default/example |
| --- | --- | --- |
| `PORT` | API listen port | `4000` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:3000` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | PostgreSQL database name | `intelligent_investor` |
| `DB_USER` | PostgreSQL username | `investor` |
| `DB_PASSWORD` | PostgreSQL password | `investor_password` |
| `DB_SSL` | Set to `true` only when PostgreSQL requires TLS | `false` |
| `DB_SYNCHRONIZE` | Auto-create/update schema for local assignment setup | `true` locally, disable for real production |

The backend CI/CD workflow also requires these GitHub repository secrets:

| Secret | Purpose |
| --- | --- |
| `QUAY_USERNAME` | Quay registry username |
| `QUAY_PASSWORD` | Quay registry password/token |
| `OPENSHIFT_TOKEN` | OpenShift login token |
| `OPENSHIFT_SERVER` | OpenShift API server URL |
| `OPENSHIFT_NAMESPACE` | Target OpenShift namespace/project |
| `PREP_API_URL` | Prep/stage backend base URL used for `/health` verification |
| `PROD_API_URL` | Production backend base URL used for `/health` verification |

OpenShift also needs these application secrets:

| Secret name | Keys |
| --- | --- |
| `postgres-secret` | `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `DB_SYNCHRONIZE` |
| `backend-env-prep` | `FRONTEND_URL` |
| `backend-env-prod` | `FRONTEND_URL` |

PostgreSQL is deployed with separate manifests per environment:

| Environment | DB manifest | Service name | PVC name |
| --- | --- | --- | --- |
| Prep/stage | `k8s/postgres-prep.yaml` | `postgres-prep` | `postgres-prep-pvc` |
| Production | `k8s/postgres-prod.yaml` | `postgres-prod` | `postgres-prod-pvc` |

## Development

```bash
npm install
npm run start:dev
```

```bash
npm test
npm run test:e2e
npm run build
```

For the complete local development/testing frontend/API/database stack, run
`.\scripts\dev.ps1` or `bash scripts/dev.sh` from the parent project directory.
Prep/stage and production use the Kubernetes/OpenShift manifests in `k8s/`
through CI/CD, not Docker Compose.

## Data Model

`financial_profiles` stores a user's name and salary figures.
`spending_plans` stores every calculated plan and references its profile with a
cascading foreign key. PostgreSQL stores the 15 projection points as JSONB.
