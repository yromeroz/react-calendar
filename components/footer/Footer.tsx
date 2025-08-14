import dayjs from "dayjs";
export default function Footer() {
  return (
    <div className="mx-3 bg-blue-50 border-t pl-4 py-1">
      <div className="font-gray-500 text-sm text-start">
        <p>Copyright {dayjs().year()}</p>
      </div>  
    </div>
  );
}