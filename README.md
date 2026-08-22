# ConnectCG frontend

## Production deployment

Run the interactive deployment menu from the frontend repository:

```bash
chmod +x deploy.sh
./deploy.sh
```

The menu supports two independent targets:

- **VPS Docker:** pulls `ghcr.io/khanhnkq/connectcg-frontend` and injects backend/OAuth URLs when the container starts. The same immutable image works on a shared VPS or a separate frontend VPS.
- **Vercel:** links the project, uploads the four production `VITE_*` variables, and runs a production deployment through the Vercel CLI.

GitHub Actions publishes `latest`, `sha-<commit>`, and `v*` image tags. Prefer a `sha-*` tag for production so rollback is deterministic.

For a VPS, expose the Nginx container through a host reverse proxy:

```caddyfile
app.example.com {
    reverse_proxy 127.0.0.1:3000
}
```

The generated browser configuration contains public endpoints only. Do not add secrets to any `VITE_*` variable because both Docker and Vercel deliver them to the browser.

When frontend and backend use different root domains, the backend cookie must use `Secure=true` and `SameSite=None`. When using subdomains of the same root domain, `SameSite=Lax` is preferred.

See [Vercel CLI deployment](https://vercel.com/docs/projects/deploy-from-cli) and [Vercel environment variables](https://vercel.com/docs/cli/env).
