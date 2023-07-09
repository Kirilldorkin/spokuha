const UserList = ({ users }) => {
  return (
    <div className="list">
      <ul>
        {users.map((user) => (
          <li className="list-item" key={user.id}>
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
