import { HeaderBar } from "../../component/HeaderBar/HeaderBar";

export function BookPage() {
  return (
    <>
      <HeaderBar />
      <div>
        <div className="flex justify-between">
          <img alt="cover image" />
          <div>
            <h2>Title</h2>
            <div>info</div>
          </div>
        </div>
      </div>
    </>
  );
}
