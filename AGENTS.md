# AGENTS.md Inicial - MVP So de Umidade do Solo

## Resumo
- Este documento define a fase inicial do projeto com foco exclusivo em umidade do solo.
- Objetivo imediato: adiantar dashboard e integracao de dados antes da chegada total do hardware.
- Stack de referencia desta fase: Next.js (full-stack) + Postgres.

## Escopo Atual (v1)
- Coletar, publicar, armazenar e visualizar somente leitura de umidade do solo.
- Receber telemetria via API Route HTTP.
- Exibir historico e estado de umidade no dashboard.
- Aplicar classificacao por thresholds configuraveis (seco, ideal, umido).

## Fora de Escopo (v1)
- `solar_active`
- `battery_pct`
- `rssi`

Esses campos ficam planejados para fase posterior e nao devem fazer parte do payload oficial v1.

## Contrato de Telemetria (Payload v1)
Formato JSON oficial:

```json
{
  "device_id": "horta-01",
  "timestamp": "2026-04-25T12:00:00Z",
  "soil_moisture_pct": 68
}
```

Regras:
- `device_id`: string obrigatoria que identifica o dispositivo.
- `timestamp`: data/hora em ISO 8601 UTC, obrigatoria.
- `soil_moisture_pct`: numero obrigatorio no intervalo de 0 a 100.

## Ingestao HTTP (v1)
- Endpoint de publicacao: `POST /api/readings`
- Content-Type: `application/json`
- Contrato de payload: o JSON v1 definido neste documento.

## Fluxo Funcional Alvo
`ESP32/script -> Next.js API Routes -> Postgres -> dashboard Next.js`

## Politica de Simulacao (antes do hardware completo)
- Script/simulador deve enviar leitura a cada 5 minutos.
- Finalidade: acelerar validacao de grafico, historico e alertas.
- Quando o hardware chegar, manter o mesmo contrato v1 e substituir somente a origem real dos dados.

## Regras de Alerta (configuraveis)
Variaveis:
- `SOIL_DRY_THRESHOLD` (default `35`)
- `SOIL_WET_THRESHOLD` (default `75`)

Classificacao:
- seco: `soil_moisture_pct < SOIL_DRY_THRESHOLD`
- ideal: `SOIL_DRY_THRESHOLD <= soil_moisture_pct <= SOIL_WET_THRESHOLD`
- umido: `soil_moisture_pct > SOIL_WET_THRESHOLD`

## Criterios de Sucesso da Fase
- Dados de umidade chegam via API Route no contrato v1.
- Dados sao persistidos e exibidos no dashboard em historico.
- Estado do solo e alertas respeitam thresholds configuraveis.

## Backlog Futuro (apos v1)
- Incluir energia/telemetria adicional: `solar_active`, `battery_pct`, `rssi`.
- Evoluir payload e UI sem quebrar compatibilidade com o contrato v1 atual.

## Checklist de Validacao deste Documento
- Escopo MVP de solo definido e campos fora de escopo explicitados.
- Payload v1 contem apenas `device_id`, `timestamp`, `soil_moisture_pct`.
- Endpoint HTTP de ingestao definido.
- Politica de simulacao de 5 minutos definida.
- Thresholds configuraveis com defaults 35/75 definidos.
- Secao curta de Conventional Commits incluida.

## Conventional Commits (regras curtas)
Formato recomendado:
- `<type>(scope): <descricao>`
- ou `<type>: <descricao>` quando nao houver escopo.

Tipos principais:
- `feat`: nova funcionalidade
- `fix`: correcao de bug
- outros permitidos: `docs`, `chore`, `refactor`, `test`, `ci`, `build`, `perf`

Breaking changes:
- usar `!` no cabecalho (ex.: `feat(api)!: altera payload`), ou
- usar footer `BREAKING CHANGE: <descricao>`.

Exemplos:
- `feat(api): adicionar ingestao de leitura de umidade`
- `fix(dashboard): corrigir classificacao de solo seco`
- `docs(agents): documentar escopo do mvp de solo`
