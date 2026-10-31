# Security Policy

## Supported Versions

Only the latest commit on the `main` branch is actively maintained and supported with security updates (source: single-branch trunk-based release baseline).

| Version | Supported | Notes |
| :--- | :---: | :--- |
| Latest `main` | :white_check_mark: | Continuous integration and nightly automated security rescans |
| Prior commits / tags | :x: | Unsupported; please update to the latest `main` commit |

## Reporting a Vulnerability

We take the security of this project seriously. Please report all security vulnerabilities privately through GitHub Security Advisories:

- **Advisory Submission**: Submit reports via [GitHub Security Advisories](https://github.com/tamld/flowaxon/security/advisories/new).
- **Confidentiality**: Do not create public issues, discussions, or pull requests for suspected security vulnerabilities.

### Response SLA

- **Acknowledgment**: Initial receipt acknowledgment within 72 hours of submission (source: measured from submission timestamp).
- **Triage Assessment**: Initial severity rating and triage status provided within 7 business days following acknowledgment.

## Scope

### In Scope
- The production website and associated virtual hosts deployed from this repository.
- The automated CI/CD and nightly drift rescan pipelines defined in this repository.
- Static assets, cryptographic Subresource Integrity (SRI) signatures, and reverse proxy engine logic.

### Out of Scope
- Denial of Service (DoS/DDoS) attacks against upstream edge or CDN infrastructure.
- Social engineering attacks against maintainers or contributors.
- Physical attacks against infrastructure.
- Vulnerabilities in third-party services outside direct repository control.

## Safe Harbor

We consider security research conducted in good faith and in compliance with this policy to be authorized. We commit to:
- Not pursuing legal action against researchers for accidental, good-faith violations of this policy.
- Collaborating to understand, validate, and remediate confirmed vulnerabilities promptly.
- Providing attribution and credit in repository release notes upon request.
