'use client';

import React from 'react';
// Remove the CSS module import
// import styles from './styles.module.css';

export default function AppInfo() {
  return (
    <div className="p-6 mx-auto max-w-2xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Camera App</h2>
      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="text-gray-700 text-center">
          A simple web camera application built with Next.js
        </p>
      </div>
    </div>
  );
}
