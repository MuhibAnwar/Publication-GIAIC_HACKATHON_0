// website/tests/components/LaTeXRendering.test.tsx
// Component test for LaTeX equation rendering in MDX pages

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LaTeXRenderer from '@src/components/LaTeXRenderer';

describe('LaTeX Equation Rendering Component', () => {
  test('renders inline LaTeX equations properly', () => {
    const equation = '$\\tau = I \\alpha$ where $\\tau$ is torque, $I$ is moment of inertia, and $\\alpha$ is angular acceleration.';
    
    render(<LaTeXRenderer content={equation} />);
    
    // Check if the equation is rendered (specific implementation may vary based on how LaTeX is rendered in the actual component)
    expect(screen.getByText(/τ = I α/)).toBeInTheDocument();
  });

  test('renders block LaTeX equations properly', () => {
    const equation = `
      $$ 
      \\mathbf{F} = m\\mathbf{a}
      $$

      This is Newton's second law of motion.
    `;
    
    render(<LaTeXRenderer content={equation} />);
    
    // Check if the equation is rendered in block format
    expect(screen.getByText(/F = ma/)).toBeInTheDocument();
  });

  test('handles complex mathematical expressions', () => {
    const complexEquation = '$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$';
    
    render(<LaTeXRenderer content={complexEquation} />);
    
    // Check if the complex equation is rendered
    expect(screen.getByText(/∫/)).toBeInTheDocument();
  });

  test('renders physics equations correctly', () => {
    const physicsEquation = 'The Lagrangian is defined as $L = T - V$ where $T$ is kinetic energy and $V$ is potential energy.';
    
    render(<LaTeXRenderer content={physicsEquation} />);
    
    // Check if the physics equation is rendered
    expect(screen.getByText(/L = T - V/)).toBeInTheDocument();
  });

  test('handles multiple equations in one component', () => {
    const multipleEquations = `
      The position of a humanoid robot joint is described by:
      $$
      \\theta(t) = \\theta_0 \\cos(\\omega t + \\phi)
      $$
      
      The corresponding velocity is:
      $$
      \\omega(t) = -\\theta_0 \\omega \\sin(\\omega t + \\phi)
      $$
    `;
    
    render(<LaTeXRenderer content={multipleEquations} />);
    
    // Check if the multiple equations are rendered
    expect(screen.getByText(/θ₀/)).toBeInTheDocument();
    expect(screen.getByText(/ω/)).toBeInTheDocument();
  });
});