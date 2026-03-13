# FacturaScripts Playground PR Preview Action

A GitHub Action that automatically posts or updates a sticky pull request comment containing a preview link to [FacturaScripts Playground](https://erseco.github.io/facturascripts-playground/) for any plugin, extension, or project ZIP.

## Usage

```yaml
- name: Add FacturaScripts Playground preview
  uses: erseco/action-facturascripts-playground-pr-preview@main
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    zip-url: https://github.com/${{ github.repository }}/archive/refs/heads/${{ github.head_ref }}.zip
    title: My Plugin PR Preview
    description: Preview this PR in FacturaScripts Playground
```

## Inputs

| Input            | Required | Default                                                            | Description                                                                |
|------------------|----------|--------------------------------------------------------------------|----------------------------------------------------------------------------|
| `github-token`   | ✅        | —                                                                  | GitHub token with `pull-requests: write` permission                        |
| `zip-url`        | ✅        | —                                                                  | URL of the plugin/extension ZIP file to load in the playground             |
| `title`          | ❌        | `PR Preview`                                                       | Blueprint meta title                                                       |
| `description`    | ❌        | `Preview this PR in FacturaScripts Playground`                     | Blueprint meta description                                                 |
| `author`         | ❌        | `erseco`                                                           | Blueprint meta author                                                      |
| `playground-url` | ❌        | `https://erseco.github.io/facturascripts-playground/`              | Base URL of the FacturaScripts Playground                                  |
| `image-url`      | ❌        | *(playground logo)*                                                | URL of the image to display in the PR comment                              |
| `comment-marker` | ❌        | `facturascripts-playground-preview`                                | Hidden HTML marker used to identify and deduplicate the sticky PR comment  |

## Outputs

| Output        | Description                         |
|---------------|-------------------------------------|
| `preview-url` | The full playground preview URL     |

## Required Workflow Permissions

The calling workflow must grant write access to pull requests:

```yaml
permissions:
  contents: read
  pull-requests: write
```

## Example Workflow

```yaml
name: PR Preview

on:
  pull_request:
    types: [opened, synchronize, reopened, edited]

permissions:
  contents: read
  pull-requests: write

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - name: Add FacturaScripts Playground preview
        uses: erseco/action-facturascripts-playground-pr-preview@main
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          zip-url: https://github.com/${{ github.repository }}/archive/refs/heads/${{ github.head_ref }}.zip
          title: My Plugin PR Preview
          description: Preview this PR in FacturaScripts Playground
```

## How It Works

1. **Blueprint generation** — The action builds a JSON blueprint from inputs:
   ```json
   {
     "meta": {
       "title": "My Plugin PR Preview",
       "author": "erseco",
       "description": "Preview this PR in FacturaScripts Playground"
     },
     "plugins": [
       "https://github.com/OWNER/REPO/archive/refs/heads/BRANCH.zip"
     ]
   }
   ```

2. **Base64url encoding** — The blueprint JSON is encoded as [base64url](https://datatracker.ietf.org/doc/html/rfc4648#section-5) (RFC 4648 §5), which replaces `+` with `-`, `/` with `_`, and strips trailing `=`.

3. **Preview URL** — The encoded blueprint is appended as the `blueprint-data` query parameter:
   ```
   https://erseco.github.io/facturascripts-playground/?blueprint-data=ENCODED_BLUEPRINT
   ```

4. **Sticky comment** — The action searches existing PR comments for a hidden HTML marker (`<!-- facturascripts-playground-preview -->`). If found, it updates that comment; otherwise it creates a new one. This prevents duplicate comments on repeated workflow runs (`synchronize`, `edited`, etc.).

## Development

### Prerequisites

- Node.js 20+
- npm

### Install dependencies

```bash
cd .github/actions/facturascripts-playground-pr-preview
npm install
```

### Build

```bash
npm run build
```

This bundles `index.js` and its dependencies into `dist/index.js` using [esbuild](https://esbuild.github.io/).

> **Note:** Always commit the updated `dist/index.js` after making changes to `index.js`.

### Test

```bash
npm test
```
