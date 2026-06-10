---
applyTo: '**'
---

# Serena — Reglas de búsqueda de código
SIEMPRE sigue estas reglas sin excepción al consultar código.

## Inicialización
- Antes de ejecutar CUALQUIER herramienta de búsqueda, debes haber llamado a activate_project usando como nombre la ruta raíz del proyecto. Si no lo has hecho, hazlo primero y no continúes hasta recibir confirmación de que el proyecto está activo.

## Reglas obligatorias
- NUNCA uses herramientas de búsqueda ni lectura de archivos sin antes haber activado el proyecto Serena.
- NUNCA uses read_file, herramientas del editor ni ninguna otra herramienta alternativa para leer código. SIEMPRE usa las herramientas de Serena MCP.
- SIEMPRE usa find_symbol como primera herramienta para buscar clases, funciones, tipos e interfaces.
- SIEMPRE usa find_referencing_symbols para encontrar usos de un símbolo.
- SOLO usa search_for_pattern si find_symbol no devuelve resultados.
- NUNCA concluyas que un símbolo no existe sin haber ejecutado find_symbol Y search_for_pattern.
- Si find_symbol falla, intenta variaciones del nombre: camelCase, PascalCase, sin prefijos.

## Convenciones del proyecto
- Los archivos SIEMPRE usan kebab-case (ej: user-repository.ts, auth-service.ts).
- NUNCA existen archivos con puntos en el nombre salvo la extensión.
- Al construir patrones de búsqueda, usa SIEMPRE kebab-case.