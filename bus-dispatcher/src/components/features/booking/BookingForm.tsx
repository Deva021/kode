'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { createReservation, confirmReservation, getReservationByToken, ScheduleWithRoute, getBookedSeats } from '@/lib/api';
import { PrimaryButton, OutlineButton } from '@/components/ui/buttons';
import { ArrowLeft, CheckCircle, AlertCircle, User, Shield, Ticket, Search } from 'lucide-react';
import SeatMap from './SeatMap';
import clsx from 'clsx';
import { useAuth } from '@/context/AuthContext';


// Validation Schemas
const reservationSchema = z.object({
  passengerName: z.string().min(2, 'Name must be at least 2 characters'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  // seatNumbers handled by state, validated manually
});

const confirmationSchema = z.object({
  token: z.string().min(6, 'Token must be 6 characters').max(6, 'Token must be 6 characters'),
});

type ReservationFormValues = z.infer<typeof reservationSchema>;
type ConfirmationFormValues = z.infer<typeof confirmationSchema>;

interface BookingFormProps {
  schedule: ScheduleWithRoute;
}


export default function BookingForm({ schedule }: BookingFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  
  // Set initial tab based on auth state
  const [activeTab, setActiveTab] = useState<'reservation' | 'confirmation'>('reservation');

  useEffect(() => {
    if (user) {
      setActiveTab('confirmation');
    } else {
      setActiveTab('reservation');
    }
  }, [user]);
  
  // Reservation State
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [bookedSeats, setBookedSeats] = useState<number[]>([]);
  const [loadingSeats, setLoadingSeats] = useState(true);
  const [reservationSuccess, setReservationSuccess] = useState<{ token: string; seats: number[] } | null>(null);
  
  // Confirmation State
  const [foundReservation, setFoundReservation] = useState<{ tickets: any[] } | null>(null);
  const [confirmationSuccess, setConfirmationSuccess] = useState(false);

  // Common State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forms
  const reservationForm = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
  });

  const confirmationForm = useForm<ConfirmationFormValues>({
    resolver: zodResolver(confirmationSchema),
  });

  // Fetch booked seats
  useEffect(() => {
    const fetchSeats = async () => {
      const seats = await getBookedSeats(schedule.id);
      setBookedSeats(seats);
      setLoadingSeats(false);
    };
    fetchSeats();
  }, [schedule.id, reservationSuccess, confirmationSuccess]);

  // Handle Seat Selection
  const handleSeatSelect = (seatNumber: number) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  // Submit Reservation
  const onReservationSubmit = async (data: ReservationFormValues) => {
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await createReservation(
      schedule.id,
      data.passengerName,
      selectedSeats,
      data.phoneNumber,
      data.email
    );

    if (result.success && result.token) {
      setReservationSuccess({ token: result.token, seats: selectedSeats });
      setSelectedSeats([]);
      reservationForm.reset();
    } else {
      setError(result.error || 'Failed to create reservation.');
    }

    setIsSubmitting(false);
  };

  // Search Reservation
  const onSearchReservation = async (data: ConfirmationFormValues) => {
    setIsSubmitting(true);
    setError(null);
    setFoundReservation(null);

    const result = await getReservationByToken(data.token);

    if (result.error) {
      setError(result.error);
    } else {
      setFoundReservation({ tickets: result.tickets });
    }

    setIsSubmitting(false);
  };

  // Confirm Reservation
  const onConfirmReservation = async () => {
    if (!foundReservation) return;
    
    setIsSubmitting(true);
    const token = foundReservation.tickets[0].reservation_token;
    
    const result = await confirmReservation(token);
    
    if (result.success) {
      setConfirmationSuccess(true);
      setFoundReservation(null);
      confirmationForm.reset();
    } else {
      setError(result.error || 'Failed to confirm reservation.');
    }
    
    setIsSubmitting(false);
  };

  // Render Success Screens
  if (reservationSuccess) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md mx-auto border border-green-100">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <Ticket size={48} className="text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reservation Successful!</h2>
        <p className="text-gray-600 mb-4">
          Your seats have been reserved for 10 minutes.
        </p>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
          <p className="text-sm text-blue-600 mb-1">Your Reservation Token</p>
          <p className="text-3xl font-mono font-bold text-blue-800 tracking-wider">
            {reservationSuccess.token}
          </p>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Please present this token to an agent to complete your payment and confirm your booking.
        </p>
        <PrimaryButton onClick={() => setReservationSuccess(null)} className="w-full justify-center">
          Make Another Reservation
        </PrimaryButton>
      </div>
    );
  }

  if (confirmationSuccess) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md mx-auto border border-green-100">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle size={48} className="text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600 mb-6">
          The reservation has been successfully confirmed and paid.
        </p>
        <PrimaryButton onClick={() => setConfirmationSuccess(false)} className="w-full justify-center">
          Process Next Booking
        </PrimaryButton>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Tabs - Only show if user is logged in (Agent) */}
      {user && (
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 flex gap-1">
            <button
              onClick={() => setActiveTab('reservation')}
              className={clsx(
                'px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors',
                activeTab === 'reservation' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              <User size={16} />
              Customer Reservation
            </button>
            <button
              onClick={() => setActiveTab('confirmation')}
              className={clsx(
                'px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors',
                activeTab === 'confirmation' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              <Shield size={16} />
              Agent Confirmation
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 flex flex-col md:flex-row min-h-[500px]">
        {/* Left Side: Seat Map (Only for Reservation) */}
        {activeTab === 'reservation' && (
          <div className="p-6 md:p-8 bg-gray-50 border-r border-gray-200 md:w-1/2">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Select Seats</h3>
            {loadingSeats ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
              </div>
            ) : (
              <SeatMap
                totalSeats={schedule.total_seats}
                bookedSeats={bookedSeats}
                selectedSeats={selectedSeats}
                onSelect={handleSeatSelect}
                readOnly={false}
              />
            )}
            <p className="text-center text-sm text-gray-500 mt-4">
              {selectedSeats.length} seat(s) selected
            </p>
          </div>
        )}

        {/* Right Side: Form */}
        <div className={clsx('p-6 md:p-8 flex flex-col', activeTab === 'reservation' ? 'md:w-1/2' : 'w-full')}>
          <div className="flex items-center gap-3 mb-6">
            <button 
              onClick={() => router.back()} 
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h2 className="text-xl font-bold text-gray-900">
              {activeTab === 'reservation' ? 'Passenger Details' : 'Confirm Reservation'}
            </h2>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2 text-sm mb-6">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {activeTab === 'reservation' ? (
            /* Reservation Form */
            <form onSubmit={reservationForm.handleSubmit(onReservationSubmit)} className="space-y-5 flex-1 flex flex-col">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Passenger Name</label>
                  <input
                    {...reservationForm.register('passengerName')}
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                    placeholder="Enter full name"
                  />
                  {reservationForm.formState.errors.passengerName && (
                    <p className="text-red-500 text-xs mt-1">{reservationForm.formState.errors.passengerName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input
                    {...reservationForm.register('phoneNumber')}
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                    placeholder="09..."
                  />
                  {reservationForm.formState.errors.phoneNumber && (
                    <p className="text-red-500 text-xs mt-1">{reservationForm.formState.errors.phoneNumber.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email (Optional)</label>
                  <input
                    {...reservationForm.register('email')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                    placeholder="name@example.com"
                  />
                  {reservationForm.formState.errors.email && (
                    <p className="text-red-500 text-xs mt-1">{reservationForm.formState.errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-auto pt-6">
                <div className="flex justify-between items-center mb-4 text-sm font-medium text-gray-700">
                  <span>Total Price:</span>
                  <span className="text-lg text-blue-600 font-bold">
                    {selectedSeats.length * schedule.route.price} ETB
                  </span>
                </div>
                <PrimaryButton
                  type="submit"
                  disabled={isSubmitting || selectedSeats.length === 0}
                  className="w-full justify-center py-3 text-lg shadow-blue-500/30 hover:shadow-blue-500/50"
                >
                  {isSubmitting ? 'Processing...' : 'Reserve Seats'}
                </PrimaryButton>
              </div>
            </form>
          ) : (
            /* Confirmation Form */
            <div className="max-w-md mx-auto w-full">
              {!foundReservation ? (
                <form onSubmit={confirmationForm.handleSubmit(onSearchReservation)} className="space-y-6">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                      <Search size={32} className="text-blue-600" />
                    </div>
                    <p className="text-gray-600">Enter the customer's reservation token to confirm payment.</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Reservation Token</label>
                    <input
                      {...confirmationForm.register('token')}
                      className="w-full px-4 py-3 text-center text-2xl font-mono font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase tracking-widest text-gray-900"
                      placeholder="XXXXXX"
                      maxLength={6}
                    />
                    {confirmationForm.formState.errors.token && (
                      <p className="text-red-500 text-xs mt-1 text-center">{confirmationForm.formState.errors.token.message}</p>
                    )}
                  </div>

                  <PrimaryButton
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full justify-center py-3"
                  >
                    {isSubmitting ? 'Searching...' : 'Find Reservation'}
                  </PrimaryButton>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Reservation Details</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Passenger:</span>
                        <span className="font-medium">{foundReservation.tickets[0].passenger_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Seats:</span>
                        <span className="font-medium">
                          {foundReservation.tickets.map((t: any) => t.seat_number).join(', ')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Destination:</span>
                        <span className="font-medium">{schedule.route.destination}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                        <span className="text-gray-900 font-bold">Total to Pay:</span>
                        <span className="text-green-600 font-bold text-lg">
                          {foundReservation.tickets.length * schedule.route.price} ETB
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <OutlineButton 
                      onClick={() => setFoundReservation(null)}
                      className="flex-1 justify-center border-gray-300 text-gray-700"
                    >
                      Cancel
                    </OutlineButton>
                    <PrimaryButton
                      onClick={onConfirmReservation}
                      disabled={isSubmitting}
                      className="flex-1 justify-center bg-green-600 hover:bg-green-700 shadow-green-500/30"
                    >
                      {isSubmitting ? 'Confirming...' : 'Confirm Payment'}
                    </PrimaryButton>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
