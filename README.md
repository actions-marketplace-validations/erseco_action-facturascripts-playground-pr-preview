# action-facturascripts-playground-pr-preview

A GitHub Action that automatically posts or updates a sticky pull request comment with a [FacturaScripts Playground](https://erseco.github.io/facturascripts-playground/) preview link for plugins, extensions, or any project distributed as a ZIP.

## Quick Start

```yaml
- name: Add FacturaScripts Playground preview
  uses: erseco/action-facturascripts-playground-pr-preview@main
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    zip-url: https://github.com/${{ github.repository }}/archive/refs/heads/${{ github.head_ref }}.zip
```

You can also optionally extend the generated Playground blueprint with extra plugins, seed data, landing page, debug mode, site options, login credentials, or a final `blueprint-json` override.

## Documentation

See [`.github/actions/facturascripts-playground-pr-preview/README.md`](.github/actions/facturascripts-playground-pr-preview/README.md) for full usage documentation, inputs, outputs, and examples.
