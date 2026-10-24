# Azure deployment

The API Web App can host both the Angular client and the API from one origin. The GitHub Actions workflow builds and tests Angular, copies its production bundle into the API's `wwwroot`, publishes the .NET API, and deploys that package to `classtrack-api-sujith`.

## Required App Service settings

Configure these in the Web App's **Environment variables** before deploying:

| Setting | Required value |
| --- | --- |
| `ConnectionStrings__DefaultConnection` or a `DefaultConnection` entry under **Connection strings** | Connection string for the intended Azure SQL database |
| `Jwt__Key` | A newly generated, private signing key containing at least 32 bytes |
| `Jwt__Issuer` | `ClassTrack.API` |
| `Jwt__Audience` | `ClassTrack.Angular` |
| `Database__ApplyMigrations` | Keep `false` in App Service; do not run schema migrations automatically during app startup |
| `BootstrapAdmin__Username` and `BootstrapAdmin__Password` | Optional one-time initial admin credentials; remove both settings after the first successful startup |

Use a fresh private signing key in App Service settings; never reuse a development key or put production keys or database credentials in source control.

Apply EF Core migrations to the confirmed target database as a separate, controlled database deployment after taking an appropriate backup. Do not run migrations during App Service startup; a database connectivity or migration failure can prevent the web app from starting.

For a new database with no login users, set both bootstrap settings to create the first `Admin` account with an ASP.NET Core password hash. The bootstrap runs only when the users table is empty. Remove the temporary settings after verifying the first login; never store bootstrap credentials in GitHub source.

If Angular is hosted separately instead of in this API Web App, set `Cors__AllowedOrigins__0` to the exact HTTPS origin of that frontend. The bundled, same-origin deployment does not need a production CORS exception.

## Database and login readiness

The checked-in database configuration targets a local SQL Server. Azure SQL must be provisioned or an existing database selected, and the App Service connection string must point to it. The migrations create the application tables but do not create a login account. Provision the first user using a secure process that stores a `PasswordHasher<User>` hash, not a plaintext password.

## Deployment checks

The GitHub Actions workflow runs Angular unit tests, builds the production frontend, and builds/publishes the API before deployment. It checks required App Service settings before deploying, then verifies the frontend, Swagger, and a database-backed invalid-login response. After deployment, also sign in with the provisioned admin and verify the dashboard plus student, teacher, attendance, and fee workflows.
