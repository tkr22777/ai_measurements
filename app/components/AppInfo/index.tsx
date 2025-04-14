import React from 'react';
import { getAllValues } from '@/app/utils/db';
import styles from './styles.module.css';
import PhotoCounter from './PhotoCounter';

// This is a Server Component - note the absence of 'use client'
// It will fetch data on the server during rendering
async function AppInfo() {
  // Fetch data from our database
  const data = await getAllValues();
  
  // Format the lastUpdated date for display
  const formattedDate = new Date(data.lastUpdated).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>App Information</h2>
      
      <div className={styles.infoBox}>
        <div className={styles.infoItem}>
          <span className={styles.label}>App Name:</span>
          <span className={styles.value}>{data.appName}</span>
        </div>
        
        <div className={styles.infoItem}>
          <span className={styles.label}>Version:</span>
          <span className={styles.value}>{data.version}</span>
        </div>
        
        <div className={styles.infoItem}>
          <span className={styles.label}>Last Updated:</span>
          <span className={styles.value}>{formattedDate}</span>
        </div>
        
        <div className={styles.infoItem}>
          <span className={styles.label}>Features:</span>
          <ul className={styles.featureList}>
            {data.features.map((feature: string) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
        
        {/* Client component for interactive counter */}
        <PhotoCounter initialCount={data.photoCount} />
      </div>
    </div>
  );
}

export default AppInfo; 