# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Portal Web ChatBot IPSP - A React-based web portal chatbot application built with TypeScript and Vite.

## Tech Stack

- **Framework**: React 19.2.0
- **Language**: TypeScript 5.9.3
- **Build Tool**: Vite 7.2.4
- **Compiler**: SWC (via @vitejs/plugin-react-swc)
- **Linting**: ESLint 9 with TypeScript ESLint

## Development Commands

```bash
# Start development server with HMR
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview
```

Note: The build command runs TypeScript compiler in build mode before Vite build (`tsc -b && vite build`).

## Project Structure

- `src/` - Application source code
  - `main.tsx` - Application entry point with React root rendering
  - `App.tsx` - Main application component
  - `assets/` - Static assets (images, icons)
  - `*.css` - Component and global styles

## TypeScript Configuration

The project uses a composite TypeScript configuration:
- `tsconfig.json` - Root config with project references
- `tsconfig.app.json` - App source configuration with strict mode enabled
- `tsconfig.node.json` - Node/build tool configuration

Key compiler options:
- Target: ES2022
- Module: ESNext with bundler resolution
- JSX: react-jsx (React 17+ transform)
- Strict type checking enabled
- No unused locals/parameters enforcement

## ESLint Configuration

Using flat config format (eslint.config.js) with:
- TypeScript ESLint recommended rules
- React Hooks plugin with recommended rules
- React Refresh plugin for Vite HMR compatibility

Files are linted: `**/*.{ts,tsx}`
Ignored: `dist/`

## Build Output

Production builds are output to `dist/` directory.
