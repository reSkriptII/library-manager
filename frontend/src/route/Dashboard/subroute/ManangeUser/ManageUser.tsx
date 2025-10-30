import axios from "axios";
import { useContext, useEffect, useState } from "react";
import type { UserData } from "./type";
import { UserContext } from "#root/hook/UseProvider.tsx";
import { EditableText } from "#root/component/EditableText.tsx";

export function ManageUser() {
  const [users, setUsers] = useState<UserData[] | null>(null);
  const [editUser, setEditUser] = useState<number | null>(null);
  const context = useContext(UserContext);
  if (!context) throw new Error("userContext not found");
  const thisUser = context.user;

  useEffect(() => {
    (async () => {
      try {
        const usersResult = await axios.get(window.api + "/user", {
          withCredentials: true,
        });
        setUsers(usersResult.data.data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  async function deleteUser(id: number) {
    if (id === thisUser?.id) return;
    try {
      await axios.delete(window.api + "/user/" + id, { withCredentials: true });
    } catch (err) {
      console.log(err);
    }
  }
  function handleNameChange(id: number) {
    return async (value: string) => {
      try {
        await axios.put(
          window.api + `/user/${id}/name`,
          { name: value },
          { withCredentials: true },
        );
      } catch (err) {
        console.log(err);
      }
    };
  }

  async function changeRole(id: number, role: string) {
    try {
      await axios.put(
        window.api + `/user/${id}/role`,
        { role },
        { withCredentials: true },
      );
    } catch (err) {
      console.log(err);
    }
  }

  const userRows =
    users &&
    users.map((user) => (
      <tr>
        <td> {user.user_id}</td>
        <td>
          <EditableText
            value={user.name}
            onSave={handleNameChange(user.user_id)}
          />
        </td>
        <td>{user.email}</td>
        <td>
          <select onChange={(e) => changeRole(user.user_id, e.target.value)}>
            <option selected={user.role == "user"}>user</option>
            <option selected={user.role == "librarian"}>librarian</option>
            <option selected={user.role == "admin"}>admin</option>
          </select>
        </td>
        <td>
          {user.user_id !== thisUser?.id && (
            <button
              onClick={() => deleteUser(user.user_id)}
              className="border border-black"
            >
              delete
            </button>
          )}
        </td>
      </tr>
    ));

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>name</th>
            <th>Email</th>
            <th>Role</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>{userRows}</tbody>
      </table>
    </div>
  );
}
