import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { FaXmark } from 'react-icons/fa6';

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Appointment = () => {
  const patients = ['John Doe', 'Jane Smith', 'Alice Johnson'];
  const doctors = ['Dr. Strange', 'Dr. House', 'Dr. Grey'];

  const [formData, setFormData] = useState({
    id: '',
    title: '',
    doctor: '',
    time: null,
    start: null,
    end: null,
  });
  const [darkMode, setDarkMode] = useState(false);
  const [appointment, setAppointment] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [edit, setEdit] = useState(false);

  const selectEvent = ({ start, end }) => {
    setFormOpen(true);
    const randomId = Math.floor(Math.random() * 100000);
    setFormData({ ...formData, id: randomId, start, end });
  };

  const handleEventSubmit = (e) => {
    e.preventDefault();
    setAppointment([...appointment, formData]);
    resetForm();
  };

  const handleSelectedEvent = (e) => {
    setFormOpen(true);
    setEdit(true);
    setFormData({ ...e });
  };

  const handleCloseModal = () => {
    resetForm();
  };

  const resetForm = () => {
    setFormOpen(false);
    setEdit(false);
    setFormData({
      id: '',
      title: '',
      doctor: '',
      time: null,
      start: null,
      end: null,
    });
  };

  const editAppointment = () => {
    const updatedAppointments = appointment.map((item) =>
      item.id === formData.id ? formData : item
    );
    setAppointment(updatedAppointments);
    alert('Appointment updated');
    resetForm();
  };

  const deleteAppointment = () => {
    const updatedAppointments = appointment.filter((item) => item.id !== formData.id);
    setAppointment(updatedAppointments);
    alert('Appointment deleted');
    resetForm();
  };

  const isSelectable = ({ start }) => {
    const day = start.getDay();
    return !(day === 0 || day === 6);
  };

  const CustomEvent = ({ event }) => (
    <div className="p-1 px-2 rounded-lg bg-gradient-to-r from-sky-500 to-sky-700 text-white text-xs shadow">
      <div className="font-semibold truncate">{event.title}</div>
      <div className="opacity-80">{event.time}</div>
    </div>
  );

  return (
    <div className={`${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100'} min-h-screen`}>
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 shadow-md">
        <h1 className="text-xl font-bold text-sky-700 dark:text-emerald-400">Clinic Appointment Calendar</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="rounded px-4 py-2 bg-sky-600 text-white dark:bg-emerald-500 dark:text-black hover:opacity-90"
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </header>

      {/* Calendar */}
      <main className="p-4">
        <div className="rounded-lg overflow-hidden shadow ring-1 ring-gray-200 dark:ring-gray-700">
          <Calendar
            selectable
            localizer={localizer}
            events={appointment}
            startAccessor="start"
            endAccessor="end"
            onSelectSlot={(slot) =>
              isSelectable(slot)
                ? selectEvent(slot)
                : alert('No appointments on Saturday or Sunday')
            }
            onSelectEvent={handleSelectedEvent}
            components={{ event: CustomEvent }}
            style={{ height: 500 }}
            className="bg-white dark:bg-gray-800"
            toolbar={false}
          />
        </div>
      </main>

      {/* Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-sky-600 dark:text-emerald-400">
                {edit ? 'Edit Appointment' : 'New Appointment'}
              </h2>
              <FaXmark
                onClick={handleCloseModal}
                className="cursor-pointer text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              />
            </div>

            <form onSubmit={handleEventSubmit} className="space-y-4">
              {/* Patient */}
              <div>
                <label className="block text-sm font-medium">Patient</label>
                <select
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full mt-1 p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                >
                  <option value="">Select Patient</option>
                  {patients.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Doctor */}
              <div>
                <label className="block text-sm font-medium">Doctor</label>
                <select
                  required
                  value={formData.doctor}
                  onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                  className="w-full mt-1 p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium">Time</label>
                <input
                  type="time"
                  required
                  value={formData.time || ''}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full mt-1 p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>

              {/* Buttons */}
              {!edit ? (
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Save Appointment
                </button>
              ) : (
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={editAppointment}
                    className="w-1/2 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={deleteAppointment}
                    className="w-1/2 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment;
