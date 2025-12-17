# Vercel Deployment Guide for Physical AI & Humanoid Robotics Textbook

## Overview

This guide provides instructions for deploying the Physical AI & Humanoid Robotics Textbook to Vercel. The project is a Docusaurus-based website with interactive components, 3D models, and LaTeX mathematical rendering.

## Prerequisites

- A Vercel account
- The source code pushed to a GitHub repository (already done at https://github.com/MuhibAnwar/Publication-GIAIC_HACKATHON_0)
- Admin access to the GitHub repository

## Deployment Steps

### 1. Import the Project on Vercel

1. Go to https://vercel.com and sign in to your account
2. Click "Add New..." and select "Project"
3. Choose your GitHub account and select the `Publication-GIAIC_HACKATHON_0` repository
4. Vercel should automatically detect that this is a Docusaurus project

### 2. Configuration Settings

When configuring the project, ensure these settings:

- **Framework**: Docusaurus (should be auto-detected)
- **Root Directory**: `website`
- **Build Command**: `npm run build` (or `yarn build`)
- **Output Directory**: `build`
- **Development Command**: (leave empty or `npm run start` for preview)

### 3. Environment Variables (Optional)

If you need to use environment variables for API endpoints or analytics, you can add them in the Vercel dashboard under Settings > Environment Variables:

- `REACT_APP_API_BASE_URL` - Base URL for assessment API
- `REACT_APP_LTI_CONSUMER_KEY` - LTI integration key
- `REACT_APP_LTI_CONSUMER_SECRET` - LTI integration secret
- `REACT_APP_GA_TRACKING_ID` - Google Analytics ID (if needed)
- `REACT_APP_ALGOLIA_APP_ID` - Algolia app ID (if using Algolia instead of local search)
- `REACT_APP_ALGOLIA_SEARCH_KEY` - Algolia search key
- `REACT_APP_ALGOLIA_INDEX_NAME` - Algolia index name

### 4. Important Notes for Build Process

The project includes:
- LaTeX math rendering (with remark-math and rehype-katex)
- Interactive 3D models (with Three.js)
- ROS2 visualization components
- Multi-language support (currently configured for English only to reduce memory usage)

Due to the complexity of the site with 3D models and math rendering, the build process may require significant memory. Vercel's build infrastructure should handle this appropriately.

### 5. Deploy

Click "Deploy" to start the deployment process. The first deployment may take several minutes due to the complexity of the build.

## Custom Domain (Optional)

After successful deployment, you can add a custom domain:

1. Go to your project settings in Vercel
2. Navigate to "Domains" 
3. Add your custom domain (e.g., `physical-ai-textbook.yourdomain.com`)
4. Follow the instructions to update your DNS settings

## Troubleshooting

### Build Failures

If the build fails due to memory constraints:

1. Consider removing or optimizing large 3D model assets
2. Temporarily disable complex interactive components during build
3. Simplify LaTeX equations if possible

### 404 Errors After Deployment

If experiencing 404 errors after deployment:

1. Check that the vercel.json correctly specifies the framework as "docusaurus"
2. Verify that the rewrites configuration is properly handling client-side routing
3. Ensure docusaurus.config.js has the correct trailingSlash setting
4. Confirm that baseUrl in docusaurus.config.js is set appropriately ("/" for root deployment)

The current configuration includes:
- Framework detection set to "docusaurus"
- Rewrite rules to handle client-side routing
- trailingSlash set to false in docusaurus.config.js

### Slow Loading Times

Consider:
- Optimizing images and 3D assets
- Using a CDN for static assets
- Implementing code splitting for complex components

## Post-Deployment

Once deployed, your site will be available at:
- https://physical-ai-textbook.vercel.app (or your custom domain)

The site includes:
- Full textbook content with LaTeX equations
- Interactive 3D models and ROS2 visualizations
- Auto-graded exercises (backend integration needed)
- Multi-language support
- PWA functionality
- LTI integration for Canvas/Moodle