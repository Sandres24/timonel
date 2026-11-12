[![CI](https://github.com/Sandres24/timonel/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Sandres24/timonel/actions/workflows/ci.yml)

# Timonel

> Mesa de ayuda con SLA en horas hábiles, asignación automática y reglas configurables. API REST con NestJS construida como monolito modular.

**Estado:** en desarrollo.

## Contexto

Timonel es un proyecto de portafolio que resuelve un caso de estudio ficticio: una empresa de internet por fibra óptica cuyo equipo de soporte recibe solicitudes por varios canales y las gestiona en hojas de Excel, sin medir los plazos que promete a sus clientes ni tener trazabilidad.

El sistema centraliza las solicitudes como **tickets**, calcula un **SLA** por prioridad, reparte el trabajo de forma automática y permite cambiar reglas de negocio sin desplegar código nuevo. Atiende a **una sola organización**.

## Avance por fase

- [ ] **Fase 1:** base del proyecto, identidad, roles (RBAC) y auditoría
- [ ] **Fase 2:** tickets, comentarios, adjuntos, historial y máquina de estados
- [ ] **Fase 3:** equipos, agentes y estrategias de asignación
- [ ] **Fase 4:** SLA con calendarios, pausas, alertas y escalamiento
- [ ] **Fase 5:** motor de automatizaciones, eventos de dominio y campos personalizados
- [ ] **Fase 6:** base de conocimiento, notificaciones y webhooks
- [ ] **Fase 7:** encuestas, reportes, pruebas de carga y despliegue

## Estructura del proyecto

Monolito modular: un módulo por dominio, y cada módulo organizado en cuatro capas.

```text
src/
├── app.module.ts
├── main.ts
└── modules/
    ├── identity/
    │   ├── domain/
    │   ├── application/
    │   ├── infrastructure/
    │   ├── presentation/
    │   ├── identity.module.ts
    │   └── index.ts
    ├── tickets/            (misma estructura)
    └── audit/              (misma estructura)
```

Los demás módulos se crean cuando llega su fase.

| Capa              | Contiene                                                                     |
| ----------------- | ---------------------------------------------------------------------------- |
| `domain/`         | Reglas de negocio puras, sin dependencias de framework ni de infraestructura |
| `application/`    | Casos de uso y puertos (interfaces)                                          |
| `infrastructure/` | Adaptadores: base de datos, colas, correo                                    |
| `presentation/`   | Controladores, DTOs, guards                                                  |

## Reglas de arquitectura

Resumen. El detalle completo está en [`docs/architecture.md`](docs/architecture.md).

- **Entre capas:** `presentation` depende de `application`, `application` depende de `domain`, e `infrastructure` implementa los puertos definidos en `application`. El dominio no depende de nadie.
- **El dominio no importa NestJS, el ORM, Redis ni colas.** Una regla del linter (Oxlint) lo vigila.
- **Entre módulos:** un módulo no lee las tablas de otro ni importa sus archivos internos. Solo usa lo que el otro expone en su `index.ts`.

## Requisitos y puesta en marcha

**Requisitos:** Node.js <!-- COMPLETAR: versión --> y pnpm.

```bash
git clone https://github.com/<usuario>/timonel.git
cd timonel
pnpm install
pnpm start:dev
```

### Scripts disponibles

| Script           | Qué hace                                            |
| ---------------- | --------------------------------------------------- |
| `pnpm start:dev` | Inicia la aplicación en modo desarrollo con recarga |
| `pnpm build`     | Compila el proyecto                                 |
| `pnpm lint`      | Revisa el código con Oxlint                         |
| `pnpm format`    | Da formato al código con Prettier                   |
| `pnpm test`      | Ejecuta las pruebas unitarias                       |

> La base de datos y los demás servicios se incorporan en fases posteriores. Cuando existan, esta sección se amplía.

## Convenciones de trabajo

Commits convencionales, ramas por tarjeta y definición de hecho: consulta [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Documentación

El índice de la documentación está en [`docs/README.md`](docs/README.md). Se va ampliando a medida que avanza cada tarjeta del proyecto.
