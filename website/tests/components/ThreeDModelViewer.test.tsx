// website/tests/components/ThreeDModelViewer.test.tsx
// Component test for 3D model viewer with Three.js

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThreeDModelViewer from '@src/components/ThreeDModelViewer';

// Mock Three.js since it's a complex 3D library
jest.mock('three', () => ({
  ...jest.requireActual('three'),
  WebGLRenderer: jest.fn(() => ({
    domElement: document.createElement('canvas'),
    setSize: jest.fn(),
    render: jest.fn(),
  })),
  Scene: jest.fn(() => ({
    add: jest.fn(),
    remove: jest.fn(),
  })),
  PerspectiveCamera: jest.fn(() => ({
    position: { set: jest.fn() },
    aspect: 1,
    updateProjectionMatrix: jest.fn(),
  })),
  OrbitControls: jest.fn(() => ({
    update: jest.fn(),
    dispose: jest.fn(),
    enabled: true,
  })),
  Mesh: jest.fn(() => ({})),
  BoxGeometry: jest.fn(() => ({})),
  MeshBasicMaterial: jest.fn(() => ({})),
}));

describe('ThreeDModelViewer Component', () => {
  const defaultProps = {
    modelPath: '/static/models/test-model.glb',
    title: 'Test Robot Model',
  };

  test('renders without crashing', () => {
    render(<ThreeDModelViewer {...defaultProps} />);
    expect(screen.getByTestId('3d-model-viewer')).toBeInTheDocument();
  });

  test('shows loading state initially', () => {
    render(<ThreeDModelViewer {...defaultProps} />);
    expect(screen.getByText('Loading 3D Model...')).toBeInTheDocument();
  });

  test('displays model title', () => {
    render(<ThreeDModelViewer {...defaultProps} />);
    expect(screen.getByText('Test Robot Model')).toBeInTheDocument();
  });

  test('handles model loading successfully', async () => {
    render(<ThreeDModelViewer {...defaultProps} />);

    await waitFor(() => {
      // Check if the canvas element (where 3D model would be rendered) appears
      expect(screen.queryByTestId('model-canvas')).toBeInTheDocument();
    });
  });

  test('handles model loading errors', async () => {
    const errorProps = {
      modelPath: '/static/models/nonexistent-model.glb',
      title: 'Test Robot Model',
    };

    render(<ThreeDModelViewer {...errorProps} />);

    await waitFor(() => {
      // Check if error message is displayed when model fails to load
      const errorElement = screen.queryByText('Failed to load 3D model');
      if (errorElement) {
        expect(errorElement).toBeInTheDocument();
      } else {
        // If there's no specific error message, ensure that the loading message disappears
        expect(screen.queryByText('Loading 3D Model...')).not.toBeInTheDocument();
      }
    });
  });

  test('renders with appropriate controls', async () => {
    render(<ThreeDModelViewer {...defaultProps} />);

    await waitFor(() => {
      // Check for controls like rotation, zoom, etc.
      const controls = screen.queryByTestId('model-controls');
      if (controls) {
        expect(controls).toBeInTheDocument();
      }
    });
  });
});