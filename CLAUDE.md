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
# Start development server with HMR (localhost only)
npm run dev

# Start development server accessible on local network
npm run dev:host

# Build for production
npm run build

# Run linter
npm run lint

# Preview production build (localhost only)
npm run preview

# Preview production build accessible on local network
npm run preview:host
```

Note: The build command runs TypeScript compiler in build mode before Vite build (`tsc -b && vite build`).

## Local Network Deployment

The application can be deployed on a local network using several methods:

### Quick Start (Windows)
- **Development mode**: Run `start-server.bat`
- **Production mode**: Run `start-production.bat`

These scripts automatically:
- Display your local IP address
- Start the server accessible on the local network
- Show connection URLs for both local and network access

### Manual Deployment
See `DEPLOYMENT.md` for detailed instructions on:
- Development server setup
- Production builds
- Custom HTTP servers (serve, http-server)
- PM2 process management
- Firewall configuration
- Troubleshooting

### Network Access
- Development server: `http://[YOUR_IP]:5173`
- Production preview: `http://[YOUR_IP]:4173`
- Find your IP: Run `ipconfig` and look for "IPv4 Address"

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
