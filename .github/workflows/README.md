# GitHub Actions Workflows

This repository uses GitHub Actions for continuous integration, security monitoring, and automated releases.

## Workflows Overview

### 1. CI/CD Pipeline (`ci.yml`)
**Triggers:** Push to main/develop, Pull Requests

**Jobs:**
- **Code Quality & Security**: ESLint, TypeScript checks, security audit
- **Build & Test**: Multi-node version testing, build verification
- **Docker Build**: Container build and security scanning
- **Performance Tests**: Lighthouse CI, accessibility checks
- **Deploy Preview**: PR preview deployments
- **Build & Push**: Docker image publishing (main branch only)

**Status:** ![CI/CD Pipeline](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/CI/CD%20Pipeline/badge.svg)

### 2. Security & Dependencies (`security.yml`)
**Triggers:** Daily at 2 AM UTC, Manual dispatch

**Jobs:**
- **Security Scan**: CodeQL analysis, npm audit, Snyk scanning
- **Dependency Updates**: Check for outdated packages
- **License Compliance**: Verify license compatibility
- **Issue Creation**: Auto-create issues for security/dependency problems

**Status:** ![Security](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/Security%20&%20Dependency%20Updates/badge.svg)

### 3. Release (`release.yml`)
**Triggers:** Git tags (v*.*.*), Manual dispatch

**Jobs:**
- **Create Release**: Generate changelog, create GitHub release
- **Build & Test**: Final build verification
- **Docker Release**: Multi-platform Docker images
- **Deploy Production**: Production deployment (if configured)

**Status:** ![Release](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/Release/badge.svg)

## Workflow Features

### ✅ **Comprehensive Testing**
- ESLint and TypeScript validation
- Build verification across Node.js versions
- Docker container testing
- Performance and accessibility testing
- Security vulnerability scanning

### 🔒 **Security First**
- Daily security scans
- Dependency vulnerability checks
- License compliance verification
- Container image security scanning with Trivy
- CodeQL static analysis

### 🚀 **Automated Deployment**
- Docker images published to GitHub Container Registry
- Multi-platform builds (AMD64, ARM64)
- Automated release creation with changelogs
- Production deployment pipeline ready

### 📊 **Quality Gates**
- All tests must pass before merge
- Security vulnerabilities block deployment
- Build size monitoring
- Performance benchmarking

## Setup Instructions

### 1. Repository Secrets
Add these secrets to your repository settings:

```
GITHUB_TOKEN          # Automatically provided
SNYK_TOKEN           # Optional: Snyk security scanning
DOCKERHUB_USERNAME   # Optional: Docker Hub integration
DOCKERHUB_TOKEN      # Optional: Docker Hub integration
LHCI_GITHUB_APP_TOKEN # Optional: Lighthouse CI
```

### 2. Branch Protection
Configure branch protection rules for `main`:
- Require status checks to pass
- Require branches to be up to date
- Require review from code owners
- Restrict pushes to matching branches

### 3. Environments
Create environments in repository settings:
- `production` - for production deployments
- Add environment protection rules as needed

## Usage Examples

### Running Workflows

#### Trigger CI/CD Pipeline
```bash
# Push to main or develop
git push origin main

# Create pull request
gh pr create --title "Feature: New functionality"
```

#### Create a Release
```bash
# Create and push a tag
git tag v1.0.0
git push origin v1.0.0

# Or use GitHub CLI
gh release create v1.0.0 --generate-notes
```

#### Manual Security Scan
```bash
# Trigger via GitHub CLI
gh workflow run security.yml

# Or via GitHub web interface
# Go to Actions > Security & Dependency Updates > Run workflow
```

### Monitoring Workflows

#### Check Status
```bash
# List workflow runs
gh run list

# View specific run
gh run view <run-id>

# Watch live run
gh run watch
```

#### Download Artifacts
```bash
# List artifacts
gh run list --limit 1
gh api repos/:owner/:repo/actions/runs/<run-id>/artifacts

# Download artifacts
gh run download <run-id>
```

## Customization

### Adding New Checks
1. Edit `.github/workflows/ci.yml`
2. Add new job or step
3. Configure dependencies between jobs
4. Test with pull request

### Modifying Security Scans
1. Edit `.github/workflows/security.yml`
2. Add new security tools
3. Configure notification preferences
4. Set up integration with security platforms

### Deployment Configuration
1. Edit `.github/workflows/release.yml`
2. Add deployment targets
3. Configure environment variables
4. Set up health checks

## Troubleshooting

### Common Issues

#### Build Failures
- Check Node.js version compatibility
- Verify all dependencies are installed
- Review build logs for specific errors

#### Docker Build Issues
- Ensure Dockerfile syntax is correct
- Check for missing dependencies
- Verify multi-stage build configuration

#### Security Scan Failures
- Review vulnerability reports
- Update dependencies with `npm audit fix`
- Check for license compliance issues

### Getting Help

1. **Check workflow logs**: Click on failed job in Actions tab
2. **Review error messages**: Look for specific error details
3. **Test locally**: Reproduce issues in local environment
4. **Update dependencies**: Keep packages up to date

## Best Practices

### Code Quality
- Write meaningful commit messages
- Keep pull requests focused and small
- Add tests for new functionality
- Follow TypeScript best practices

### Security
- Regularly update dependencies
- Review security scan results
- Use environment variables for secrets
- Follow principle of least privilege

### Performance
- Monitor build times and optimize
- Keep Docker images small
- Use caching effectively
- Profile application performance

## Metrics and Monitoring

The workflows provide various metrics:
- Build success/failure rates
- Security vulnerability trends
- Performance benchmarks
- Deployment frequency
- Lead time for changes

Access these through:
- GitHub Actions insights
- Workflow run history
- Security advisories
- Performance reports