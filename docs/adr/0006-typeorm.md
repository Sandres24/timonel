# ADR-0006: TypeORM como ORM y herramienta de migraciones

- **Estado:** aceptada
- **Fecha:** 12 de noviembre de 2026
- **Tarjeta:** F1-04

## Contexto

Timonel usa PostgreSQL con migraciones versionadas, búsqueda de texto completo y JSONB para los campos personalizados. La arquitectura separa el dominio de la infraestructura: el dominio no importa NestJS ni el ORM, y una regla del linter lo vigila.

El acceso a datos debe quedar detrás de repositorios definidos como puertos en `application/`. Esto sirve para probar el dominio sin base de datos y mantener separadas las reglas de negocio de la persistencia.

Hay requisitos que el ORM debe permitir resolver:

- Control de concurrencia optimista por versión en los tickets (RF-15).
- Toma de tickets sin que dos agentes la logren a la vez (RF-28).
- Transacciones explícitas, por ejemplo para fusionar tickets (RF-13).
- Consultas con índices justificados sobre 500.000 tickets (sección 8).

## Decisión

Se usa **TypeORM** con `@nestjs/typeorm` 12.0.3

- Las entidades de TypeORM son **clases de persistencia** y viven en `infrastructure/` de cada módulo. Los repositorios las mapean hacia y desde las entidades de dominio, que no llevan decoradores del ORM.
- `synchronize` queda **desactivado** en todos los entornos. Todo cambio de esquema pasa por una migración versionada.
- Una misma configuración de conexión sirve a la aplicación y a la CLI de migraciones.
- Las consultas que el ORM no expresa bien (búsqueda de texto completo, operadores de JSONB) se escriben con el constructor de consultas o con SQL, siempre dentro de la capa de infraestructura.

### DataSource y migraciones

La configuración de conexión vive en `src/infrastructure/database/data-source.ts` y exporta un `DataSource` para la CLI de TypeORM, además de `databaseOptions` para `DatabaseModule`. La aplicación y la CLI usan las mismas opciones; NestJS administra la conexión de la aplicación mediante `TypeOrmModule.forRoot(databaseOptions)`.

`synchronize` permanece desactivado. Los cambios de esquema se aplican únicamente mediante migraciones versionadas.

Las migraciones y entidades viven dentro del módulo que posee las tablas:

```text
src/modules/<modulo>/infrastructure/database/entities/
src/modules/<modulo>/infrastructure/database/migrations/
```

El `DataSource` compartido descubre las entidades y migraciones de todos los módulos, pero una migración solo puede crear, modificar o eliminar tablas de su propio módulo. Esta decisión mantiene la regla de que un módulo no toca las tablas de otro.

Los comandos oficiales son:

```bash
pnpm migration:generate -- src/modules/<modulo>/infrastructure/database/migrations/<nombre>
pnpm migration:run
pnpm migration:revert
pnpm migration:show
```

Los scripts utilizan `typeorm-ts-node-esm` y el `DataSource` compilado en `dist`, por lo que generan el build antes de ejecutar la CLI. Las migraciones deben revisarse manualmente y contener un `up` y un `down` coherentes.

### Convenciones de base de datos

- Los identificadores son `uuid` y usan UUID v7, generado por la aplicación antes de persistir la entidad.
- Las fechas usan `timestamptz` y se almacenan como instantes UTC.
- Las tablas, columnas, índices, restricciones y claves foráneas usan `snake_case`.
- Las tablas con ciclo de vida persistente tienen `created_at` y `updated_at` como `timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP`.
- `created_at` es inmutable; `updated_at` se actualiza desde el adaptador de persistencia en cada modificación.

## Alternativas consideradas

| Alternativa                                         | Por qué no                                                                                                                                                                             |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Prisma**                                          | Genera sus propios tipos a partir de un esquema propio y el cliente queda más acoplado a su modelo. Esto encaja peor con entidades de dominio separadas de las de persistencia.        |
| **MikroORM**                                        | Es una opción válida con un modelo de unidad de trabajo más explícito. Tiene menos presencia en proyectos NestJS y su integración con las herramientas del proyecto es menos conocida. |
| **Constructor de consultas (Kysely) o SQL directo** | Daría control total y tipos seguros, pero exige escribir a mano el mapeo y las migraciones, con más trabajo para el alcance de un proyecto de portafolio.                              |

## Consecuencias

**Positivas**

- Integración directa con NestJS y migraciones incluidas en la misma herramienta.
- Soporte de columna de versión, bloqueos pesimistas y transacciones, que cubren RF-15, RF-28 y RF-13.
- Las entidades de dominio permanecen libres de decoradores y se prueban sin base de datos.
  **Negativas y riesgos**

- Hay que mantener el mapeo entre entidades de persistencia y de dominio, con más código que usar las entidades del ORM directamente.
- Las migraciones generadas automáticamente deben revisarse a mano antes de confirmarse.
- La búsqueda de texto completo y los operadores de JSONB requieren consultas escritas a mano, fuera de lo que cubre el ORM.
- El ORM puede ocultar consultas ineficientes. Los índices se justifican con `EXPLAIN ANALYZE` (F2-12).
  **Cuándo revisar esta decisión**

- Si el mapeo manual se vuelve una carga desproporcionada.
- Si las consultas críticas de rendimiento terminan casi todas en SQL escrito a mano.
