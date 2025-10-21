export function UserData({ userId }: { userId: number | null }) {
  return (
    <div className="my-8 flex gap-4">
      <div className="w-1/2">
        <img
          className="mx-auto block size-32 rounded-full"
          src="/profile.svg"
        />
      </div>
      <div className="w-1/2">
        <p className="font-bold">Name:</p>
        <p className="mb-4 ml-2 text-2xl">Name</p>
        <p className="font-bold">Email:</p>
        <p className="mb-4 ml-2 text-2xl">email</p>
      </div>
    </div>
  );
}
