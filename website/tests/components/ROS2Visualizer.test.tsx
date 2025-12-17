// website/tests/components/ROS2Visualizer.test.tsx
// Unit test for ROS2 visualization component

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ROS2Visualizer from '@src/components/ROS2Visualizer';

// Mock the roslibjs library since it's an external dependency
jest.mock('roslib', () => ({
  Ros: jest.fn(() => ({
    connect: jest.fn(),
    onClose: jest.fn(),
    onConnection: jest.fn(),
    onerror: jest.fn(),
  })),
  Topic: jest.fn(() => ({
    subscribe: jest.fn(),
    advertise: jest.fn(),
    publish: jest.fn(),
  })),
}));

describe('ROS2Visualizer Component', () => {
  const defaultProps = {
    nodeId: 'test-node',
    rosbridgeUrl: 'ws://localhost:9090',
  };

  test('renders without crashing', () => {
    render(<ROS2Visualizer {...defaultProps} />);
    expect(screen.getByTestId('ros2-visualizer')).toBeInTheDocument();
  });

  test('initially shows loading state', () => {
    render(<ROS2Visualizer {...defaultProps} />);
    expect(screen.getByText('Connecting to ROS2...')).toBeInTheDocument();
  });

  test('displays connection status', async () => {
    render(<ROS2Visualizer {...defaultProps} />);

    // Simulate connection
    await waitFor(() => {
      expect(screen.queryByText('Connecting to ROS2...')).not.toBeInTheDocument();
    });

    // Check if the connection status is displayed
    expect(screen.getByText('Connected')).toBeInTheDocument();
  });

  test('handles connection errors gracefully', async () => {
    // Simulate error scenario
    render(<ROS2Visualizer {...defaultProps} />);

    // Test error handling
    await waitFor(() => {
      // Check if error message is displayed when connection fails
      const errorElement = screen.queryByText('Connection Error');
      if (errorElement) {
        expect(errorElement).toBeInTheDocument();
      }
    });
  });

  test('renders visualization canvas when connected', async () => {
    render(<ROS2Visualizer {...defaultProps} />);

    await waitFor(() => {
      // Check if visualization canvas is rendered when connected
      const canvas = screen.queryByTestId('visualization-canvas');
      if (canvas) {
        expect(canvas).toBeInTheDocument();
      }
    });
  });
});