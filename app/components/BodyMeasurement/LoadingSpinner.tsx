import { cn, styles } from '@/utils/styles';

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div className={cn(styles.layout.centerCol, 'w-full mt-4 mb-2 p-4')}>
      <div className={styles.layout.center}>
        <div className={cn(styles.loading.spinner, 'w-6 h-6 border-t-indigo-500 mr-2')}></div>
        <p className={styles.text.body}>{message}</p>
      </div>
    </div>
  );
}
