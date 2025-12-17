# Physical AI & Humanoid Robotics Textbook

This is a Docusaurus-based textbook website for "Physical AI & Humanoid Robotics" that connects high-level AI concepts with low-level robotic control.

## About

This textbook bridges the gap between digital AI and physical robotics, focusing on embodied intelligence and humanoid robotics. It connects high-level AI concepts (LLMs, VLA) with low-level control (Actuators, ROS2) to provide students with a comprehensive understanding of Physical AI.

## Features

- Interactive learning experience with ROS2 visualization
- 3D models and simulation demos
- Auto-graded exercises with immediate feedback
- Progress tracking for students and instructors
- Multi-language support
- Progressive Web App for offline access
- LaTeX mathematical notation support
- LTI integration for Canvas/Moodle

## Deploying on Vercel

This project is configured for deployment on Vercel:

1. The `vercel.json` file specifies the build configuration
2. The `rootDirectory` is set to `website` where the Docusaurus project resides
3. The `@vercel/static-build` builder is used with `distDir` set to `build`
4. The site is built using Docusaurus' build command

To build locally, you can run:
```bash
cd website
npm install
npm run build
```

The build output will be in the `build/` directory.