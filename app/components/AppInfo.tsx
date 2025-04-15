'use client';

import React from 'react';

export default function AppInfo() {
  return (
    <div className="app-info">
      <h2>Camera App</h2>
      <div className="info-card">
        <p>A simple web camera application built with Next.js</p>
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
          text-align: center;
        }
        
        p {
          margin: 0.5rem 0;
          font-size: 1rem;
          font-weight: 400;
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
        }
      `}</style>
    </div>
  );
} 