'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import BookingForm from './BookingForm';
import { ScheduleWithRoute } from '@/lib/api';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: ScheduleWithRoute | null;
}

export default function BookingModal({ isOpen, onClose, schedule }: BookingModalProps) {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.showModal();
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      modalRef.current?.close();
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };

  if (!isOpen || !schedule) return null;

  return (
    <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box w-11/12 max-w-5xl bg-gray-50 p-0 overflow-hidden relative">
        <button 
          onClick={handleClose} 
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-50 text-gray-500 hover:bg-gray-200"
        >
          <X size={20} />
        </button>
        
        <div className="max-h-[90vh] overflow-y-auto p-4 md:p-6">
          <BookingForm schedule={schedule} />
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
}
