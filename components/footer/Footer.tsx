import dayjs from "dayjs";
export default function Footer() {
  return (
    <div className="mx-3 bg-blue-50 border-t py-2">
      <div className="font-gray-500 text-sm text-center">
        <p>Copyright {dayjs().year()}</p>
      </div>  
      {/* <HeaderLeft /> */}
      {/* <HeaderRight /> */}
    </div>
  );
}