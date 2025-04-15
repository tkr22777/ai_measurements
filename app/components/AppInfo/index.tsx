'use client';

import React from 'react';
import styles from './styles.module.css';

export default function AppInfo() {
  return (
    <div className={styles.appInfo}>
      <h2 className={styles.title}>Camera App</h2>
      <div className={styles.infoCard}>
        <p className={styles.description}>A simple web camera application built with Next.js</p>
      </div>
    </div>
  );
}
