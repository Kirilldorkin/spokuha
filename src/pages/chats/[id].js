import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminList from "@/components/AdminList";
import UserList from "@/components/UserList";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const router = useRouter();
  const { id } = router.query;
  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersResponse = await fetch(`http://localhost:3001/users`);
        if (usersResponse.ok) {
          const users = await usersResponse.json();
          const admins = users.filter((user) => user.role === "admin");
          const regularUsers = users.filter((user) => user.role !== "admin");
          setUsers(regularUsers);
          setAdmins(admins);
        } else {
          console.error("Error fetching users:", usersResponse.status);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        const messagesResponse = await fetch(
          `http://localhost:3001/chats/${id}/messages`
        );
        if (messagesResponse.ok) {
          const messages = await messagesResponse.json();

          const fetchUserNames = messages.map(async (message) => {
            const userResponse = await fetch(
              `http://localhost:3001/users/${message.userId}`
            );
            if (userResponse.ok) {
              const user = await userResponse.json();
              return { ...message, userName: user.name };
            }
          });

          const messagesWithUserNames = await Promise.all(fetchUserNames);

          setMessages(messagesWithUserNames);
        } else {
          console.error("Error fetching messages:", messagesResponse.status);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (id) {
      fetchChatMessages();
      const intervalId = setInterval(fetchChatMessages, 100);
      return () => clearInterval(intervalId);
    }
  }, [id]);

  const sendMessage = async () => {
    if (inputValue.trim() === "") {
      return;
    }

    if (!userId) {
      console.error("User is not logged in");
      return;
    }

    try {
      const userResponse = await fetch(`http://localhost:3001/users/${userId}`);
      if (!userResponse.ok) {
        console.error(
          "Error fetching user name:",
          userResponse.status
        );
        return;
      }

      const user = await userResponse.json();
      const userName = user.name;

      const response = await fetch(
        `http://localhost:3001/chats/${id}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: inputValue,
            userId: userId,
          }),
        }
      );

      if (response.ok) {
        const newMessage = await response.json();
        newMessage.userName = userName;
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setInputValue("");
      } else {
        console.error("Error sending message:", response.status);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chats-body">
      <div className="chats-user-page">
        <div className="chat-block">
          <ul className="messages">
            {messages.map((message) => (
              <li className="message" key={message.id}>
                <span className="message-username">{message.userName}: </span>
                <span className="message-content">{message.message}</span>
              </li>
            ))}
          </ul>

          <ul className="users">
            <AdminList admins={admins} userId={userId} />
            <UserList users={users} />
          </ul>
        </div>

        <div className="chat-input">
          <input
            type="text"
            value={inputValue}
            placeholder="Введите сообщение..."
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />

          <button onClick={sendMessage}>Отправить</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
