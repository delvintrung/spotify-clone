import { Crown } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import PayPalButton from "./PaypalButton";

interface BuyPremiumButtonProps {
  isPremium?: boolean;
}

const BuyPremiumButton = ({ isPremium }: BuyPremiumButtonProps) => {
  return (
    <div
      className={`relative flex items-center justify-center w-24 h-5 bg-transparent rounded-lg
          border-amber-400 border-2 hover:bg-amber-400 hover:text-white transition-all 
          duration-300 ease-in-out group hover:cursor-pointer ${
            isPremium ? "hidden" : "text-white"
          }`}
    >
      <Dialog>
        <DialogTrigger asChild>
          <div>
            <Crown
              size={20}
              className=" absolute top-[-15px] right-[-10px] rotate-[0.6rad] text-[#d0bf01] group-hover:scale-110 group-hover:rotate-[0.8rad]  transition-all duration-300 ease-in-out"
            />
            <p className="text-center text-sm leading-5 transition-colors duration-300 ease-in-out">
              Premium
            </p>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <PayPalButton />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BuyPremiumButton;
