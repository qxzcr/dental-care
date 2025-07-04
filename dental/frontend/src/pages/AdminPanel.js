import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUsers, deleteUser, register, getMessages, sendMessage } from "../services/api";

const AdminPanel = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newUser, setNewUser] = useState({
        imie: "",
        nazwisko: "",
        email: "",
        haslo: "",
        role: "patient",
    });
    const [message, setMessage] = useState("");
    const [replyContents, setReplyContents] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== "admin") {
            console.warn("Unauthorized access to admin panel");
            navigate("/login");
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const usersData = await getUsers();
            setUsers(usersData?.data || []);
            const messagesData = await getMessages();
            setMessages(messagesData?.data || []);
        } catch (err) {
            console.error("Error fetching data:", err);
            setMessage("Error loading data.");
            setUsers([]);
            setMessages([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setMessage("");

        if (newUser.imie.length < 2 || newUser.nazwisko.length < 2) {
            setMessage("First and last name must have at least 2 characters.");
            return;
        }

        if (!["admin", "doctor", "patient"].includes(newUser.role)) {
            setMessage("Invalid user role.");
            return;
        }

        try {
            const result = await register(newUser);
            if (result.success) {
                setUsers([...users, result.data]);
                setNewUser({ imie: "", nazwisko: "", email: "", haslo: "", role: "patient" });
                setMessage("User added successfully!");
            } else {
                setMessage(result.message || "Failed to add user.");
            }
        } catch (err) {
            console.error("Error registering user:", err);
            setMessage("Server error while adding user!");
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const result = await deleteUser(id);
                if (result.success) {
                    setUsers(users.filter((u) => u._id !== id));
                    setMessage("User successfully deleted.");
                } else {
                    setMessage(result.message || "Failed to delete user.");
                }
            } catch (err) {
                console.error("Error deleting user:", err);
                setMessage("Error deleting user!");
            }
        }
    };

    const handleReplyChange = (id, value) => {
        setReplyContents((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleReply = async (to, content, id) => {
        if (!content.trim()) {
            setMessage("Cannot send an empty message.");
            return;
        }

        try {
            const result = await sendMessage({ content, to });
            if (result.success) {
                setMessage("Message sent successfully!");
                setReplyContents((prev) => {
                    const updated = { ...prev };
                    delete updated[id];
                    return updated;
                });

                fetchData();
            } else {
                setMessage("Failed to send message.");
            }
        } catch (err) {
            console.error("Error sending message:", err);
            setMessage("Error sending message.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (loading) {
        return <Loading>Ładowanie danych...</Loading>;
    }

    return (
        <Wrapper>
            <Header>
                <h1>Panel Administratora</h1>
                <LogoutButton onClick={handleLogout}>Wyloguj się</LogoutButton>
            </Header>

            {message && <Feedback>{message}</Feedback>}

            <Section>
                <SectionTitle>Użytkownicy</SectionTitle>
                {users.length > 0 ? (
                    <UserList>
                        {users.map((user) => (
                            <UserItem key={user._id}>
                                <p>
                                    {user.imie} {user.nazwisko} ({user.role}) - {user.email}
                                </p>
                                <DeleteButton onClick={() => handleDeleteUser(user._id)}>
                                    Usuń
                                </DeleteButton>
                            </UserItem>
                        ))}
                    </UserList>
                ) : (
                    <NoDataMessage>Nie znaleziono użytkowników.</NoDataMessage>
                )}
            </Section>

            <Section>
                <SectionTitle>Dodaj nowego użytkownika</SectionTitle>
                <form onSubmit={handleAddUser}>
                    <Input
                        type="text"
                        placeholder="Imię"
                        value={newUser.imie}
                        onChange={(e) => setNewUser({ ...newUser, imie: e.target.value })}
                        required
                    />
                    <Input
                        type="text"
                        placeholder="Nazwisko"
                        value={newUser.nazwisko}
                        onChange={(e) => setNewUser({ ...newUser, nazwisko: e.target.value })}
                        required
                    />
                    <Input
                        type="email"
                        placeholder="Email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        required
                    />
                    <Input
                        type="password"
                        placeholder="Hasło"
                        value={newUser.haslo}
                        onChange={(e) => setNewUser({ ...newUser, haslo: e.target.value })}
                        required
                    />
                    <Select
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        required
                    >
                        <option value="patient">Pacjent</option>
                        <option value="doctor">Lekarz</option>
                        <option value="admin">Administrator</option>
                    </Select>
                    <Button type="submit">Dodaj użytkownika</Button>
                </form>
            </Section>

            <Section>
                <SectionTitle>Wiadomości</SectionTitle>
                {messages.length > 0 ? (
                    <MessageList>
                        {messages.map((msg) => (
                            <MessageItem key={msg._id}>
                                <p>
                                    <strong>Od:</strong> {msg.from} <br />
                                    <strong>Wiadomość:</strong> {msg.content}
                                </p>
                                <Textarea
                                    value={replyContents[msg._id] || ""}
                                    onChange={(e) => handleReplyChange(msg._id, e.target.value)}
                                    placeholder="Odpowiedz..."
                                />
                                <Button
                                    onClick={() =>
                                        handleReply(msg.from, replyContents[msg._id], msg._id)
                                    }
                                >
                                    Odpowiedz
                                </Button>
                            </MessageItem>
                        ))}
                    </MessageList>
                ) : (
                    <NoDataMessage>Brak wiadomości.</NoDataMessage>
                )}
            </Section>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    max-width: 900px;
    margin: 40px auto;
    padding: 20px;
    background: #f0f8ff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
`;

const LogoutButton = styled.button`
    background: #d9534f;
    color: white;
    padding: 10px 15px;
    border-radius: 5px;
    border: none;
    cursor: pointer;

    &:hover {
        background: #c9302c;
    }
`;

const Section = styled.div`
    margin-bottom: 30px;
    padding: 20px;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
    font-size: 1.5em;
    color: #0275d8;
    margin-bottom: 15px;
`;

const Feedback = styled.p`
    color: green;
    margin-bottom: 15px;
`;

const Input = styled.input`
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;

    &:focus {
        border-color: #0275d8;
        outline: none;
    }
`;

const Select = styled.select`
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
`;

const Button = styled.button`
    background: #0275d8;
    color: white;
    padding: 10px 15px;
    border-radius: 5px;
    border: none;
    cursor: pointer;

    &:hover {
        background: #025aa5;
    }
`;

const UserList = styled.ul`
    list-style: none;
    padding: 0;
`;

const UserItem = styled.li`
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #ddd;
`;

const DeleteButton = styled.button`
    background: #d9534f;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    border: none;
    cursor: pointer;

    &:hover {
        background: #c9302c;
    }
`;

const MessageList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const MessageItem = styled.div`
    background: #f9f9f9;
    border: 1px solid #ddd;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 10px;
`;

const NoDataMessage = styled.p`
    text-align: center;
    color: #aaa;
`;

const Textarea = styled.textarea`
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    resize: none;

    &:focus {
        border-color: #0275d8;
    }
`;

const Loading = styled.div`
    text-align: center;
    font-size: 1.2em;
    color: #555;
`;

export default AdminPanel;