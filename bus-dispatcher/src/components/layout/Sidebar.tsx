import React from 'react';
import { Building2, Newspaper, Info } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="bg-white border-l border-gray-200 p-6 min-h-screen flex flex-col">
      <div className="flex-1 space-y-8">
        {/* Company Info Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <Building2 size={24} className="text-blue-600" />
            About KodeTech
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            KodeTech is committed to providing reliable and efficient bus dispatch services across Ethiopia. 
            We connect travelers with safe and comfortable transportation options.
          </p>
        </div>

        {/* News/Blog Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <Newspaper size={24} className="text-blue-600" />
            Latest Updates
          </div>
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="font-semibold text-sm text-gray-800 mb-1">
                New Routes Available
              </h4>
              <p className="text-xs text-gray-600">
                We've expanded our services to include more destinations. Check out our latest schedules!
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <h4 className="font-semibold text-sm text-gray-800 mb-1">
                Safety First
              </h4>
              <p className="text-xs text-gray-600">
                All our buses undergo regular safety inspections to ensure your journey is safe and comfortable.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <Info size={24} className="text-blue-600" />
            Travel Tips
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Arrive at the station 30 minutes before departure</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Keep your ticket and ID ready for verification</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Limited luggage space available - pack light</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-1">
          <span>©</span>
          <span>{new Date().getFullYear()} Copyright reserved for KodeTech</span>
        </p>
      </div>
    </aside>
  );
}
