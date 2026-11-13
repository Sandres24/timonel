# ADR-0001: Monolito modular

- **Estado:** aceptada
- **Fecha:** 12 de noviembre de 2026
- **Tarjeta:** F1-07

## Contexto

Timonel es un sistema de mesa de ayuda para una sola organización, construido por una persona y con un alcance amplio: identidad, tickets, asignación, SLA, automatizaciones, notificaciones y reportes.

El documento de requerimientos fija dos restricciones técnicas (sección 9):

- Una arquitectura de monolito modular: un módulo por dominio, sin que un módulo lea directamente las tablas de otro.
- El dominio (SLA, estados, reglas) separado de la infraestructura, para poder probarlo sin base de datos.

## Decisión

Timonel es un **monolito modular** en NestJS: una sola aplicación desplegable, dividida en módulos por dominio, con fronteras explícitas.

### Estructura

Cada módulo vive en `src/modules/<nombre>/` y tiene cuatro capas más su archivo de módulo y su API pública:

```text
src/modules/<nombre>/
├── domain/            reglas de negocio puras
├── application/       casos de uso y puertos (interfaces)
├── infrastructure/    adaptadores: base de datos, colas, correo
├── presentation/      controladores, DTOs, guards
├── <nombre>.module.ts
└── index.ts           API pública del módulo
```

Los módulos iniciales son `identity`, `tickets` y `audit`. Los demás (`assignment`, `sla`, `automation`, `knowledge`, `notifications`, `reporting`) se crean cuando llega su fase. La estructura se crea con `nest g module modules/<nombre>` y las capas a mano; no se usa `nest g resource`, porque genera una estructura plana.

### Dependencias entre capas

| Capa             | Puede depender de                                    |
| ---------------- | ---------------------------------------------------- |
| `domain`         | Nadie. No importa NestJS, el ORM, Redis ni colas.    |
| `application`    | `domain`                                             |
| `infrastructure` | Implementa los puertos definidos en `application`    |
| `presentation`   | `application`, y tipos de `domain` (enums y errores) |

### Reglas entre módulos

1. Un módulo no lee las tablas de otro.
2. Un módulo no importa archivos internos de otro; solo usa lo que ese módulo expone en su `index.ts`.
3. Las referencias entre módulos se hacen por identificador, no por objeto ni por clave foránea hacia tablas ajenas.
4. Las dependencias van en un solo sentido. Por ejemplo, `identity` no conoce a `tickets`.

### Comunicación entre módulos

- **Consultas y comandos síncronos:** mediante la API pública del módulo (`index.ts`), que expone casos de uso o puertos, nunca entidades de persistencia.
- **Reacciones desacopladas:** mediante eventos de dominio en proceso. El módulo que origina un hecho publica el evento y los demás se suscriben sin que el emisor los conozca. Los eventos se publican después de confirmar la transacción que los originó.
- **Trabajo lento o programado:** mediante la cola de trabajos (BullMQ), nunca dentro de la petición del usuario.

### Cómo se vigilan las reglas

El linter (Oxlint) vigila automáticamente que `domain/` no importe NestJS, el ORM, Redis, colas ni otras capas, con una regla `no-restricted-imports` sobre `src/modules/*/domain/**/*.ts`. Las reglas entre módulos se revisan hoy en los pull requests (definición de hecho en `CONTRIBUTING.md`); si se incumplen con frecuencia, se agregará una regla automática.

## Alternativas consideradas

| Alternativa                                                                                   | Por qué no                                                                                                                                                                                |
| --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Microservicios**                                                                            | Añaden despliegue, red, consistencia distribuida y observabilidad para un sistema de una sola organización y un solo equipo. Es un costo sin beneficio proporcional en esta etapa.        |
| **Monolito en capas simple** (carpetas por tipo técnico: controladores, servicios, entidades) | Es más rápido de empezar, pero favorece que cualquier parte del código use cualquier otra. Mezcla las reglas de negocio con el framework y dificulta probar el dominio sin base de datos. |
| **Estructura plana de NestJS** (`nest g resource`)                                            | Genera módulos con las capas mezcladas, sin separación entre dominio e infraestructura.                                                                                                   |

## Consecuencias

**Positivas**

- El dominio se prueba sin base de datos ni framework.
- Las fronteras explícitas facilitan razonar sobre cada módulo y, si algún día hace falta, extraer uno a un servicio aparte.
- Un solo artefacto para desplegar y depurar.

**Negativas y riesgos**

- Más archivos y código de enlace que en una estructura plana, sobre todo en módulos pequeños.
- Las reglas entre módulos dependen de disciplina y de la revisión, salvo la del dominio, que vigila el linter.
- Al compartir una sola base de datos, es posible saltarse las fronteras con una consulta directa. Solo la convención lo impide.
- Los manejadores de eventos introducen consistencia eventual dentro del propio sistema; hay que diseñarlos idempotentes.

**Cuándo revisar esta decisión**

- Si las reglas entre módulos se incumplen de forma repetida.
- Si algún módulo necesita escalar o desplegarse de forma independiente.
