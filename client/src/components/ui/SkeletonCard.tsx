import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border dark:border-gray-700 animate-pulse">
      {/* Skeleton untuk badge kategori */}
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-1/4"></div>
      
      {/* Skeleton untuk judul */}
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mt-4 mb-2 w-3/4"></div>
      
      {/* Skeleton untuk deskripsi */}
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mt-2 w-5/6"></div>
      
      {/* Skeleton untuk detail bawah */}
      <div className="border-t dark:border-gray-600 pt-4 mt-4 space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      </div>
    </div>
  );
}