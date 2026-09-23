'use client';

import React, { useState, useEffect } from 'react';
import { CalendarDays, Plus, Clock, MapPin, Trash2, CheckCircle2, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Appointment } from '@/types/pregnancy';
import { getSavedAppointments, saveAppointments } from '@/lib/storage/local-storage';
import { toDateString, getTodayDate, parseLocalDate } from '@/lib/date/date-utils';

export function AppointmentsView() {
  const { t, formatDate, language } = useLanguage();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [doctorName, setDoctorName] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [apptDate, setApptDate] = useState(toDateString(getTodayDate()));
  const [apptTime, setApptTime] = useState('10:00');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setAppointments(getSavedAppointments());
  }, []);

  const handleSaveAppt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName.trim() || !apptDate) return;

    const newAppt: Appointment = {
      id: `appt_${Date.now()}`,
      doctorName: doctorName.trim(),
      location: clinicName.trim() || undefined,
      date: apptDate,
      time: apptTime || undefined,
      notes: notes.trim() || undefined,
      isCompleted: false,
    };

    const updated = [newAppt, ...appointments].sort((a, b) => (a.date > b.date ? 1 : -1));
    setAppointments(updated);
    saveAppointments(updated);

    // Reset
    setDoctorName('');
    setClinicName('');
    setNotes('');
    setShowAddForm(false);
  };

  const toggleCompleted = (id: string) => {
    const updated = appointments.map((a) =>
      a.id === id ? { ...a, isCompleted: !a.isCompleted } : a
    );
    setAppointments(updated);
    saveAppointments(updated);
  };

  const handleDelete = (id: string) => {
    const updated = appointments.filter((a) => a.id !== id);
    setAppointments(updated);
    saveAppointments(updated);
  };

  const today = getTodayDate();
  const upcomingList = appointments.filter((a) => {
    const d = parseLocalDate(a.date);
    return d && d >= today && !a.isCompleted;
  });

  const pastList = appointments.filter((a) => {
    const d = parseLocalDate(a.date);
    return (d && d < today) || a.isCompleted;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 dark:text-white">
            {t.appointments.title}
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 dark:text-charcoal-400 mt-1">
            {t.appointments.subtitle}
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-soft flex items-center space-x-1.5 transition self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>{t.appointments.newAppt}</span>
        </button>
      </div>

      {/* Add Appointment Modal/Form */}
      {showAddForm && (
        <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-rose-200 dark:border-charcoal-700 shadow-soft-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-charcoal-900 dark:text-white flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-rose-500" />
              <span>{t.appointments.newAppt}</span>
            </h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="p-1 rounded-lg text-charcoal-400 hover:text-charcoal-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSaveAppt} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-300 mb-1">
                  {t.appointments.doctorName} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={language === 'bn' ? 'যেমন: ডা. ফারহানা চৌধুরী' : 'e.g. Dr. Emily Watson'}
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-300 mb-1">
                  {t.appointments.location}
                </label>
                <input
                  type="text"
                  placeholder={language === 'bn' ? 'যেমন: স্কয়ার হাসপাতাল' : 'e.g. City Hospital / Women Clinic'}
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-300 mb-1">
                  {t.calendar.selectedDate} *
                </label>
                <input
                  type="date"
                  required
                  value={apptDate}
                  onChange={(e) => setApptDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-300 mb-1">
                  {language === 'bn' ? 'সময়' : 'Time'}
                </label>
                <input
                  type="time"
                  value={apptTime}
                  onChange={(e) => setApptTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-300 mb-1">
                {t.appointments.notes}
              </label>
              <textarea
                rows={2}
                placeholder={language === 'bn' ? 'আল্ট্রাসাউন্ড স্ক্যান বা কোনো বিশেষ জিজ্ঞাসা...' : 'Routine scan or topics to discuss...'}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-charcoal-500 hover:bg-rose-50"
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-soft transition"
              >
                {t.common.save}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Upcoming Visits */}
      <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-rose-100 dark:border-charcoal-800 shadow-soft">
        <h3 className="text-base font-bold text-charcoal-900 dark:text-white mb-4">
          {t.appointments.upcoming} ({upcomingList.length})
        </h3>

        {upcomingList.length > 0 ? (
          <div className="space-y-3">
            {upcomingList.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-lavender-50/40 dark:bg-charcoal-800/60 border border-lavender-100 dark:border-charcoal-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className="font-bold text-sm text-charcoal-900 dark:text-white mb-1">
                    {item.doctorName}
                  </h4>
                  <div className="flex flex-wrap items-center gap-3 text-charcoal-500 dark:text-charcoal-400">
                    <span className="flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDate(item.date)} {item.time ? `• ${item.time}` : ''}
                    </span>
                    {item.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {item.location}
                      </span>
                    )}
                  </div>
                  {item.notes && (
                    <p className="mt-2 text-charcoal-600 dark:text-charcoal-300 italic">
                      &ldquo;{item.notes}&rdquo;
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 self-start sm:self-center">
                  <button
                    onClick={() => toggleCompleted(item.id)}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 text-charcoal-700 dark:text-charcoal-200 hover:text-emerald-600 text-xs font-medium transition"
                  >
                    {t.appointments.markCompleted}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-charcoal-400 hover:text-red-500 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-charcoal-400 text-center py-4">
            {t.appointments.noUpcoming}
          </p>
        )}
      </div>

      {/* Past Visits */}
      {pastList.length > 0 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-rose-100 dark:border-charcoal-800 shadow-soft">
          <h3 className="text-base font-bold text-charcoal-900 dark:text-white mb-4">
            {t.appointments.past} ({pastList.length})
          </h3>

          <div className="divide-y divide-rose-50 dark:divide-charcoal-800">
            {pastList.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-charcoal-900 dark:text-white">
                      {item.doctorName}
                    </span>
                    {item.isCompleted && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </div>
                  <span className="text-charcoal-400 text-[11px] block mt-0.5">
                    {formatDate(item.date)} {item.location ? `• ${item.location}` : ''}
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1 rounded-lg text-charcoal-400 hover:text-red-500 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
