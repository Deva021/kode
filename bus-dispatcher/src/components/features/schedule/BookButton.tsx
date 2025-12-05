'use client';

import React from 'react';
import { PrimaryButton } from '@/components/ui/buttons';

interface BookButtonProps {
  scheduleId: number;
  unbookedSeats: number;
  onBook: (scheduleId: number) => void;
}

export default function BookButton({ scheduleId, unbookedSeats, onBook }: BookButtonProps) {
  const isLowSeats = unbookedSeats < 5;

  return (
    <PrimaryButton
      onClick={() => onBook(scheduleId)}
      className={`w-full ${
        isLowSeats
          ? 'bg-red-600 hover:bg-red-700 shadow-red-500/30'
          : 'bg-green-600 hover:bg-green-700 shadow-green-500/30'
      } border-none text-white shadow-lg hover:shadow-xl transition-all duration-300 text-sm px-4 py-2`}
    >
      Book Now
    </PrimaryButton>
  );
}
