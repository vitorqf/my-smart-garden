# Smart Garden - Next.js Full-Stack (MVP Solo)

Implementacao atual focada em umidade do solo, sem backend separado.

Campos do contrato v1:
- `device_id`
- `timestamp`
- `soil_moisture_pct`

Fora de escopo nesta fase:
- `solar_active`
- `battery_pct`
- `rssi`

## Arquitetura
`ESP32/script -> Next.js API Routes -> Postgres -> Dashboard Next.js`

## Estrutura relevante
- `front/`: app Next.js (UI + API Routes + acesso ao banco)
- `docker-compose.yml`: Postgres local para desenvolvimento

## Requisitos
- Node.js 20+
- Docker + Docker Compose

## 1) Subir Postgres
```bash
docker compose up -d
```

## 2) Rodar o front full-stack
```bash
cd front
cp .env.example .env
npm install
npm run dev
```

App:
- `http://localhost:3000`

## 3) (Opcional) Rodar simulador de leituras
```bash
cd simulator
cp .env.example .env
npm install
npm start
```

O simulador envia `POST /api/readings` a cada 5 minutos por padrao.

## API Routes (no proprio front)
- `GET /api/health`
- `POST /api/readings`
- `GET /api/readings/latest?device_id=horta-01`
- `GET /api/readings/history?device_id=horta-01&limit=96`
- `GET /api/readings?device_id=horta-01&limit=96` (latest + history no mesmo payload)

### Exemplo de envio de leitura
```bash
curl -X POST http://localhost:3000/api/readings ^
  -H "Content-Type: application/json" ^
  -d "{\"device_id\":\"horta-01\",\"timestamp\":\"2026-04-25T15:00:00Z\",\"soil_moisture_pct\":64.2}"
```

## Variaveis de ambiente
No `front/.env`:
- `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/garden`
- `DEFAULT_DEVICE_ID=horta-01`
- `SOIL_DRY_THRESHOLD=35`
- `SOIL_WET_THRESHOLD=75`
- `MAX_HISTORY_POINTS=288`
- `NEXT_PUBLIC_DEVICE_ID=horta-01`
- `NEXT_PUBLIC_REFRESH_MS=30000`

Estados:
- `dry` quando `< SOIL_DRY_THRESHOLD`
- `ideal` quando `>= dry` e `<= wet`
- `wet` quando `> SOIL_WET_THRESHOLD`
