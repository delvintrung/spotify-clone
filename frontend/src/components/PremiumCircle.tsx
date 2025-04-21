import { Crown } from "lucide-react";
const PremiumCircle = () => {
  return (
    <div className="absolute right-[-1px] top-[-1px] w-[30px] h-[30px] rounded-full border-2 border-amber-400">
      <Crown
        size={15}
        color="#fbbf24"
        className="absolute top-0 right-[-8px] rotate-[0.6rad]"
      />
    </div>
  );
};

export default PremiumCircle;
