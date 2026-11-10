# Guía de trabajo

Aunque el proyecto lo desarrolla una sola persona, se trabaja como en un equipo: ramas por tarjeta, pull requests, commits legibles y documentación al día.

## Flujo de trabajo

1. Toma una tarjeta del tablero y muévela a **En progreso** (máximo 2 a la vez).
2. Crea una rama desde `main` con el formato `<tipo>/<id-tarjeta>-<resumen>`:
   - `feat/f1-09-login-refresh`
   - `infra/f1-02-ci-github-actions`
   - `docs/f1-07-adr-monolito-modular`
3. Trabaja en commits pequeños siguiendo la convención de abajo.
4. Abre un pull request hacia `main`. En la descripción incluye `Closes #<número>` para cerrar el issue al fusionar. Se usa la plantilla de `.github/pull_request_template.md`.
5. Revisa tu propio código en el diff antes de fusionar.
6. Fusiona con **squash merge** y deja un título de commit que siga la convención.

## Commits convencionales

Se sigue la especificación [Conventional Commits 1.0](https://www.conventionalcommits.org/es/v1.0.0/).

```text
<tipo>(<ámbito>): <descripción>

[cuerpo opcional]

[pie opcional]
```

### Tipos

| Tipo       | Cuándo usarlo                                                    |
| ---------- | ---------------------------------------------------------------- |
| `feat`     | Nueva funcionalidad                                              |
| `fix`      | Corrección de un error                                           |
| `docs`     | Solo documentación                                               |
| `style`    | Formato que no cambia el comportamiento (espacios, comas)        |
| `refactor` | Cambio de código que no corrige un error ni agrega funcionalidad |
| `perf`     | Mejora de rendimiento                                            |
| `test`     | Agregar o corregir pruebas                                       |
| `build`    | Cambios en compilación o dependencias                            |
| `ci`       | Cambios en la integración continua                               |
| `chore`    | Tareas de mantenimiento que no encajan en las demás              |
| `revert`   | Revertir un commit anterior                                      |

### Ámbitos

El ámbito indica la parte del proyecto afectada. Es opcional, pero recomendable.

- **Módulos:** `identity`, `tickets`, `audit`, `assignment`, `sla`, `automation`, `knowledge`, `notifications`, `reporting`.
- **Transversales:** `config`, `docker`, `db`, `deps`, `lint`, `docs`.

### Reglas de redacción

- Descripción en español, en infinitivo, en minúscula y sin punto final.
- Máximo 72 caracteres en la primera línea.
- El cuerpo explica el **porqué** del cambio, no el cómo.
- Los cambios que rompen compatibilidad llevan `!` tras el ámbito y un pie `BREAKING CHANGE:`.
- Referencia la tarjeta en el pie con `Refs #<número>` (o `Closes #<número>` en el último commit).

### Ejemplos

```text
feat(identity): agregar login con refresh token rotativo

Cada refresh invalida el token anterior. Reutilizar uno ya usado
revoca la sesión completa.

Refs #9
```

```text
fix(tickets): corregir número duplicado bajo creación concurrente
```

```text
docs(identity): documentar el flujo de recuperación de contraseña
```

```text
refactor(sla)!: cambiar la firma del calculador de vencimientos

BREAKING CHANGE: el calendario ahora se recibe como parámetro obligatorio.
```

## Calidad del código

Antes de abrir un pull request, ejecuta:

```bash
pnpm lint
pnpm format
pnpm build
pnpm test
```

El lint incluye una regla que impide importar NestJS, el ORM, Redis o colas desde `domain/`. Si falla, el dominio está dependiendo de la infraestructura: revisa [`docs/architecture.md`](docs/architecture.md).

## Definición de hecho

Una tarjeta está terminada cuando:

- [ ] Cumple todos sus criterios de aceptación.
- [ ] Las pruebas pasan y el código compila.
- [ ] `lint` y `format` no reportan problemas.
- [ ] La documentación afectada está actualizada (ver abajo).
- [ ] Si hubo una decisión de diseño importante, está registrada en un ADR.
- [ ] El pull request está fusionado y el issue cerrado.

## Documentación por tarjeta

La documentación se construye al ritmo del proyecto, nunca al final:

- Cada tarjeta actualiza **solo** lo que su alcance cambia. No se documenta lo que aún no existe.
- Si la tarjeta cambia cómo se ejecuta o configura el proyecto, se actualiza el `README.md`.
- Si cambia la estructura, las reglas o los módulos, se actualiza `docs/architecture.md`.
- Todo documento nuevo se agrega al índice de [`docs/README.md`](docs/README.md).
- Las casillas de fase del `README.md` se marcan únicamente al cerrar la tarjeta de cierre de esa fase.
