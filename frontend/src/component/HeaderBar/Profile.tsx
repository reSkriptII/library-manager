import axios from "axios";
import { useEffect, useState } from "react";
import { ProfileMenu } from "./ProfileMenu";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isMenuCollasped, setIsMenuCollasped] = useState(true);

  return (
    <div className="relative">
      <button
        className="relative overflow-hidden rounded-full"
        onClick={() => setIsMenuCollasped(!isMenuCollasped)}
      >
        <img className="size-12 bg-amber-100" alt="profile picture" />
        <div className="absolute top-0 left-0 size-full hover:bg-black/10"></div>
      </button>
      <div className="absolute">
        <ProfileMenu hidden={isMenuCollasped} />
      </div>
    </div>
  );
}
