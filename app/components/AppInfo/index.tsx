'use client';

import React from 'react';
import { cn, styles } from '@/utils/styles';

export default function AppInfo() {
  return (
    <div className="p-6 mx-auto max-w-2xl">
      <h2 className={cn(styles.text.heading, 'text-2xl mb-4 text-center')}>Camera App</h2>
      <div className={cn(styles.card.base, styles.card.shadow, styles.card.padding)}>
        <p className={cn(styles.text.body, 'text-center')}>
          A simple web camera application built with Next.js
        </p>
      </div>
    </div>
  );
}
