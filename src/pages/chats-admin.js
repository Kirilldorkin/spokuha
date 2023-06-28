import Link from "next/link";
import { useState, useEffect } from "react";

const ChatsAdminPage = () => {
  const [chatData, setChatData] = useState({
    title: "",
    description: "",
  });
  const [chats, setChats] = useState([]);
  const [errors, setErrors] = useState({});

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

    setErrors({});
    const errors = {};

    if (!chatData.title) {
      errors.title = "Укажите заголовок";
    }

    if (!chatData.description) {
      errors.description = "Укажите описание";
    }

    setErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

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
          {errors.title && <h5>{errors.title}</h5>}
        </label>

        <label>
          Описание:
          <textarea
            name="description"
            value={chatData.description}
            onChange={handleChange}
          ></textarea>
          {errors.description && <h5>{errors.description}</h5>}
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

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(chat.id)}
                >
                  Удалить
                </button>
              </div>

              <span className="chat-description">{chat.description}</span>
            </div>
          </li>
        ))}
      </ul>
      <div className="chats-btn">
        <Link className="btn-link" href={"/login"}>
          <button>Выйти</button>
        </Link>
        <Link className="btn-link" href={"/admin"}>
          <button>Панель администратора</button>
        </Link>
      </div>
    </>
  );
};

export default ChatsAdminPage;
