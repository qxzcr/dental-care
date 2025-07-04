import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { getAppointments, getMessages, sendMessage } from '../services/api';

const PatientProfile = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [messages, setMessages] = useState([]);
    const [messageContent, setMessageContent] = useState('');
    const [loadingAppointments, setLoadingAppointments] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [feedback, setFeedback] = useState('');

    // Завантаження візитів
    const fetchAppointments = async () => {
        try {
            setLoadingAppointments(true);
            const appointmentsResponse = await getAppointments();
            setAppointments(appointmentsResponse.data || []);
            setLoadingAppointments(false);
        } catch (error) {
            console.error('Błąd podczas pobierania wizyt:', error);
            setLoadingAppointments(false);
        }
    };

    // Завантаження повідомлень
    const fetchMessages = async () => {
        try {
            setLoadingMessages(true);
            const messagesResponse = await getMessages();
            setMessages(messagesResponse.data || []);
            setLoadingMessages(false);
        } catch (error) {
            console.error('Błąd podczas pobierania wiadomości:', error);
            setFeedback('Nie udało się załadować wiadomości. Spróbuj ponownie później.');
            setLoadingMessages(false);
        }
    };

    // Відправлення повідомлення
    const handleSendMessage = async () => {
        setFeedback('');
        if (messageContent.trim() === '') {
            setFeedback('Pole wiadomości nie może być puste.');
            return;
        }

        try {
            const response = await sendMessage({ content: messageContent, to: 'admin' });
            console.log('Odpowiedź serwera:', response);

            if (response.success) {
                setFeedback('Wiadomość została wysłana!');
                setMessageContent('');
                fetchMessages(); // Оновлення списку повідомлень
            } else {
                setFeedback('Nie udało się wysłać wiadomości. Sprawdź swoje dane.');
            }
        } catch (error) {
            console.error('Błąd wysyłania wiadomości:', error);
            setFeedback('Nie udało się wysłać wiadomości. Spróbuj ponownie.');
        }
    };

    useEffect(() => {
        fetchAppointments();
        fetchMessages();
    }, []);

    if (loadingAppointments || loadingMessages) {
        return <LoadingŁadowanie>Ładowanie danych...</LoadingŁadowanie>;
    }

    return (
        <Wrapper>
            <Header>
                <h1>Witaj, {user?.imie}!</h1>
            </Header>

            {/* Список візитів */}
            <Section>
                <SectionTitle>Twoje wizyty:</SectionTitle>
                {appointments.length > 0 ? (
                    <AppointmentList>
                        {appointments.map((appointment) => (
                            <AppointmentItem key={appointment._id}>
                                <p>
                                    <b>Data wizyty:</b> {new Date(appointment.date).toLocaleDateString()} -{' '}
                                    <b>Godzina:</b> {appointment.time}
                                </p>
                                <p>
                                    <b>Lekarz:</b> {appointment.doctorId?.imie} {appointment.doctorId?.nazwisko}
                                </p>
                                <p>
                                    <b>Powód:</b> {appointment.message || 'Nie podano'}
                                </p>
                            </AppointmentItem>
                        ))}
                    </AppointmentList>
                ) : (
                    <NoDataMessage>Nie masz jeszcze żadnych wizyt.</NoDataMessage>
                )}
            </Section>

            {/* Список повідомлень */}
            <Section>
                <SectionTitle>Wiadomości:</SectionTitle>
                {messages.length > 0 ? (
                    <MessageList>
                        {messages.map((msg) => (
                            <MessageItem key={msg._id} isAdmin={msg.from === 'admin'}>
                                <p><b>{msg.from === 'admin' ? 'Administrator' : 'Ty'}:</b> {msg.content}</p>
                                <small>{new Date(msg.date).toLocaleString()}</small>
                            </MessageItem>
                        ))}
                    </MessageList>
                ) : (
                    <NoDataMessage>Nie masz żadnych wiadomości.</NoDataMessage>
                )}
            </Section>

            {/* Поле для відправлення повідомлень */}
            <Section>
                <SectionTitle>Wyślij wiadomość:</SectionTitle>
                <MessageForm>
                    <Textarea
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        placeholder="Napisz wiadomość..."
                    />
                    <SendButton onClick={handleSendMessage}>Wyślij</SendButton>
                </MessageForm>
                {feedback && <Feedback>{feedback}</Feedback>}
            </Section>
        </Wrapper>
    );
};

export default PatientProfile;

// Styled Components
const Wrapper = styled.div`
    max-width: 800px;
    margin: 40px auto;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    font-family: Arial, sans-serif;
`;

const Header = styled.div`
    margin-bottom: 30px;

    h1 {
        font-size: 24px;
        color: #333;
    }
`;

const Section = styled.div`
    margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
    font-size: 20px;
    color: #444;
    margin-bottom: 15px;
`;

const AppointmentList = styled.ul`
    list-style: none;
    padding: 0;
`;

const AppointmentItem = styled.li`
    background: #eef7ff;
    padding: 10px 15px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

const MessageList = styled.ul`
    list-style: none;
    padding: 0;
`;

const MessageItem = styled.li`
    background: ${({ isAdmin }) => (isAdmin ? '#ffe9e9' : '#e9ffe9')};
    padding: 10px 15px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;

    p {
        margin: 0;
    }

    small {
        color: #888;
        font-size: 12px;
    }
`;

const NoDataMessage = styled.p`
    font-size: 16px;
    color: #888;
`;

const MessageForm = styled.div`
    display: flex;
    flex-direction: column;
`;

const Textarea = styled.textarea`
    resize: none;
    width: 100%;
    height: 100px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 14px;
    margin-bottom: 10px;
`;

const SendButton = styled.button`
    padding: 10px 15px;
    background-color: #4caf50;
    border: none;
    color: white;
    border-radius: 5px;
`;

const Feedback = styled.p`
    margin-top: 10px;
    font-size: 14px;
    color: ${({ children }) =>
            children.includes('Nie udało') ? '#d9534f' : '#4caf50'};
`;

const LoadingŁadowanie = styled.div`
    text-align: center;
    padding: 50px;
    font-size: 16px;
    color: #888;
`;