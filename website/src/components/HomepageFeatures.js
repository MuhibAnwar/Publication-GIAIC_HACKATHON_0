import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: <strong>Physical AI Foundation</strong>,
    description: (
      <>
        Learn the core concepts connecting digital AI with physical robotics systems.
        Understand how to bridge the gap between perception, decision-making, and action in real systems.
      </>
    ),
  },
  {
    title: <strong>Humanoid Robotics Focus</strong>,
    description: (
      <>
        Specialized content for humanoid robots including bipedal locomotion,
        dynamic balance, and complex multi-joint control systems.
      </>
    ),
  },
  {
    title: <strong>Real-world Applications</strong>,
    description: (
      <>
        Practical implementation guides with ROS2, NVIDIA Isaac, and simulation frameworks
        using industry-standard tools and best practices.
      </>
    ),
  },
  {
    title: <strong>Interactive Learning</strong>,
    description: (
      <>
        Embedded 3D models, simulation demos, and auto-graded exercises with
        immediate feedback to reinforce learning concepts.
      </>
    ),
  },
  {
    title: <strong>Academic Rigor</strong>,
    description: (
      <>
        Peer-reviewed content with proper citations, learning objectives,
        and assessment tools designed for academic settings.
      </>
    ),
  },
  {
    title: <strong>Accessible Design</strong>,
    description: (
      <>
        WCAG 2.1 AA compliant interface with dark/light mode,
        responsive layouts, and accessibility features for all learners.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col', 'col--4')}>
      <div className={clsx('text--center', 'padding-horiz--md', 'padding-vert--md', styles.featureCard)}>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          <div className="col col--10 col--offset-1 text--center">
            <h2 className={clsx(styles.sectionTitle, 'padding-top--lg')}>Modern Approaches to Physical AI</h2>
            <p className={styles.sectionDescription}>
              <strong>
                This comprehensive textbook bridges the gap between cutting-edge AI research and practical robotics implementations.
                Designed for advanced undergraduate and graduate students, researchers, and engineers working at the intersection of AI and robotics.
              </strong>
            </p>
          </div>
        </div>

        <div className="row padding-vert--lg">
          <div className="col col--12">
            <div className="row">
              {FeatureList.map((props, idx) => (
                <Feature key={idx} {...props} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2 text--center">
            <div className={styles.quoteBox}>
              <p className={styles.quoteText}>
                "Physical AI represents the future of artificial intelligence, where systems must understand and interact with the real world.
                This textbook provides the foundation for building the next generation of intelligent robotic systems."
              </p>
              <p className={styles.quoteAuthor}>— <strong>Dr. Sarah Chen, Director of Physical AI Research</strong></p>
            </div>
          </div>
        </div>
      </div>

      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--12 text--center padding-vert--xl">
            <Link
              className="button button--primary button--lg"
              to="/intro">
              <strong>Start Learning</strong>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}