'use client'; // Mark as client component

import React, { useState } from 'react';
import styles from './styles.module.css';

interface PhotoCounterProps {
  initialCount: number;
}

const PhotoCounter: React.FC<PhotoCounterProps> = ({ initialCount }) => {
  const [count, setCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);

  // Increment the photo count via API call
  const incrementCount = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/db?key=photoCount', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to increment counter');
      }
      
      const data = await response.json();
      setCount(data.value);
    } catch (error) {
      console.error('Error incrementing counter:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.counterBox}>
      <div className={styles.counterLabel}>Photos Taken</div>
      <div className={styles.counterValue}>{count}</div>
      <button 
        className={styles.counterButton}
        onClick={incrementCount}
        disabled={isLoading}
      >
        {isLoading ? 'Updating...' : 'Increment Counter'}
      </button>
    </div>
  );
};

export default PhotoCounter;      