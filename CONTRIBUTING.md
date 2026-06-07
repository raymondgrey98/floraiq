# Contributing to FloraIQ

Thank you for your interest in contributing to FloraIQ! This document provides guidelines and instructions for contributing to the project.

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm 10.4.1+
- Git

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/floraiq.git
   cd floraiq
   ```

3. Install dependencies:
   ```bash
   pnpm install
   ```

4. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```
   Fill in your API keys and Supabase credentials.

5. Run database migration in Supabase:
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Navigate to SQL Editor
   - Open and run the script: `supabase/migrations/001_floraiq_schema.sql`

6. Start development:
   ```bash
   pnpm dev
   ```

## Development Workflow

### Branch Naming
- Feature: `feature/description`
- Bug fix: `fix/description`
- Documentation: `docs/description`

### Commits
- Use clear, descriptive commit messages
- Format: `type(scope): description`
  - Examples: `feat(auth): add login page`, `fix(chat): resolve memory leak`

### Code Quality
- Run type checking: `pnpm check`
- Format code: `pnpm format`
- Ensure your code follows the existing style

## Project Structure

```
floraiq/
├── client/src/          # Frontend React components
├── server/              # Express backend
├── shared/              # Shared types and utilities
├── supabase/            # Database migrations
├── package.json
└── README.md
```

## Key Technologies

- **Frontend**: React 19, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Express, TypeScript
- **Database**: Supabase (PostgreSQL)
- **APIs**: Google Generative AI, Anthropic, OpenRouter

## Testing

Before submitting a PR, ensure:
- Type checking passes: `pnpm check`
- Code is formatted: `pnpm format`

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes with clear commits
3. Ensure all checks pass
4. Submit a PR with a clear description of:
   - What problem it solves
   - How it was tested
   - Any breaking changes

## Reporting Issues

- Use GitHub Issues for bug reports and feature requests
- Include:
  - Clear description of the issue
  - Steps to reproduce (for bugs)
  - Expected vs actual behavior
  - Environment details

## Questions?

Feel free to open an issue or discussion for questions about the codebase.

Thank you for contributing! 🌱
