# Contributing to [Angular Practica CRUD]

Thank you for your interest in contributing to this project! To keep our collaboration smooth and efficient, please follow the guidelines below.

---

## 1. Git Workflow: GitFlow

We use the **GitFlow** branching model to organize our development:

- **`main`**: The stable production-ready branch.
- **`develop`**: The integration branch for features; all completed features are merged here.
- **Feature branches**: Created from `develop` for new features or improvements.
- **Release branches**: Created from `develop` when preparing a new release.
- **Hotfix branches**: Created from `main` to quickly fix production issues.

### Branch naming conventions

- Feature branches: `feat/<feature-name>`
- Bugfix branches: `fix/<bug-description>`
- Refactor branches: `refactor/<refactor-description>`
- Release branches: `release/<version-number>`
- Hotfix branches: `hotfix/<issue-description>`

### Typical workflow

1. Create a feature branch from `develop`:

   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feat/your-feature-name
   ```text

2. Work on your feature, commit changes.
3. Push your branch to the remote repository:

   ```bash
   git push origin feat/your-feature-name
   ```text

4. Open a Pull Request (PR) to merge your feature branch into `develop`.
5. After review and approval, your PR will be merged.
6. When ready, a release branch is created from `develop` and eventually merged into `main`.

---

## 2. Commit Message Conventions

We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification to keep commit history clear and meaningful.

### Commit message format

- **type**: The type of change. Common types include:
  - `feat`: A new feature
  - `fix`: A bug fix
  - `docs`: Documentation only changes
  - `style`: Changes that do not affect the meaning of the code (white-space, formatting)
  - `refactor`: Code changes that neither fix a bug nor add a feature
  - `perf`: A code change that improves performance
  - `test`: Adding missing tests or correcting existing tests
  - `chore`: Changes to the build process or auxiliary tools

- **scope** (optional): A noun describing a section of the codebase (e.g., `auth`, `ui`, `api`).
- **subject**: A short description of the change in imperative mood.

### Examples
feat(auth): add login with Google OAuth
fix(api): handle null response in user endpoint
docs: update README with setup instructions
refactor(ui): simplify header component

---

## 3. Pull Request (PR) Process

To maintain code quality and consistency, all changes must be submitted via Pull Requests.

### PR guidelines

- Base your PR branch off the latest `develop`.
- Provide a clear and descriptive title.
- Include a detailed description of what your PR does and why.
- Reference any related issues or tickets.
- Ensure your code passes all tests and linting.
- Keep PRs focused and small when possible.
- Request reviews from at least one team member.
- Address review comments promptly.

### Review criteria

- Code correctness and functionality.
- Code readability and maintainability.
- Adherence to coding standards and conventions.
- Adequate test coverage.
- Proper documentation updates if applicable.

---

## Additional Notes

- Before starting work, check the issue tracker to avoid duplicating efforts.
- Keep your fork or local repository up to date with the main repository.
- Be respectful and constructive in code reviews and discussions.

---

Thank you for helping improve this project! Your contributions are highly appreciated.

---

*This document is inspired by best practices from popular open source projects.*
