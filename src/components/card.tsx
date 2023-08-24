const CardIcon: React.FC<{ number: number | null }> = ({ number }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 relative">
      <div className="flex items-center justify-center w-10 h-20 text-black rounded-full font-bold text-xl">
        {number}
      </div>
    </div>
  );
};

export default CardIcon;
