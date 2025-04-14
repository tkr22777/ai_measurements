'use client';

import React, { useEffect, useState } from 'react';
import { getAllValues } from '@/app/utils/db';
import styles from './styles.module.css';
import PhotoCounter from './PhotoCounter';

// Using client component pattern since we need to use this in a client context
export default function AppInfo() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch data when component mounts
    const fetchData = async () => {
      try {
        const dbData = await getAllValues();
        setData(dbData);
      } catch (err) {
        console.error('Error fetching app data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return <div className={styles.loading}>Loading app information...</div>;
  }
  
  if (!data) {
    return <div className={styles.error}>Failed to load app information</div>;
  }
  
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
        <PhotoCounter initialCount={data.photoCount || 0} />
      </div>
    </div>
  );
}        