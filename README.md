# Physical AI & Humanoid Robotics Textbook

This repository contains the source code and content for the Physical AI & Humanoid Robotics textbook website, built with Docusaurus.

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

## Prerequisites

- Node.js 18+
- npm or yarn

## Installation

```bash
# Clone the repository
git clone https://github.com/your-organization/physical-ai-textbook.git
cd physical-ai-textbook/website

# Install dependencies
npm install
# or
yarn install
```

## Local Development

```bash
# Start the development server
npm start
# or
yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Building

```bash
# Build the static site
npm run build
# or
yarn run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Contributing

We welcome contributions to improve the textbook content and functionality. Please follow our contribution guidelines (see below) and submit pull requests with your changes.

### Content Creation

To add a new chapter:

1. Create a new directory in `docs/` with the chapter name
2. Add an `index.mdx` file with the main content
3. Add an `exercises.mdx` file for exercises
4. Update `sidebars.js` to include the new chapter in the navigation

### Code Contributions

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This textbook is licensed under the [MA GIAIC-PK 1.0](LICENSE) license.

## Support

For questions or support, please open an issue in this repository.