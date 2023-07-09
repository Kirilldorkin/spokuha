import Link from "next/link";

const AdminList = ({ admins, userId }) => {
  return (
    <div className="list">
      <ul>
        {admins.map((admin) => (
          <li className="list-item" key={admin.id}>
            <Link href={`/chats/${admin.id}-${userId}`}>
              <button>{admin.name}</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminList;
