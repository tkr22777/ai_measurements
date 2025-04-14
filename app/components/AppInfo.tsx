'use client';

import React, { useEffect, useState, useRef } from 'react';

interface AppData {
  appName: string;
  version: string;
  lastUpdated: string;
  features: string[];
  visitCount?: number;
}

export default function AppInfo() {
  const [loading, setLoading] = useState(true);
  const [appData, setAppData] = useState<AppData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasIncrementedRef = useRef(false);

  useEffect(() => {
    async function fetchData() {
      try {
        // Only increment visit count once per component mount
        if (!hasIncrementedRef.current) {
          // Increment visit count
          const incrementRes = await fetch('/api/db', {
            method: 'PATCH',
            cache: 'no-store'
          });
          
          const incrementData = await incrementRes.json();
          if (incrementData.throttled) {
            console.log('Visit count increment was throttled');
          }
          
          hasIncrementedRef.current = true;
        }
        
        // Get app data
        const res = await fetch('/api/db', {
          cache: 'no-store'
        });
        
        if (!res.ok) {
          throw new Error('Failed to fetch app data');
        }
        
        const data = await res.json();
        setAppData(data);
      } catch (err) {
        console.error('Error fetching app data:', err);
        setError('Failed to load app information');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
    
    // Reset the increment flag when the component unmounts
    return () => {
      hasIncrementedRef.current = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="app-info loading">
        <div className="spinner"></div>
        <p>Loading app information...</p>
        
        <style jsx>{`
          .app-info {
            margin: 2rem 0;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 200px;
          }
          
          .spinner {
            width: 30px;
            height: 30px;
            border: 3px solid rgba(0, 112, 243, 0.2);
            border-radius: 50%;
            border-left-color: #0070f3;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          p {
            color: #666;
            font-size: 0.9rem;
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-info error">
        <p>{error}</p>
        <style jsx>{`
          .app-info {
            margin: 2rem 0;
            width: 100%;
          }
          
          p {
            color: #e74c3c;
            font-size: 0.9rem;
            text-align: center;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="app-info">
      <h2>App Information (Server Data)</h2>
      <div className="info-card">
        <p><strong>Name:</strong> {appData?.appName}</p>
        <p><strong>Version:</strong> {appData?.version}</p>
        <p><strong>Last Updated:</strong> {appData?.lastUpdated && new Date(appData.lastUpdated).toLocaleDateString()}</p>
        <p><strong>Visit Count:</strong> {appData?.visitCount}</p>
        
        <div className="features">
          <strong>Features:</strong>
          <ul>
            {appData?.features && appData.features.map((feature: string, index: number) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <style jsx>{`
        .app-info {
          margin: 2rem 0;
          width: 100%;
        }
        
        h2 {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          color: #333;
          text-align: center;
        }
        
        .info-card {
          background-color: #f8f9fa;
          border-radius: 8px;
          padding: 1rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        p {
          margin: 0.5rem 0;
          font-size: 0.9rem;
        }
        
        .features {
          margin-top: 1rem;
        }
        
        ul {
          margin-top: 0.5rem;
          padding-left: 1.5rem;
        }
        
        li {
          margin-bottom: 0.25rem;
          font-size: 0.9rem;
        }
        
        @media (prefers-color-scheme: dark) {
          h2 {
            color: #f0f0f0;
          }
          
          .info-card {
            background-color: #222;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          
          p {
            color: #ddd;
          }
          
          li {
            color: #ddd;
          }
        }
      `}</style>
    </div>
  );
} 