# @snowdrive/logger

Utilidad para automatizar el registro de logs mediante decoradores. Inyecta identificadores de trazabilidad (traceId), extrae parámetros y mide tiempos de ejecución de las funciones automáticamente.

[![npm latest package](https://img.shields.io/npm/v/@snowdrive/logger/latest?color=blue)](https://www.npmjs.com/package/@snowdrive/logger)

## Tabla de Contenidos
- [@snowdrive/logger](#snowdrivelogger)
  - [Tabla de Contenidos](#tabla-de-contenidos)
  - [Instalación](#instalación)
  - [Uso](#uso)
    - [Configuración Inicial](#configuración-inicial)
    - [Decorando clases y métodos](#decorando-clases-y-métodos)
    - [Trazabilidad con contexto](#trazabilidad-con-contexto)

## Instalación

```bash
npm install @snowdrive/logger
yarn add @snowdrive/logger
pnpm add @snowdrive/logger
```

## Uso

### Configuración Inicial
Configura la instancia de tu logger y establece un nivel de log mínimo base opcional para toda la aplicación. La configuración por defecto utiliza los metodos de `console` y nivel de log de `INFO`.

```typescript
import { Logger } from '@snowdrive/logger';
import { createLogger, format, transports } from 'winston'
const { combine, timestamp, printf } = format

export const winstonLogger = createLogger({
	level: 'trace',
	levels: {
		fatal: 0,
		error: 1,
		warn: 2,
		info: 3,
		debug: 4,
		trace: 5,
	},
	transports: [new transports.Console()],
	format: combine(
		timestamp(),
		printf(({ timestamp, level, message }) => {
			return `[${timestamp}] [${level.toUpperCase()}] ${message}`
		})
	),
})

Logger.config({ level: 'TRACE', logger: winstonLogger });
```

### Decorando clases y métodos
Aplica el decorador @Logger para registrar automáticamente inicio (`STARTED`), éxito (`COMPLETED`) o fallo (`FAILED`) en tus métodos, junto con su tiempo de duración.

```typescript
import { Logger } from '@snowdrive/logger';

@Logger({ severity: 'INFO' })
class TestClass {
  @Logger({ severity: 'DEBUG', params: ['key', 'value'] })
  public myMethod(data: any) {}

  public myOtherMethod() {}
}
```

### Trazabilidad con contexto
Implementa `Logger.context` utilizando un identificador unico para englobar toda la ejecución de los métodos de esa ejecución bajo el mismo `traceId`.

```typescript
import { Logger } from '@snowdrive/logger';
import crypto from 'node:crypto';
import express from 'express';

const app = express();

app.use((req, res, next) => {
  const traceId = req.headers['x-trace-id'] ?? crypto.randomUUID()
  Logger.context.run(traceId, () => {
    res.setHeader('x-trace-id', traceId);
    next();
  });
});
```
