// // import React, { useEffect, useState } from 'react';
// // import { useAuth } from '../context/AuthContext';
// // import { getAppointments, api } from '../services/api';
// //
// // const DoctorProfile = () => {
// //     const { user, updateUser } = useAuth();
// //     const [appointments, setAppointments] = useState([]);
// //     const [formData, setFormData] = useState({ imie: '', nazwisko: '', specialty: '' });
// //
// //     useEffect(() => {
// //         if (user) {
// //             setFormData({
// //                 imie: user.imie || '',
// //                 nazwisko: user.nazwisko || '',
// //                 specialty: user.specialty || '',
// //             });
// //             fetchAppointments();
// //         }
// //     }, [user]);
// //
// //     const fetchAppointments = async () => {
// //         try {
// //             const response = await getAppointments();
// //             setAppointments(response.data.filter((a) => a.doctorId?._id === user._id));
// //         } catch (err) {
// //             console.error('Error fetching appointments:', err);
// //         }
// //     };
// //
// //     const handleUpdateProfile = async (e) => {
// //         e.preventDefault();
// //         try {
// //             const response = await api.put(`/users/${user._id}`, formData);
// //             if (response.success) {
// //                 updateUser({ ...user, ...formData });
// //                 alert('Profil zaktualizowany!');
// //             }
// //         } catch (err) {
// //             console.error('Error updating profile:', err);
// //             alert('Błąd aktualizacji profilu.');
// //         }
// //     };
// //
// //     return (
// //         <div className="doctor-profile">
// //             <h1>Profil Lekarza</h1>
// //
// //             {/* Форма для оновлення профілю */}
// //             <form onSubmit={handleUpdateProfile}>
// //                 <input
// //                     type="text"
// //                     value={formData.imie}
// //                     onChange={(e) => setFormData({ ...formData, imie: e.target.value })}
// //                     placeholder="Imię"
// //                 />
// //                 <input
// //                     type="text"
// //                     value={formData.nazwisko}
// //                     onChange={(e) => setFormData({ ...formData, nazwisko: e.target.value })}
// //                     placeholder="Nazwisko"
// //                 />
// //                 <input
// //                     type="text"
// //                     value={formData.specialty}
// //                     onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
// //                     placeholder="Specjalność"
// //                 />
// //                 <button type="submit">Zaktualizuj</button>
// //             </form>
// //
// //             {/* Список прийомів */}
// //             <h2>Wizyty Pacjentów</h2>
// //             <ul>
// //                 {appointments.map((appointment) => (
// //                     <li key={appointment._id}>
// //                         {appointment.date} - {appointment.time} (Pacjent: {appointment.patientId?.imie} {appointment.patientId?.nazwisko})
// //                     </li>
// //                 ))}
// //             </ul>
// //         </div>
// //     );
// // };
// //
// // export default DoctorProfile;
//
// import React, { useEffect, useState } from 'react';
// import styled from 'styled-components';
// import { useAuth } from '../context/AuthContext';
// import { getAppointments, api } from '../services/api';
//
// const DoctorProfile = () => {
//     const { user, updateUser } = useAuth();
//     const [appointments, setAppointments] = useState([]);
//     const [formData, setFormData] = useState({ imie: '', nazwisko: '', specialty: '' });
//     const [isLoading, setIsLoading] = useState(true);
//     const [feedback, setFeedback] = useState('');
//
//     useEffect(() => {
//         if (user) {
//             setFormData({
//                 imie: user.imie || '',
//                 nazwisko: user.nazwisko || '',
//                 specialty: user.specialty || '',
//             });
//             fetchAppointments();
//         }
//     }, [user]);
//
//     const fetchAppointments = async () => {
//         try {
//             setIsLoading(true);
//             const response = await getAppointments();
//             setAppointments(response.data.filter((a) => a.doctorId?._id === user._id));
//             setIsLoading(false);
//         } catch (err) {
//             console.error('Error fetching appointments:', err);
//             setIsLoading(false);
//             setFeedback('Nie udało się załadować wizyt.');
//         }
//     };
//
//     const handleUpdateProfile = async (e) => {
//         e.preventDefault();
//         setFeedback('');
//         try {
//             const response = await api.put(`/users/${user._id}`, formData);
//             if (response.success) {
//                 updateUser({ ...user, ...formData });
//                 setFeedback('Profil zaktualizowany!');
//             }
//         } catch (err) {
//             console.error('Error updating profile:', err);
//             setFeedback('Błąd aktualizacji profilu.');
//         }
//     };
//
//     if (isLoading) {
//         return <Loading>Ładowanie danych...</Loading>;
//     }
//
//     return (
//         <Wrapper>
//             <Header>
//                 <h1>Witaj, {user?.imie}!</h1>
//             </Header>
//
//             {/* Форма оновлення профілю */}
//             <Section>
//                 <SectionTitle>Twój profil</SectionTitle>
//                 {feedback && <Feedback>{feedback}</Feedback>}
//                 <form onSubmit={handleUpdateProfile}>
//                     <Input
//                         type="text"
//                         value={formData.imie}
//                         onChange={(e) => setFormData({ ...formData, imie: e.target.value })}
//                         placeholder="Imię"
//                         required
//                     />
//                     <Input
//                         type="text"
//                         value={formData.nazwisko}
//                         onChange={(e) => setFormData({ ...formData, nazwisko: e.target.value })}
//                         placeholder="Nazwisko"
//                         required
//                     />
//                     <Input
//                         type="text"
//                         value={formData.specialty}
//                         onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
//                         placeholder="Specjalność"
//                     />
//                     <Button type="submit">Zaktualizuj profil</Button>
//                 </form>
//             </Section>
//
//             {/* Список прийомів */}
//             <Section>
//                 <SectionTitle>Wizyty pacjentów</SectionTitle>
//                 {appointments.length > 0 ? (
//                     <AppointmentList>
//                         {appointments.map((appointment) => (
//                             <AppointmentItem key={appointment._id}>
//                                 <p>
//                                     <b>Data wizyty:</b> {new Date(appointment.date).toLocaleDateString()} -{' '}
//                                     <b>Godzina:</b> {appointment.time}
//                                 </p>
//                                 <p>
//                                     <b>Pacjent:</b> {appointment.patientId?.imie} {appointment.patientId?.nazwisko}
//                                 </p>
//                                 <p>
//                                     <b>Powód:</b> {appointment.message || 'Nie podano'}
//                                 </p>
//                             </AppointmentItem>
//                         ))}
//                     </AppointmentList>
//                 ) : (
//                     <NoDataMessage>Nie masz jeszcze żadnych wizyt.</NoDataMessage>
//                 )}
//             </Section>
//         </Wrapper>
//     );
// };
//
// const Wrapper = styled.div`
//     max-width: 900px;
//     margin: 40px auto;
//     padding: 20px;
//     background: #f0f8ff;
//     border-radius: 10px;
//     box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
// `;
//
// const Header = styled.div`
//     text-align: center;
//     color: #333;
//
//     h1 {
//         font-size: 2em;
//         margin-bottom: 10px;
//         color: #0275d8; /* Синій */
//     }
// `;
//
// const Section = styled.div`
//     margin-bottom: 30px;
//     padding: 20px;
//     background: #ffffff;
//     border-radius: 10px;
//     box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
// `;
//
// const SectionTitle = styled.h2`
//     font-size: 1.5em;
//     color: #0275d8;
//     margin-bottom: 15px;
// `;
//
// const Feedback = styled.p`
//     color: green;
//     margin-bottom: 15px;
//     font-size: 1em;
// `;
//
// const Input = styled.input`
//     width: 100%;
//     padding: 10px;
//     margin-bottom: 20px;
//     font-size: 1em;
//     border: 1px solid #ddd;
//     border-radius: 5px;
//
//     &:focus {
//         outline: none;
//         border-color: #0275d8;
//     }
// `;
//
// const Button = styled.button`
//     background: #0275d8;
//     color: white;
//     border: none;
//     padding: 10px 15px;
//     font-size: 1em;
//     border-radius: 5px;
//     cursor: pointer;
//
//     &:hover {
//         background: #025aa5;
//     }
// `;
//
// const AppointmentList = styled.ul`
//     list-style: none;
//     padding: 0;
// `;
//
// const AppointmentItem = styled.li`
//     background: #f9f9f9;
//     border: 1px solid #ddd;
//     border-radius: 8px;
//     padding: 15px;
//     margin-bottom: 15px;
//     box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
// `;
//
// const NoDataMessage = styled.p`
//     text-align: center;
//     font-size: 1em;
//     color: #aaa;
// `;
//
// const Loading = styled.div`
//     text-align: center;
//     font-size: 1.2em;
//     color: #555;
// `;
//
// export default DoctorProfile;


import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { getAppointments, api } from '../services/api';

const DoctorProfile = () => {
    const { user, updateUser } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [formData, setFormData] = useState({ imie: '', nazwisko: '', specialty: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                imie: user.imie || '',
                nazwisko: user.nazwisko || '',
                specialty: user.specialty || '',
            });
            fetchAppointments();
        }
    }, [user]);

    const fetchAppointments = async () => {
        try {
            setIsLoading(true);
            const response = await getAppointments();
            setAppointments(response.data.filter((a) => a.doctorId?._id === user._id));
            setIsLoading(false);
        } catch (err) {
            console.error('Failed to fetch appointments:', err);
            setIsLoading(false);
        }
    };

    const isAppointmentTimeAvailable = (date, time) => {
        return !appointments.some((appointment) => appointment.date === date && appointment.time === time);
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`/users/${user._id}`, formData);
            if (response.success) {
                updateUser({ ...user, ...formData });
                alert('Profil zaktualizowany!');
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            alert('Błąd aktualizacji profilu.');
        }
    };

    const handleEditAppointment = (appointment) => {
        setErrorMessage('');
        setEditingAppointment({ ...appointment });
    };

    const handleSaveAppointment = async () => {
        if (!isAppointmentTimeAvailable(editingAppointment.date, editingAppointment.time)) {
            setErrorMessage('Czas wizyty jest już zajęty. Wybierz inną datę lub godzinę.');
            return;
        }

        try {
            await api.put(`/appointments/${editingAppointment._id}`, {
                ...editingAppointment,
            });
            setEditingAppointment(null);
            setErrorMessage('');
            fetchAppointments();
        } catch (err) {
            console.error('Failed to update appointment:', err);
        }
    };

    const handleDeleteAppointment = async (id) => {
        if (!window.confirm('Czy na pewno chcesz usunąć tę wizytę?')) return;
        try {
            await api.delete(`/appointments/${id}`);
            fetchAppointments();
        } catch (err) {
            console.error('Failed to delete appointment:', err);
        }
    };

    if (isLoading) {
        return <Loading>Ładowanie danych...</Loading>;
    }

    return (
        <Wrapper>
            <Header>
                <h1>Witaj, {user?.imie}!</h1>
                <Subtitle>{user?.imie} {user?.nazwisko} • {user?.specialty}</Subtitle>
            </Header>

            {/* Форма оновлення профілю */}
            <Section>
                <SectionTitle>Twój profil</SectionTitle>
                <form onSubmit={handleUpdateProfile}>
                    <Input
                        type="text"
                        value={formData.imie}
                        onChange={(e) => setFormData({ ...formData, imie: e.target.value })}
                        placeholder="Imię"
                        required
                    />
                    <Input
                        type="text"
                        value={formData.nazwisko}
                        onChange={(e) => setFormData({ ...formData, nazwisko: e.target.value })}
                        placeholder="Nazwisko"
                        required
                    />
                    <Input
                        type="text"
                        value={formData.specialty}
                        onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                        placeholder="Specjalność"
                        required
                    />
                    <Button type="submit">Zaktualizuj profil</Button>
                </form>
            </Section>

            {/* Список прийомів */}
            <Section>
                <SectionTitle>Wizyty pacjentów</SectionTitle>
                {appointments.length ? (
                    <AppointmentList>
                        {appointments.map((appointment) => (
                            <AppointmentItem key={appointment._id}>
                                {editingAppointment && editingAppointment._id === appointment._id ? (
                                    <>
                                        <Input
                                            type="date"
                                            value={editingAppointment.date}
                                            onChange={(e) => {
                                                setEditingAppointment({ ...editingAppointment, date: e.target.value });
                                                setErrorMessage('');
                                            }}
                                        />
                                        <Input
                                            type="time"
                                            value={editingAppointment.time}
                                            onChange={(e) => {
                                                setEditingAppointment({ ...editingAppointment, time: e.target.value });
                                                setErrorMessage('');
                                            }}
                                        />
                                        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
                                        <Actions>
                                            <ActionButton onClick={handleSaveAppointment}>Zapisz</ActionButton>
                                            <ActionButtonCancel onClick={() => setEditingAppointment(null)}>
                                                Anuluj
                                            </ActionButtonCancel>
                                        </Actions>
                                    </>
                                ) : (
                                    <>
                                        <p>
                                            <b>Data:</b> {appointment.date} <b>Godzina:</b> {appointment.time}
                                        </p>
                                        <p>
                                            <b>Pacjent:</b> {appointment.patientId?.imie}{' '}
                                            {appointment.patientId?.nazwisko}
                                        </p>
                                        <Actions>
                                            <ActionButton onClick={() => handleEditAppointment(appointment)}>
                                                Edytuj
                                            </ActionButton>
                                            <ActionButtonCancel
                                                onClick={() => handleDeleteAppointment(appointment._id)}
                                            >
                                                Usuń
                                            </ActionButtonCancel>
                                        </Actions>
                                    </>
                                )}
                            </AppointmentItem>
                        ))}
                    </AppointmentList>
                ) : (
                    <NoDataMessage>Brak wizyt.</NoDataMessage>
                )}
            </Section>
        </Wrapper>
    );
};

export default DoctorProfile;

// Styled-components
const Wrapper = styled.div`
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    border-radius: 12px;
    background: #fefefe;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    font-family: 'Arial', sans-serif;
`;

const Header = styled.div`
    text-align: center;
    margin-bottom: 20px;

    h1 {
        font-size: 2em;
        color: #0275d8;
    }
`;

const Subtitle = styled.p`
    font-size: 1.2em;
    color: #555;
    margin-top: 8px;
`;

const Section = styled.div`
    margin-bottom: 30px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 10px;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
    font-size: 1.6em;
    font-weight: bold;
    color: #0275d8;
    margin-bottom: 20px;
`;

const Input = styled.input`
    padding: 10px;
    font-size: 1em;
    border: 1px solid #ddd;
    border-radius: 5px;
    width: 100%;

    &:focus {
        outline: none;
        border: 1px solid #0275d8;
    }
`;

const Button = styled.button`
    padding: 10px 15px;
    font-size: 1em;
    background: #0275d8;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background: #025aa5;
    }
`;

const AppointmentList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const AppointmentItem = styled.div`
    padding: 15px;
    background: #ffffff;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Actions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
`;

const ActionButton = styled.button`
    background: #0275d8;
    color: white;
    border: none;
    padding: 5px 10px;
    font-size: 0.9em;
    border-radius: 4px;

    &:hover {
        background: #025aa5;
        cursor: pointer;
    }
`;

const ActionButtonCancel = styled(ActionButton)`
    background: #dc3545;

    &:hover {
        background: #c82333;
    }
`;

const ErrorMessage = styled.div`
    color: #dc3545;
    font-size: 0.9em;
    margin-top: 10px;
`;

const NoDataMessage = styled.p`
    font-size: 1em;
    color: #999;
    text-align: center;
`;

const Loading = styled.div`
    font-size: 1.2em;
    color: #555;
    text-align: center;
`;