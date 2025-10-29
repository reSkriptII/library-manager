import { useContext, useState } from "react";
import { ProfileMenu } from "./ProfileMenu";
import type { user } from "#root/type.d.ts";
import { UserContext } from "#root/hook/UseProvider.js";

export default function Profile() {
  const context = useContext(UserContext);
  if (!context) throw new Error("userContext not found");
  const { user } = context;

  const [isMenuCollasped, setIsMenuCollasped] = useState(true);

  return (
    <div className="relative mr-8">
      <ProfileButton
        user={user}
        onClick={() => {
          setIsMenuCollasped(!isMenuCollasped);
        }}
      />
      <div className="absolute top-14 -right-4">
        <ProfileMenu hidden={isMenuCollasped} user={user} />
      </div>
    </div>
  );
}

type ProfileButtonProps = { user: user | null; onClick: () => void };
function ProfileButton({ user, onClick }: ProfileButtonProps) {
  const profilePicUrl = user
    ? window.api + `/user/me/profileimg`
    : "/profile.svg";
  return (
    <button
      className="relative size-12 overflow-hidden rounded-full"
      onClick={onClick}
    >
      <img
        className="size-12"
        alt="profile picture"
        src={profilePicUrl}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/profile.svg";
        }}
      />
      <div className="absolute top-0 left-0 size-full hover:bg-black/10"></div>
    </button>
  );
}
