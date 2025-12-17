// website/src/components/ColorModeToggle.tsx
import React from 'react';
import clsx from 'clsx';
import styles from './ColorModeToggle.module.css';
import { useColorMode, useColorModeConfig } from '@docusaurus/theme-common';
import { translate } from '@docusaurus/Translate';

const ColorModeToggle = ({ icon, title }) => {
  const { colorMode, setColorMode } = useColorMode();
  const { buttonTitle } = useColorModeConfig();

  const toggle = () => {
    setColorMode(colorMode === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={styles.container}>
      <button
        aria-label={buttonTitle}
        className={clsx(
          'clean-btn',
          styles.toggle,
        )}
        onClick={toggle}
        title={title ?? translate({id: 'theme.NotFound.title', message: 'Go to Home Page', description: 'The title attribute for the navbar home page entry', })}
        type="button">
          <span className={styles.toggleIcon}>
            {colorMode === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </span>
      </button>
    </div>
  );
};

export default ColorModeToggle;