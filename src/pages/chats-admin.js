import Link from "next/link";
import { useState, useEffect } from "react";

const ChatsAdminPage = () => {
  const [chatData, setChatData] = useState({
    title: "",
    description: "",
  });
  const [chats, setChats] = useState([]);
  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [updateFlag, setUpdateFlag] = useState(false);
  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersResponse = await fetch("http://localhost:3001/users");
        if (usersResponse.ok) {
          const users = await usersResponse.json();
          const regularUsers = users.filter((user) => user.role === "user");
          setUsers(regularUsers);
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

    fetchChats();
  }, [updateFlag]);

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
        setChats((prevChats) => [...prevChats, chat]); 
        setUpdateFlag(true); 
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
        setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId));
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
      <form className="admin-form" onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            name="title"
            value={chatData.title}
            onChange={handleChange}
            placeholder="Заголовок"
          />
          {errors.title && <h5>{errors.title}</h5>}
        </label>

        <label>
          <textarea
            name="description"
            value={chatData.description}
            onChange={handleChange}
            placeholder="Описание"
          ></textarea>
          {errors.description && <h5>{errors.description}</h5>}
        </label>

        <button type="submit">Создать чат</button>
      </form>

      <div className="chats-users">
        <div className="chats">
          <h1>Чаты:</h1>
          <ul className="list chats-list">
            {chats.map((chat) => (
              <li key={chat.id}>
                <div className="chat" title={chat.description}>
                  <div className="chat-header">
                    <Link
                      href={`/chats/${chat.id}`}
                      className="link"
                      key={chat.id}
                    >
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
        </div>

        <div className="users">
          <h1>Пользователи:</h1>
          <ul className="list chats-list">
            {users.map((chat) => (
              <li key={chat.id}>
                <div className="chat-header">
                  <Link
                    href={`/chats/${userId}-${chat.id}`}
                    className="link"
                    key={chat.id}
                  >
                    <span className="user-title">{chat.name}</span>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

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
