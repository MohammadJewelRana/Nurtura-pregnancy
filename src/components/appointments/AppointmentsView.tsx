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
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            {t.appointments.title}
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            {t.appointments.subtitle}
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald hover:bg-emerald-dark text-navy-bg text-xs font-bold shadow-subtle flex items-center space-x-1.5 transition self-start sm:self-center"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{t.appointments.newAppt}</span>
        </button>
      </div>

      {/* Add Appointment Modal/Form */}
      {showAddForm && (
        <div className="p-6 rounded-2xl bg-navy-surface border border-emerald/40 shadow-premium space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-emerald" />
              <span>{t.appointments.newAppt}</span>
            </h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="p-1 rounded-lg text-text-muted hover:text-text-primary"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSaveAppt} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  {t.appointments.doctorName} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={language === 'bn' ? 'যেমন: ডা. ফারহানা চৌধুরী' : 'e.g. Dr. Emily Watson'}
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-navy-border bg-navy-elevated text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-emerald/40 placeholder:text-text-muted"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  {t.appointments.location}
                </label>
                <input
                  type="text"
                  placeholder={language === 'bn' ? 'যেমন: স্কয়ার হাসপাতাল' : 'e.g. City Hospital / Women Clinic'}
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-navy-border bg-navy-elevated text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-emerald/40 placeholder:text-text-muted"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  {t.calendar.selectedDate} *
                </label>
                <input
                  type="date"
                  required
                  value={apptDate}
                  onChange={(e) => setApptDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-navy-border bg-navy-elevated text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-emerald/40"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  {language === 'bn' ? 'সময়' : 'Time'}
                </label>
                <input
                  type="time"
                  value={apptTime}
                  onChange={(e) => setApptTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-navy-border bg-navy-elevated text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-emerald/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">
                {t.appointments.notes}
              </label>
              <textarea
                rows={2}
                placeholder={language === 'bn' ? 'আল্ট্রাসাউন্ড স্ক্যান বা কোনো বিশেষ জিজ্ঞাসা...' : 'Routine scan or topics to discuss...'}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-navy-border bg-navy-elevated text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-emerald/40 placeholder:text-text-muted"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-text-muted hover:text-text-primary"
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald hover:bg-emerald-dark text-navy-bg text-xs font-bold shadow-subtle transition"
              >
                {t.common.save}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Upcoming Visits */}
      <div className="p-6 rounded-2xl bg-navy-surface border border-navy-border shadow-premium">
        <h3 className="text-base font-bold text-text-primary mb-4">
          {t.appointments.upcoming} ({upcomingList.length})
        </h3>

        {upcomingList.length > 0 ? (
          <div className="space-y-3">
            {upcomingList.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-navy-elevated border border-navy-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className="font-bold text-sm text-text-primary mb-1">
                    {item.doctorName}
                  </h4>
                  <div className="flex flex-wrap items-center gap-3 text-text-muted">
                    <span className="flex items-center gap-1 font-semibold text-emerald">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDate(item.date)} {item.time ? `• ${item.time}` : ''}
                    </span>
                    {item.location && (
                      <span className="flex items-center gap-1 text-text-secondary">
                        <MapPin className="w-3.5 h-3.5 text-emerald-accent" />
                        {item.location}
                      </span>
                    )}
                  </div>
                  {item.notes && (
                    <p className="mt-2 text-text-muted italic">
                      &ldquo;{item.notes}&rdquo;
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 self-start sm:self-center">
                  <button
                    onClick={() => toggleCompleted(item.id)}
                    className="px-3 py-1.5 rounded-lg bg-navy-surface border border-navy-border text-text-secondary hover:text-emerald text-xs font-medium transition"
                  >
                    {t.appointments.markCompleted}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-state-danger transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-text-muted text-center py-4">
            {t.appointments.noUpcoming}
          </p>
        )}
      </div>

      {/* Past Visits */}
      {pastList.length > 0 && (
        <div className="p-6 rounded-2xl bg-navy-surface border border-navy-border shadow-subtle">
          <h3 className="text-base font-bold text-text-primary mb-4">
            {t.appointments.past} ({pastList.length})
          </h3>

          <div className="divide-y divide-navy-border">
            {pastList.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-text-primary">
                      {item.doctorName}
                    </span>
                    {item.isCompleted && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald" />
                    )}
                  </div>
                  <span className="text-text-muted text-[11px] block mt-0.5">
                    {formatDate(item.date)} {item.location ? `• ${item.location}` : ''}
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1 rounded-lg text-text-muted hover:text-state-danger transition"
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
