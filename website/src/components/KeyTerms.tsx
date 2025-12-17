// website/src/components/KeyTerms.tsx
import React from 'react';
import clsx from 'clsx';
import styles from './KeyTerms.module.css';

interface KeyTerm {
  term: string;
  definition: string;
}

interface KeyTermsProps {
  terms: KeyTerm[];
}

const KeyTerms: React.FC<KeyTermsProps> = ({ terms }) => {
  return (
    <div className={clsx('key-terms', styles.termsContainer)}>
      <h3>Key Terms</h3>
      <dl>
        {terms.map((item, index) => (
          <div key={index} className={styles.termItem}>
            <dt className={styles.term}>{item.term}</dt>
            <dd className={styles.definition}>{item.definition}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default KeyTerms;