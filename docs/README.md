# Documentación de Timonel

Índice de la documentación. Se amplía al terminar cada tarjeta: cada una documenta solo lo que su alcance introduce.

## Documentos disponibles

| Documento                                      | Descripción                                                    | Tarjeta |
| ---------------------------------------------- | -------------------------------------------------------------- | ------- |
| [`../README.md`](../README.md)                 | Presentación del proyecto, estructura y puesta en marcha       | F1-01   |
| [`../CONTRIBUTING.md`](../CONTRIBUTING.md)     | Flujo de trabajo, commits convencionales y definición de hecho | F1-01   |
| [`architecture.md`](architecture.md)           | Módulos, capas, reglas de dependencia y regla de lint          | F1-01   |
| [`guides/new-module.md`](guides/new-module.md) | Cómo crear un módulo con las cuatro capas                      | F1-01   |
| [`guides/migrations.md`](guides/migrations.md) | Migraciones, DataSource y comandos de TypeORM | F1-04   |
| [`adr/0001-monolito-modular.md`](adr/0001-monolito-modular.md) | Decisión de arquitectura de monolito modular | F1-07   |
| [`adr/0006-typeorm.md`](adr/0006-typeorm.md) | Decisión de ORM y migraciones | F1-04   |

## Documentos previstos

Se agregarán cuando se complete la tarjeta indicada.

| Documento                                              | Tarjeta |
| ------------------------------------------------------ | ------- |
| Integración continua (sección en el README y badge)    | F1-02   |
| Entorno local y variables de entorno                   | F1-03   |
| Convención de errores, logs y documentación de la API  | F1-05   |
| Seguridad base                                         | F1-06   |
| `adr/plantilla.md`                                     | F1-07   |
| Diagrama y decisiones del modelo de datos de identidad | F1-08   |
| Autenticación: sesiones y tokens                       | F1-09   |
| Control de acceso por rol: matriz de permisos          | F1-13   |
| Auditoría: eventos registrados                         | F1-14   |

## Reglas para mantener la documentación

- Un documento nuevo se agrega a este índice en el mismo pull request que lo crea.
- Los enlaces entre documentos son relativos.
- Cuando algo cambia, se corrige el documento afectado en lugar de añadir una nota al final.
