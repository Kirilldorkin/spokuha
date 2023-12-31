import Link from "next/link";
import { useEffect, useState } from "react";

const ChatsUserPage = () => {
  const [chats, setChats] = useState([]);

  const fetchChats = async () => {
    try {
      const response = await fetch("http://localhost:3001/chats");
      if (response.ok) {
        const chats = await response.json();
        setChats(chats);
      } else {
        console.error("Ошибка загрузки чатов:", response.status);
      }
    } catch (error) {
      console.error("Ошибка загрузки чатов:", error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <>
      <h1>Чаты:</h1>
      <ul className="list chats-list">
        {chats.map((chat) => (
          <li key={chat.id}>
            <div className="chat" title={chat.description}>
              <div className="chat-header">
                <Link href={`/chats/${chat.id}`} className="link">
                  <span className="chat-title">{chat.title}</span>
                </Link>
              </div>
              <span className="chat-description">{chat.description}</span>
            </div>
          </li>
        ))}
      </ul>
      <div className="chats-btn">
        <Link className="btn-link" href={"/login"}>
          <button className="user-out-btn">Выйти</button>
        </Link>
      </div>
    </>
  );
};

export default ChatsUserPage;
