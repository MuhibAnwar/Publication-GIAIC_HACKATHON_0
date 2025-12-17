// website/src/utils/accessibility.ts

/**
 * Utility functions to enhance accessibility (WCAG 2.1 AA compliance)
 */

// Function to ensure sufficient color contrast
export const ensureContrast = (foregroundColor: string, backgroundColor: string): boolean => {
  const fg = hexToRgb(foregroundColor);
  const bg = hexToRgb(backgroundColor);
  
  if (!fg || !bg) return false;
  
  const contrastRatio = calculateContrastRatio(fg, bg);
  // For WCAG AA: Large text needs 3:1, normal text needs 4.5:1
  return contrastRatio >= 4.5;
};

// Convert hex color to RGB
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
};

// Calculate contrast ratio between two colors
export const calculateContrastRatio = (
  color1: { r: number; g: number; b: number },
  color2: { r: number; g: number; b: number }
): number => {
  const l1 = getRelativeLuminance(color1);
  const l2 = getRelativeLuminance(color2);
  
  return l1 > l2 ? (l1 + 0.05) / (l2 + 0.05) : (l2 + 0.05) / (l1 + 0.05);
};

// Calculate relative luminance for contrast ratio
export const getRelativeLuminance = (color: { r: number; g: number; b: number }): number => {
  const rsrgb = color.r / 255;
  const gsrgb = color.g / 255;
  const bsrgb = color.b / 255;
  
  const r = rsrgb <= 0.03928 ? rsrgb / 12.92 : Math.pow((rsrgb + 0.055) / 1.055, 2.4);
  const g = gsrgb <= 0.03928 ? gsrgb / 12.92 : Math.pow((gsrgb + 0.055) / 1.055, 2.4);
  const b = bsrgb <= 0.03928 ? bsrgb / 12.92 : Math.pow((bsrgb + 0.055) / 1.055, 2.4);
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

// Function to manage focus indicators for keyboard navigation
export const manageFocusIndicators = (): void => {
  // Add focus styles for keyboard navigation
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });
};

// Function to announce messages for screen readers
export const announceForScreenReader = (message: string, politeness: 'polite' | 'assertive' = 'polite'): void => {
  // Create or reuse an ARIA live region element
  let liveRegion = document.getElementById('aria-live-region');
  
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.setAttribute('id', 'aria-live-region');
    liveRegion.setAttribute('aria-live', politeness);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.setAttribute('style', `
      position: absolute;
      top: 0;
      left: 0;
      clip: rect(0 0 0 0);
      clip-path: inset(50%);
      overflow: hidden;
      white-space: nowrap;
      width: 1px;
      height: 1px;
    `);
    document.body.appendChild(liveRegion);
  }
  
  liveRegion.textContent = message;
  
  // Clear the message after a delay to prevent repeated announcements
  setTimeout(() => {
    liveRegion!.textContent = '';
  }, 1000);
};

// Function to ensure proper heading hierarchy
export const validateHeadingHierarchy = (): void => {
  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
    .map(h => parseInt(h.tagName.charAt(1)));

  let lastLevel = 0;
  const errors: string[] = [];
  
  headings.forEach(level => {
    if (level > lastLevel + 1) {
      errors.push(`Invalid heading level: H${level} follows H${lastLevel}, should be H${lastLevel + 1} or lower`);
    }
    lastLevel = level;
  });
  
  if (errors.length > 0) {
    console.warn('Accessibility issues with heading hierarchy:', errors);
    announceForScreenReader('There are accessibility issues with the heading hierarchy on this page');
  }
};

// Initialize accessibility features when DOM is ready
export const initAccessibilityFeatures = (): void => {
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        manageFocusIndicators();
        validateHeadingHierarchy();
      });
    } else {
      // DOM is already ready
      manageFocusIndicators();
      validateHeadingHierarchy();
    }
  }
};