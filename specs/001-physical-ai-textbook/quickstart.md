# Quickstart Guide: Physical AI & Humanoid Robotics Textbook

## Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.11 (for code examples and Jupyter integration)
- Git
- A modern web browser with WebGL support (for 3D visualizations)

## Initial Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/[your-org]/physical-ai-textbook.git
   cd physical-ai-textbook
   ```

2. **Navigate to the website directory**
   ```bash
   cd website
   ```

3. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

4. **Start the development server**
   ```bash
   npm run start
   # or
   yarn start
   ```

   This will start a local development server at `http://localhost:3000` with hot reloading enabled.

## Adding Content

1. **Create a new chapter**
   ```bash
   # Create a new directory under docs/
   mkdir docs/module-1-new-chapter
   # Create an index.md file in that directory
   touch docs/module-1-new-chapter/index.mdx
   ```

2. **Edit the sidebar configuration**
   Update `sidebars.js` to add your new chapter to the navigation:
   ```javascript
   module.exports = {
     textbook: [
       // ... existing chapters
       {
         type: 'category',
         label: 'New Chapter',
         items: ['module-1-new-chapter/index'],
       },
     ],
   };
   ```

3. **Add LaTeX equations**
   ```md
   Here is an equation: $\\tau = I \\alpha$ where $\\tau$ is torque, $I$ is moment of inertia, and $\\alpha$ is angular acceleration.
   ```

4. **Add interactive components**
   ```md
   import ROS2Visualizer from '@site/src/components/ROS2Visualizer';

   <ROS2Visualizer nodeId="navigation-node" />
   ```

## Working with Exercises

Each chapter directory should include:
- `index.mdx` - Main content with learning objectives and text
- `exercises.mdx` - Chapter exercises and projects
- `references.bib` - BibTeX references
- `code/` - Python/ROS2 examples
- `simulations/` - Gazebo/Isaac Sim files (if applicable)

## Building for Production

```bash
npm run build
# or
yarn build
```

This generates a static site in the `build/` directory that can be served from any static hosting service.

## Adding Custom Components

Custom React components for interactive features go in the `src/components/` directory:

```javascript
// src/components/ThreeDModelViewer.js
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export default function ThreeDModelViewer({ modelPath }) {
  // Component implementation
  return (
    <div style={{ height: '400px' }}>
      <Canvas>
        {/* Model rendering code */}
        <OrbitControls />
      </Canvas>
    </div>
  );
}
```

## Running Tests

```bash
# Run all tests
npm run test
# or
yarn test

# Run end-to-end tests
npm run test:e2e
# or
yarn test:e2e
```

## Configuration

Key configuration files:
- `docusaurus.config.js` - Site configuration (title, theme, plugins)
- `sidebars.js` - Navigation structure
- `src/css/custom.css` - Custom styling
- `static/` - Static assets (images, simulations, etc.)

## Deployment

The site is configured for GitHub Pages deployment via GitHub Actions (configured in `.github/workflows/deploy.yml`).

For manual deployment:
1. Build the site: `npm run build`
2. The contents of the `build/` directory can be deployed to any static hosting service

## Common Issues

- **LaTeX not rendering**: Ensure `remark-math` and `rehype-katex` are properly configured in `docusaurus.config.js`
- **3D models not loading**: Verify WebGL support in the browser and proper model format
- **Interactive components failing**: Check browser console for JavaScript errors
- **Slow build times**: Large image assets can impact build speed; optimize images for web