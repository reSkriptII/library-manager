import axios from "axios";
import { useEffect, useState } from "react";
import { ProfileMenu } from "./ProfileMenu";
import type { user } from "./type";

export default function Profile() {
  const [user, setUser] = useState<user | null>(null);
  const [isMenuCollasped, setIsMenuCollasped] = useState(true);

  useEffect(() => {
    let isMount = true;

    axios
      .get(window.api + "/auth/me", { withCredentials: true })
      .then((res) => {
        if (isMount) setUser(res.data);
      });

    return () => {
      isMount = false;
    };
  }, []);
  return (
    <div className="relative">
      <ProfileButton
        user={user}
        onClick={() => {
          setIsMenuCollasped(!isMenuCollasped);
        }}
      />
      <div className="absolute">
        <ProfileMenu hidden={isMenuCollasped} />
      </div>
    </div>
  );
}

type ProfileButtonArgs = { user: user | null; onClick: () => void };
function ProfileButton({ user, onClick }: ProfileButtonArgs) {
  const profilePicUrl = user
    ? window.api + `/user/${user.id}/profileimg`
    : "/profile.svg";
  return (
    <button
      className="relative size-12 overflow-hidden rounded-full"
      onClick={onClick}
    >
      <img className="size-12" alt="profile picture" src={profilePicUrl} />
      <div className="absolute top-0 left-0 size-full hover:bg-black/10"></div>
    </button>
  );
}
