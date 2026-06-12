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

- `PORT`: API port, default `4000`
- `FRONTEND_URL`: allowed CORS origin
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`: PostgreSQL
- `DB_SSL`: set `true` for hosted databases requiring TLS
- `DB_SYNCHRONIZE`: schema synchronization; use only for this assignment/local setup

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

For the complete frontend/API/database stack, run `docker compose up --build`
from the parent project directory.

## Data Model

`financial_profiles` stores a user's name and salary figures.
`spending_plans` stores every calculated plan and references its profile with a
cascading foreign key. PostgreSQL stores the 15 projection points as JSONB.
