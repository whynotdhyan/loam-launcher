## Description
<!-- Provide a brief, clear summary of what this PR introduces or fixes. -->

## Related Issues
<!-- Link related issues, e.g. Closes #123 -->

## Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Design / UI polish (following LOAM Swiss tokens and contrast rules)
- [ ] Documentation update
- [ ] Performance improvement

## Checklist
- [ ] My code adheres to LOAM's locked color palette and typography rules (`src/styles/tokens.css`).
- [ ] Contrast rules verified (never use `--loam-muted` for meaningful text).
- [ ] No unredacted secrets, credentials, or tokens are logged or exposed.
- [ ] Tested keyboard navigation (`Ctrl+Enter`, `Ctrl+K`, `Tab`, `Esc`).
- [ ] `npm run lint` passes without TypeScript errors.
- [ ] `cargo test --manifest-path src-tauri/Cargo.toml` and `cargo clippy` pass cleanly.
