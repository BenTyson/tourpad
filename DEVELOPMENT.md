# TourPad Development Guide

## Development Server Options

We provide multiple development server options optimized for different workflows:

### 🚀 Standard Robust Server (Recommended for Stability)
```bash
npm run dev
```
- Uses `./scripts/dev-robust.sh`
- Maximum stability with crash recovery
- Automatic memory optimization
- Manual restart required for file changes
- Best for: Production-like development, debugging crashes

### 🔄 Auto-Restart Server (Recommended for Active Development)
```bash
npm run dev:auto
```
- Uses `./scripts/dev-with-nodemon.sh`
- Combines robustness with automatic file watching
- Restarts server when files change
- Enhanced logging and error handling
- Type 'rs' + Enter for manual restart
- Best for: Active coding, rapid iteration

### ⚡ Pure Nodemon (Lightweight)
```bash
npm run dev:watch
```
- Direct nodemon usage with optimized config
- Fastest restart times
- Comprehensive file watching
- Best for: Quick changes, testing

### 🔧 Other Development Options
- `npm run dev:stable` - Basic stable server without crash recovery
- `npm run dev:clean` - Clean start with cache clearing
- `npm run dev:basic` - Simple Next.js dev server

## File Watching Configuration

Nodemon watches these file types and directories:
- **Source Code**: `src/`, `app/`, `components/`, `lib/`
- **Configuration**: `next.config.*`, `tailwind.config.*`, `tsconfig.json`
- **Database**: `prisma/` schema changes
- **Scripts**: `scripts/` directory
- **Environment**: `.env*` files

## Memory Optimization

All development servers include:
- Automatic memory allocation (50-75% of system RAM, 4-8GB limit)
- Garbage collection optimization
- Memory monitoring and warnings
- Process cleanup on exit

## Usage Recommendations

1. **Active Development**: Use `npm run dev:auto` for automatic restarts
2. **Debugging Issues**: Use `npm run dev` for maximum stability
3. **Quick Testing**: Use `npm run dev:watch` for minimal overhead
4. **Clean Start**: Use `npm run dev:clean` after major changes

## Troubleshooting

- **Port 3001 in use**: Stop existing servers with `./scripts/dev-robust.sh stop`
- **Memory issues**: Servers automatically optimize memory and restart if needed
- **File watching issues**: Check `nodemon.json` configuration
- **Manual restart**: Type `rs` + Enter in nodemon sessions