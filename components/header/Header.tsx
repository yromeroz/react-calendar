import HeaderLeft from "./left-side";
import HeaderRight from "./right-side";

export default function Header() {
  return (
    <div className="mx-3 flex items-center justify-between py-4">
      <HeaderLeft />
      <HeaderRight />
    </div>
  );
}
