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
              <td>
                <select
                  value={user.role}
                  onChange={(event) =>
                    handleRoleChange(user.id, event.target.value)
                  }
                >
                  <option value="user">Пользователь</option>
                  <option value="admin">Администратор</option>
                </select>
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
