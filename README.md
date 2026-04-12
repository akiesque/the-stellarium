# the-stellarium

This is Stephanie Fermil's portfolio site built with **React**, **TypeScript**, and **Vite**. The layout pairs a full-screen **React Three Fiber** scene (VRM silhouette, tab-driven camera and clips, spring-bone hair motion) with a light/dark themed UI (**Tailwind CSS v4**, **Motion**).

## Tech stack

- React 19, React Compiler (Babel), React Router 7
- Vite 8, TypeScript 6
- Three.js, `@react-three/fiber`, `@pixiv/three-vrm` (+ VRMA / Mixamo clips)
- GSAP (camera panning), Motion (components)

## Scripts

| Command           | Description                     |
| ----------------- | ------------------------------- |
| `npm run dev`     | Start dev server with HMR       |
| `npm run build`   | Typecheck + production bundle   |
| `npm run preview` | Serve the `dist` output locally |
| `npm run lint`    | Run ESLint                      |

## Local setup

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## Assets

Large binaries (e.g. `.vrm`, `.vrma`, `.fbx`) live under `src/assets/VRM/` and are imported as static URLs. Other components were sourced from uiverse.io.
