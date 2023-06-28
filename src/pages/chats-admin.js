import Link from "next/link";
import { useState, useEffect } from "react";

const ChatsAdminPage = () => {
  const [chatData, setChatData] = useState({
    title: "",
    description: "",
  });
  const [chats, setChats] = useState([]);

  useEffect(() => {
    fetchChats();
  }, []);

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

  const handleChange = (event) => {
    setChatData({
      ...chatData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chatData),
      });

      if (response.ok) {
        const chat = await response.json();
        // console.log("Чат создан:", chat);
        fetchChats();
      } else {
        console.error("Ошибка при создании чата:", response.status);
      }

      setChatData({
        title: "",
        description: "",
      });
    } catch (error) {
      console.error("Ошибка при создании чата:", error);
    }
  };

  const handleDelete = async (chatId) => {
    try {
      const response = await fetch(`http://localhost:3001/chats/${chatId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Чат удален:", chatId);
        fetchChats();
      } else {
        console.error("Ошибка удаления чата:", response.status);
      }
    } catch (error) {
      console.error("Ошибка удаления чата:", error);
    }
  };
  return (
    <>
      <h1>Создать чат</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Заголовок:
          <input
            type="text"
            name="title"
            value={chatData.title}
            onChange={handleChange}
          />
        </label>

        <label>
          Описание:
          <textarea
            name="description"
            value={chatData.description}
            onChange={handleChange}
          ></textarea>
        </label>

        <button type="submit">Создать чат</button>
      </form>

      <h1>Чаты:</h1>
      <ul className="chat-list">
        {chats.map((chat) => (
          <li key={chat.id}>
            <div className="chat" title={chat.description}>
              <div className="chat-header">
                <Link href={`/chats/${chat.id}`} className="link" key={chat.id}>
                  <span className="chat-title">{chat.title}</span>
                </Link>

                <button onClick={() => handleDelete(chat.id)}>Удалить</button>
              </div>

              <span className="chat-description">{chat.description}</span>
            </div>
          </li>
        ))}
      </ul>
      <Link className="btn-link" href={"/login"}>
        <button className="center">Выйти</button>
      </Link>
    </>
  );
};

export default ChatsAdminPage;
