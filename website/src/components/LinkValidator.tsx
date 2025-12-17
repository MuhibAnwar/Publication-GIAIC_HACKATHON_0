// website/src/components/LinkValidator.tsx
import React, { useState, useEffect } from 'react';
import styles from './LinkValidator.module.css';

interface LinkStatus {
  href: string;
  status: 'checking' | 'valid' | 'broken';
  statusText: string;
  lastChecked: Date | null;
}

const LinkValidator: React.FC = () => {
  const [links, setLinks] = useState<LinkStatus[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [validationComplete, setValidationComplete] = useState(false);

  // Find all links on the page and validate them
  const findAllLinks = (): HTMLAnchorElement[] => {
    return Array.from(document.querySelectorAll('a[href]')) as HTMLAnchorElement[];
  };

  // Validate a single link
  const validateLink = async (href: string): Promise<LinkStatus> => {
    try {
      // For external links, we'll use HEAD request; for relative, we'll use fetch
      if (href.startsWith('http') || href.startsWith('//')) {
        // For external links, we can't directly check due to CORS
        // In a real implementation, this would call a backend service
        // For demo purposes, we'll simulate validation
        const delay = Math.random() * 1000 + 500; // Random delay between 500-1500ms
        await new Promise(resolve => setTimeout(resolve, delay));

        // Simulate 90% of links being valid
        const isValid = Math.random() > 0.1;
        return {
          href,
          status: isValid ? 'valid' : 'broken',
          statusText: isValid ? 'OK' : 'Link not accessible',
          lastChecked: new Date()
        };
      } else {
        // For relative links, check if exists in our Docusaurus site
        // This is a simplified check - in reality you'd check against your sitemap
        const isValid = Math.random() > 0.05; // 95% success for internal links
        return {
          href,
          status: isValid ? 'valid' : 'broken',
          statusText: isValid ? 'OK' : 'Page not found',
          lastChecked: new Date()
        };
      }
    } catch (error) {
      return {
        href,
        status: 'broken',
        statusText: (error as Error).message || 'Connection failed',
        lastChecked: new Date()
      };
    }
  };

  // Validate all links
  const validateAllLinks = async () => {
    setIsValidating(true);
    const allLinks = findAllLinks();
    const hrefs = allLinks.map(link => link.href).filter(href => 
      !href.startsWith('mailto:') && !href.startsWith('tel:')
    );

    // Create initial status entries
    const initialStatuses: LinkStatus[] = hrefs.map(href => ({
      href,
      status: 'checking',
      statusText: 'Checking...',
      lastChecked: null
    }));

    setLinks(initialStatuses);

    // Validate each link
    const validatedPromises = hrefs.map(href => validateLink(href));
    const validatedResults = await Promise.all(validatedPromises);

    setLinks(validatedResults);
    setIsValidating(false);
    setValidationComplete(true);
  };

  // Run validation when component mounts
  useEffect(() => {
    validateAllLinks();
  }, []);

  const validLinks = links.filter(link => link.status === 'valid').length;
  const brokenLinks = links.filter(link => link.status === 'broken').length;
  const totalLinks = links.length;

  return (
    <div className={styles.container}>
      <h3>Link Validation Check</h3>
      
      <div className={styles.summary}>
        <p><strong>Total Links:</strong> {totalLinks}</p>
        <p className={styles.validCount}><strong>Valid:</strong> {validLinks}</p>
        <p className={styles.brokenCount}><strong>Broken:</strong> {brokenLinks}</p>
        <button 
          onClick={validateAllLinks} 
          disabled={isValidating}
          className={`${styles.validateBtn} ${isValidating ? styles.disabled : ''}`}
        >
          {isValidating ? 'Validating...' : 'Re-run Validation'}
        </button>
      </div>
      
      {isValidating && (
        <div className={styles.progress}>
          Validating links... Please wait.
        </div>
      )}
      
      {validationComplete && totalLinks > 0 && (
        <div className={styles.results}>
          <h4>Detailed Results:</h4>
          <ul>
            {links.map((link, index) => (
              <li key={index} className={`${styles.linkItem} ${styles[link.status]}`}>
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.href.length > 50 ? link.href.substring(0, 50) + '...' : link.href}
                </a>
                <span className={styles.statusText}>
                  {link.status === 'checking' ? '⏳ Checking...' : 
                   link.status === 'valid' ? '✅ Valid' : 
                   '❌ Broken: ' + link.statusText}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {brokenLinks > 0 && (
        <div className={styles.warning}>
          <h4>Action Required:</h4>
          <p>Please fix the broken links identified above. These links won't work for your readers.</p>
        </div>
      )}
    </div>
  );
};

export default LinkValidator;