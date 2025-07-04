import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUsers, deleteUser, register, createAppointment, getAppointments } from '../services/api';

const AdminPanel = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ imie: '', nazwisko: '', email: '', haslo: '', role: 'doctor', specialty: '' });
    const [appointment, setAppointment] = useState({ patientId: '', doctorId: '', date: '', time: '' });
    const [appointments, setAppointments] = useState([]);
    const [busySlots, setBusySlots] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
            return;
        }
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const usersData = await getUsers();
                setUsers(Array.isArray(usersData) ? usersData : []);
                const appointmentsData = await getAppointments();
                console.log('Appointments API Response:', appointmentsData); // Debug
                if (appointmentsData.success && Array.isArray(appointmentsData.data)) {
                    setAppointments(appointmentsData.data);
                    const slots = appointmentsData.data.reduce((acc, a) => {
                        const key = `${new Date(a.date).toISOString().split('T')[0]}_${a.time}_${a.doctorId}`;
                        acc[key] = true;
                        return acc;
                    }, {});
                    setBusySlots(slots);
                } else {
                    setAppointments([]);
                    setError('Brak danych o wizytach lub niepoprawna odpowiedź serwera.');
                }
            } catch (error) {
                console.error('Błąd pobierania danych:', error);
                setError('Błąd ładowania danych. Spróbuj ponownie.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, navigate]);

    const handleDelete = async (id) => {
        if (window.confirm('Czy na pewno chcesz usunąć użytkownika?')) {
            const result = await deleteUser(id);
            if (result.success) {
                setUsers(users.filter(u => u._id !== id));
            } else {
                setError(result.message || 'Błąd usuwania użytkownika.');
            }
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        const result = await register(newUser);
        if (result.success) {
            setUsers([...users, { ...newUser, _id: result.data._id }]);
            setNewUser({ imie: '', nazwisko: '', email: '', haslo: '', role: 'doctor', specialty: '' });
        } else {
            alert(result.message);
        }
    };

    const handleBookAppointment = async (e) => {
        e.preventDefault();
        console.log('Appointment data:', appointment);
        const key = `${appointment.date}_${appointment.time}_${appointment.doctorId}`;
        if (busySlots[key]) {
            alert('Ten termin jest już zajęty!');
            return;
        }
        if (appointment.patientId && appointment.doctorId && appointment.date && appointment.time) {
            const result = await createAppointment({
                patientId: appointment.patientId,
                doctorId: appointment.doctorId,
                date: appointment.date,
                time: appointment.time,
                message: '',
                procedure: '', // Added for consistency
                description: '' // Added for consistency
            });
            if (result.success) {
                alert('Wizyta zapisana!');
                setAppointments([...appointments, result.data]); // Update appointments
                setAppointment({ patientId: '', doctorId: '', date: '', time: '' });
                setBusySlots({ ...busySlots, [key]: true });
            } else {
                alert('Błąd: ' + result.message);
            }
        } else {
            alert('Wypełnij wszystkie pola.');
        }
    };

    if (!user || user.role !== 'admin') return null;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Panel Administratora - Dental Clinic</h2>
            {loading && <p>Ładowanie danych...</p>}
            {error && <p className="text-red-500">{error} <button onClick={() => fetchData()} className="ml-2 text-blue-600 underline">Spróbuj ponownie</button></p>}
            <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">Zapisz wizytę</h3>
                <form onSubmit={handleBookAppointment} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Pacjent</label>
                        <select
                            value={appointment.patientId}
                            onChange={(e) => setAppointment({ ...appointment, patientId: e.target.value })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Wybierz pacjenta</option>
                            {users.filter(u => u.role === 'patient').map(u => (
                                <option key={u._id} value={u._id}>{u.imie} {u.nazwisko}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Lekarz</label>
                        <select
                            value={appointment.doctorId}
                            onChange={(e) => setAppointment({ ...appointment, doctorId: e.target.value })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Wybierz lekarza</option>
                            {users.filter(u => u.role === 'doctor').map(u => (
                                <option key={u._id} value={u._id}>{u.imie} {u.nazwisko}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Data</label>
                        <input
                            type="date"
                            value={appointment.date}
                            onChange={(e) => setAppointment({ ...appointment, date: e.target.value })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Godzina</label>
                        <select
                            value={appointment.time}
                            onChange={(e) => setAppointment({ ...appointment, time: e.target.value })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Wybierz godzinę</option>
                            {['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
                    >
                        Zapisz wizytę
                    </button>
                </form>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">Lista Użytkowników</h3>
                {users.length === 0 ? (
                    <p className="text-gray-500">Brak użytkowników.</p>
                ) : (
                    <ul className="space-y-4">
                        {users.map(user => (
                            <li key={user._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
                                <span>{user.imie} {user.nazwisko} ({user.email}, {user.role})</span>
                                <button
                                    onClick={() => handleDelete(user._id)}
                                    className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition"
                                >
                                    Usuń
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">Dodaj Użytkownika</h3>
                <form onSubmit={handleAddUser} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Imię</label>
                        <input
                            type="text"
                            value={newUser.imie}
                            onChange={(e) => setNewUser({ ...newUser, imie: e.target.value })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nazwisko</label>
                        <input
                            type="text"
                            value={newUser.nazwisko}
                            onChange={(e) => setNewUser({ ...newUser, nazwisko: e.target.value })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Hasło</label>
                        <input
                            type="password"
                            value={newUser.haslo}
                            onChange={(e) => setNewUser({ ...newUser, haslo: e.target.value })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Rola</label>
                        <select
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="doctor">Lekarz</option>
                            <option value="admin">Admin</option>
                            <option value="patient">Pacjent</option>
                        </select>
                    </div>
                    {newUser.role === 'doctor' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Specjalność</label>
                            <input
                                type="text"
                                value={newUser.specialty}
                                onChange={(e) => setNewUser({ ...newUser, specialty: e.target.value })}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
                    >
                        Dodaj
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminPanel;