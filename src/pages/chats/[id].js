import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [userRole, setUserRole] = useState(""); 
  const router = useRouter();
  const { id } = router.query;

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const userId = localStorage.getItem('userId');
				const response = await fetch(`http://localhost:3001/users/${userId}`); // I can't get logged user id 
				if (response.ok) {
					const user = await response.json();
					const { role } = user;
					setUserRole(role);
				} else {
					console.error("Ошибка получения пользователя:", response.status);
				}
			} catch (error) {
				console.error("Ошибка получения пользователя:", error);
			}
		};
	
		if (id) {
			fetchUser();
		}
	}, [id]);
	

  useEffect(() => {
		const fetchChatMessages = async () => {
			try {
				const messagesResponse = await fetch(
					`http://localhost:3001/chats/${id}/messages`
				);
				if (messagesResponse.ok) {
					const messages = await messagesResponse.json();
					setMessages(messages);
				} else {
					console.error("Ошибка получения сообщений:", messagesResponse.status);
				}
			} catch (error) {
				console.error("Ошибка получения сообщений:", error);
			}
		};
	
		if (id) {
			fetchChatMessages();
		}
	}, [id]);
	

  const sendMessage = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/chats/${id}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: inputValue }),
        }
      );

      if (response.ok) {
        const newMessage = await response.json();
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setInputValue("");
      } else {
        console.error("Ошибка отправки сообщения:", response.status);
      }
    } catch (error) {
      console.error("Ошибка отправки сообщения:", error);
    }
  };

  return (
    <div className="chats-user-page">
      <ul>
        {messages.map((message) => (
          <li key={message.id}>{message.message}</li>
        ))}
      </ul>

      <div className="chat-input">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={sendMessage}>Отправлять</button>
        <Link href={userRole === "admin" ? "/chats-admin" : "/chats-user"}>
          <button>Вернуться</button>
        </Link>
      </div>
    </div>
  );
};

export default Chat;
