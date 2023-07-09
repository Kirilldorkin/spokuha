import Link from "next/link";
import { useEffect, useState } from "react";

const AdminPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("http://localhost:3001/users");
        const users = await response.json();
        setUsers(users);
        console.log(users);
      } catch (error) {
        console.error("Ошибка при получении пользователей:", error);
      }
    }

    fetchUsers();
    const intervalId = setInterval(fetchUsers, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
      } else {
        console.error("Не удалось обновить роль пользователя");
      }
    } catch (error) {
      console.error("Ошибка при обновлении роли пользователя:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      } else {
        console.error("Ошибка при удалении пользователя:", response.status);
      }
    } catch (error) {
      console.error("Ошибка при удалении пользователя:", error);
    }
  };

  return (
    <div className="admin">
      <h1>Административная панель</h1>
      <table>
        <thead>
          <tr>
            <th>Имя</th>
            <th>Электронная почта</th>
            <th>Роль</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td style={{
                display: "flex",
                justifyContent: "space-between",
              }}>
                <select
                  value={user.role}
                  onChange={(event) =>
                    handleRoleChange(user.id, event.target.value)
                  }
                >
                  <option value="user">Пользователь</option>
                  <option value="admin">Администратор</option>
                </select>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link href={"/chats-admin"}>
        <button className="admin-btn">Вернуться</button>
      </Link>
    </div>
  );
};

export default AdminPage;
