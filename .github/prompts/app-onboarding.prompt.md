---
name: app-onboarding
description: Guide users through the basics of the Vibe Coding ToDo App and its architecture
agent: ask
---

# App Onboarding Guide

Welcome to the **Vibe Coding ToDo App**! This guide will help you understand the application structure, architecture, and how to get started with development.

## What is This Application?

This is a full-stack ToDo application built as a monorepo containing:

- **Frontend**: Modern React application with Vite
- **Backend**: FastAPI service following Hexagonal Architecture principles
- **Database**: SQLite for data persistence

The app manages Items (todos) and Tags, with a clean architecture that separates concerns between presentation, business logic, and data access.

## Quick Start

### 1. First Time Setup

Before diving into code, make sure you have the prerequisites installed:

- Node.js 20+
- Python 3.13
- Poetry (install with `pip install poetry`)
- Make

Then install all dependencies:

```bash
make install
```

📖 **Read more**: [Main README.md](/README.md)

### 2. Running the Application

Start both frontend and backend together:

```bash
make dev
```

Or start them individually:

```bash
make backend    # Backend at http://localhost:8000
make frontend   # Frontend at http://localhost:5173
```

📖 **Read more**: [Main README.md](/README.md#installation--running)

### 3. Explore the API

Once the backend is running, explore the interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

This is the best way to understand available endpoints and data models.

## Understanding the Architecture

### Backend Architecture (Hexagonal/Ports & Adapters)

The backend follows **Hexagonal Architecture** with three distinct layers:

#### 1. **Domain Layer** (Core Business Logic)

- **Entities**: Pure business models (`Item`, `Tag`)
- **Repository Interfaces**: Contracts that define how to access data
- Location: `backend/app/{feature}/domain/`

#### 2. **Application Layer** (Use Cases)

- **Use Cases**: Business operations (create item, update tag, etc.)
- **DTOs**: Data Transfer Objects for input/output validation
- Location: `backend/app/{feature}/application/`

#### 3. **Infrastructure Layer** (External Concerns)

- **API Routers**: FastAPI endpoints and HTTP handling
- **ORM Models**: SQLAlchemy database models
- **Repository Implementations**: Actual database operations
- Location: `backend/app/{feature}/infrastructure/`

This separation ensures:

- ✅ Business logic is independent of frameworks
- ✅ Easy to test (can mock repositories)
- ✅ Flexible to swap databases or APIs

📖 **Read more**:

- [Backend README.md](/backend/README.md#architecture)
- [Backend Architecture Instructions](/.github/instructions/backend-architecture.instructions.md)

### Frontend Architecture (Feature-Based)

The frontend is organized by features, each containing its own:

- Components
- Hooks
- Services (API calls)
- Tests

Location: `frontend/src/features/`

📖 **Read more**: [Frontend README.md](/frontend/README.md)

## Project Structure Overview

```
.
├── backend/          # FastAPI backend with Hexagonal Architecture
│   ├── app/
│   │   ├── items/    # Items feature (todos)
│   │   ├── tags/     # Tags feature
│   │   ├── users/    # Users feature
│   │   └── shared/   # Shared utilities and database config
│   └── tests/        # Backend tests
│
├── frontend/         # React + Vite frontend
│   ├── src/
│   │   ├── features/ # Feature-based components
│   │   └── ...
│   └── tests/        # Frontend E2E tests (Playwright)
│
├── .github/          # GitHub workflows, instructions, and skills
│   ├── instructions/ # Architecture and coding guidelines
│   └── skills/       # Reusable development skills
│
└── Makefile          # Development commands
```

📖 **Read more**: [Copilot Instructions](/.github/copilot-instructions.md#project-structure)

## Development Workflow

Follow this workflow when making changes:

### 1. Plan Your Work

Break down the task into clear, manageable steps.

### 2. Implement with Tests

- Write or update code
- Add/update unit tests for the changes
- Follow the architecture patterns (Hexagonal for backend)

### 3. Run Tests

```bash
make test-backend            # Backend unit tests
make test-frontend           # Frontend unit tests
make test-e2e-ci            # E2E tests (requires backend running)
```

### 4. Lint and Format

```bash
make lint                    # Lint both frontend and backend
make format                  # Format both frontend and backend
```

### 5. Commit Your Changes

Use conventional commit messages:

```bash
# Examples:
feat: add delete button to todo items
fix: resolve tag filtering issue
test: add tests for item creation
```

📖 **Read more**: [Conventional Commits Skill](/.github/skills/conventional-commits/SKILL.md)

### 6. Run Pre-commit Hooks

```bash
make precommit-run
```

If errors appear (especially format or poetry lock), fix them, run `git add .`, and retry the commit.

📖 **Read more**: [Copilot Instructions](/.github/copilot-instructions.md#development-workflow)

## Common Development Tasks

### Adding a New Feature

**Backend (following Hexagonal Architecture):**

1. Create domain entity in `backend/app/{feature}/domain/`
2. Define repository interface
3. Create use cases in `application/`
4. Implement repository in `infrastructure/persistence/`
5. Add ORM model in `infrastructure/persistence/`
6. Create API router in `infrastructure/api/`
7. Write tests for each layer

**Frontend:**

1. Create feature folder in `frontend/src/features/`
2. Add components, hooks, and services
3. Write unit tests (Vitest)
4. Add E2E tests if needed (Playwright)

### Working with the Database

The SQLite database (`backend/app.db`) is created automatically. To reset it:

```bash
rm backend/app.db
# Restart the backend to recreate
make backend
```

### Debugging

**Backend:**

- Add print statements or use Python debugger
- Check backend terminal output
- Use FastAPI's automatic `/docs` for API testing

**Frontend:**

- Use browser DevTools
- Check frontend terminal for build errors
- Use React DevTools browser extension

**E2E Tests:**

- Run with UI mode: `cd frontend && npm run test:e2e:ui`
- Run with debug mode: `cd frontend && npm run test:e2e:debug`
- View HTML report: `cd frontend && npm run test:e2e:report`

📖 **Read more**: [E2E Tests Fixer Prompt](/.github/prompts/e2e-tests-fixer.prompt.md)

## Available Make Commands

All commands are run from the project root:

### Installation

```bash
make install              # Install all dependencies
make install-backend      # Install backend only
make install-frontend     # Install frontend only
```

### Running

```bash
make dev                  # Run both frontend and backend
make backend              # Run backend only
make frontend             # Run frontend only
```

### Code Quality

```bash
make lint                 # Lint everything
make lint-backend         # Lint backend
make lint-frontend        # Lint frontend
make format               # Format everything
make format-backend       # Format backend
make format-frontend      # Format frontend
```

### Testing

```bash
make test                 # Run all tests
make test-backend         # Run backend tests
make test-backend-coverage # Backend tests with coverage
make test-frontend        # Run frontend tests
make test-frontend-coverage # Frontend tests with coverage
make test-e2e-ci          # Run E2E tests
```

### Other

```bash
make precommit-run        # Run pre-commit hooks
make precommit-install    # Install pre-commit hooks
```

📖 **Read more**: [Makefile](/Makefile) - See all available commands

## Key Files to Know

### Configuration Files

- `backend/pyproject.toml` - Backend dependencies and Python config
- `frontend/package.json` - Frontend dependencies and npm scripts
- `frontend/vite.config.js` - Vite build configuration
- `frontend/playwright.config.js` - E2E test configuration

### Documentation

- `README.md` - Main project overview
- `backend/README.md` - Backend setup and architecture
- `frontend/README.md` - Frontend setup and features
- `.github/copilot-instructions.md` - AI assistant guidelines
- `.github/instructions/` - Architecture and coding guidelines

### Code Guidelines

- `.github/instructions/backend-architecture.instructions.md` - Hexagonal Architecture rules
- `.github/instructions/python.instructions.md` - Python coding standards

## Testing Overview

### Backend Tests (Pytest)

- Unit tests for use cases
- API endpoint tests
- Repository tests
- Run with: `make test-backend`

### Frontend Tests (Vitest)

- Component unit tests
- Hook tests
- Service tests
- Run with: `make test-frontend`

### E2E Tests (Playwright)

- Full user flow tests
- Browser automation
- Requires backend running
- Run with: `make test-e2e-ci`

📖 **Read more**:

- [Backend README - Testing](/backend/README.md#testing)
- [Frontend README - Testing](/frontend/README.md#testing)

## Tech Stack Summary

**Frontend:**

- React - UI library
- Vite - Build tool with HMR
- ESLint - Linting
- Vitest - Unit testing
- Playwright - E2E testing

**Backend:**

- FastAPI - Web framework
- SQLAlchemy - ORM
- SQLite - Database
- Pydantic - Data validation
- Poetry - Dependency management
- Pytest - Testing

**Development Tools:**

- Make - Command runner
- Pre-commit - Git hooks
- Ruff - Python linter/formatter

📖 **Read more**: [Main README.md](/README.md#tech-stack)

## Next Steps

Now that you understand the basics:

1. **Explore the codebase**: Start with `backend/app/items/` to see a complete feature
2. **Run the app**: `make dev` and interact with it
3. **Try the API**: Visit http://localhost:8000/docs
4. **Make a small change**: Add a field, update styling, etc.
5. **Run tests**: Ensure everything still works
6. **Read the architecture docs**: Understand the patterns deeply

## Getting Help

- Check the README files for each component
- Review the architecture instructions in `.github/instructions/`
- Look at existing code for patterns and examples
- Use the interactive API documentation at `/docs`
- Run tests to understand expected behavior

## Additional Resources

- [GitHub Copilot Instructions](/.github/copilot-instructions.md)
- [Conventional Commits](/.github/skills/conventional-commits/SKILL.md)
- [Pull Request Guidelines](/.github/skills/pull-request-definition/SKILL.md)
- [Create GitHub Issues](/.github/skills/create-github-issue/SKILL.md)

Happy coding! 🚀
