import dayjs from "dayjs";
import { ReservationLegend } from "./ReservationLegend";

export default function Footer() {
  return (
    <div className="mx-3 border-t bg-blue-50 py-1 pl-4">
      <div className="font-gray-500 text-start text-[clamp(0.625rem,2vmin,1rem)]">
        <p>Copyright {dayjs().year()}</p>
      </div>
      <ReservationLegend />
    </div>
  );
}
