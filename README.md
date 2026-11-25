# Formulario de registro — Práctica DevOps (GitHub Actions, pruebas y despliegue)

Formulario web con validación en vivo (nombre, correo, **cédula ecuatoriana**, teléfono, contraseña y términos).
Proyecto del curso Kanban–XP, con integración continua y despliegue automático.

**App desplegada:** https://cristhian-delgado.github.io/proyecto_en_aws/
**Versión desplegada:** https://cristhian-delgado.github.io/proyecto_en_aws/version.json

## Requisitos de ejecución
- Node.js 20+ y npm (para pruebas y build)
- Docker (opcional, para el entorno local reproducible)

## Comandos
```bash
npm ci              # instalar dependencias
npm test            # ejecutar pruebas (Jest)
npm run build       # genera dist/ con la app y version.json

# Entorno local reproducible
docker build -t formulario-registro .
docker run -p 8080:80 formulario-registro      # abrir http://localhost:8080
```

## Estructura
| Archivo | Función |
|---|---|
| `index.html`, `style.css` | Interfaz |
| `validaciones.js` | Lógica de validación pura (probada con Jest) |
| `script.js` | Conecta el formulario con las validaciones |
| `tests/validaciones.test.js` | Pruebas por historia de usuario |
| `build.js` | Genera `dist/` y `version.json` |
| `.github/workflows/ci.yml` | CI: instala, prueba y construye |
| `.github/workflows/deploy.yml` | Despliegue a GitHub Pages desde `main` |

## Historias de usuario y pruebas
| Historia | Criterio | Prueba |
|---|---|---|
| HU-01 Contraseña segura | Mínimo 8 caracteres con mayúscula, minúscula y número | `HU-01 Contraseña segura` |
| HU-02 Cédula ecuatoriana | 10 dígitos y dígito verificador correcto | `HU-02 Cédula ecuatoriana` |
| HU-03 Datos de contacto | Correo con formato válido, teléfono 09XXXXXXXX, nombre y apellido | `HU-03 ...` |
| HU-04 Confirmación y términos | Contraseñas iguales y términos aceptados | `HU-04 ...` |

## Estrategia de ramas (GitHub Flow)
- `main`: siempre desplegable, protegida (solo cambios por Pull Request con CI en verde y 1 aprobación).
- `feature/HU-xx-descripcion`: una rama por historia.
- `fix/descripcion`: correcciones.
- Cada PR usa la plantilla y enlaza historia, criterio y prueba.

## Despliegue y recuperación
- Cada merge a `main` ejecuta pruebas, build y publica en GitHub Pages.
- Registros: pestaña **Actions** → ejecución → paso correspondiente.
- Versiones estables: etiquetas `v1.0.0`, `v1.1.0`...
- **Volver a una versión estable:** (1) `git revert <commit>` mediante PR (se redespliega solo), o (2) Actions → *Deploy* → *Run workflow* sobre el tag estable.

## Secretos
Esta app estática no necesita secretos: el despliegue usa el token temporal de GitHub (`GITHUB_TOKEN`). Si se usara otra nube, las credenciales irían en *Settings → Secrets and variables → Actions* y se leerían como `${{ secrets.NOMBRE }}`, nunca en el código.
