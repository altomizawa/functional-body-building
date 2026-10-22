'use client'

import React from 'react';

export default function ConfirmationPopup({ onConfirm, onCancel, isCompleted }) {
  const handleConfirm = (e) => {
    e.stopPropagation();
    onConfirm();
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    onCancel();
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute inset-0 bg-neutral-950/95 backdrop-blur-sm rounded-lg p-5 z-20 flex flex-col justify-center items-center text-center animate-in fade-in zoom-in-95 duration-150 border border-neutral-700"
    >
      <p className="text-base font-semibold text-neutral-100 mb-4">
        {isCompleted ? 'Mark this workout as uncompleted?' : 'Mark this workout as completed?'}
      </p>
      <div className="flex justify-center gap-3 w-full max-w-[200px]">
        <button
          type="button"
          onClick={handleCancel}
          className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-sm font-semibold py-2 px-3 rounded-md transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          className="flex-1 bg-white hover:bg-neutral-200 text-black text-sm font-bold py-2 px-3 rounded-md transition-colors shadow"
        >
          Yes
        </button>
      </div>
    </div>
  );
}