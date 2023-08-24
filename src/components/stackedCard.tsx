import { CSSProperties } from "react";

const StackedCardIcon: React.FC<{
  number: number | null;
  zIndex: number;
  margin?: number;
}> = ({ number, zIndex, margin }) => {
  return (
    <div
      className="w-32 h-48 bg-white border border-gray-300 rounded-lg p-2 text-center flex justify-center items-center"
      style={{ zIndex, marginLeft: margin }}
    >
      <p className="text-7xl font-bold ">{number}</p>
    </div>
  );
};

export default StackedCardIcon;
