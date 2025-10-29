import axios from "axios";
import { useRef, useState } from "react";

export function EditProfile() {
  const [showPicMenu, setShowPicMenu] = useState(false);
  const profilePicRef = useRef<HTMLImageElement | null>(null);
  const newPicRef = useRef<string>(null);

  async function handleRemovePic() {
    if (profilePicRef.current) profilePicRef.current.src = "";
    try {
      await axios.delete(window.api + "/user/me/profileimg", {
        withCredentials: true,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function handleChangePic(file: File | undefined) {
    if (file == undefined || profilePicRef.current == null) return;
    const form = new FormData();
    form.append("a", file);
    // if (newPicRef.current) {
    //   URL.revokeObjectURL(newPicRef.current);
    // }
    // newPicRef.current = URL.createObjectURL(file);
    // profilePicRef.current.src = newPicRef.current;

    try {
      console.log(form);
      await axios.put(window.api + "/user/me/profileimg", form, {
        withCredentials: true,
      });
    } catch (err) {
      console.log(err);
    } finally {
      profilePicRef.current.src = window.api + "/user/me/profileimg";
    }
  }

  return (
    <div className="relative mx-auto my-2 size-32">
      <div className="flex size-full items-center justify-center overflow-hidden rounded-full">
        <img
          src={window.api + "/user/me/profileimg"}
          ref={profilePicRef}
          className="min-h-full min-w-full rounded-full hover:brightness-95"
          alt="profile picture"
          onClick={() => setShowPicMenu(!showPicMenu)}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/profile.svg";
          }}
        />
      </div>
      <div
        hidden={!showPicMenu}
        className="absolute top-34 right-8 w-48 bg-white p-2 text-left shadow shadow-neutral-400"
      >
        <label className="block w-full pl-2 text-left hover:bg-neutral-200">
          Change profile picture
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => handleChangePic(e.target.files?.[0])}
          />
        </label>

        <button
          onClick={handleRemovePic}
          className="mt-2 block w-full pl-2 text-left hover:bg-neutral-200"
        >
          Remove profile picture
        </button>
      </div>
    </div>
  );
}
