// website/src/components/References.tsx
import React from 'react';
import clsx from 'clsx';
import styles from './References.module.css';

interface ReferenceItem {
  id: string;
  ieeeCitation: string;
}

interface ReferencesProps {
  references: ReferenceItem[];
}

const References: React.FC<ReferencesProps> = ({ references }) => {
  return (
    <div className={clsx('references', styles.referencesContainer)}>
      <h3>References</h3>
      <ol className={styles.referencesList}>
        {references.map((ref, index) => (
          <li key={ref.id || index} className={styles.referenceItem}>
            {ref.ieeeCitation}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default References;