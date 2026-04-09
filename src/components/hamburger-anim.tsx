import { motion } from "framer-motion";

export default function HamburgerMobile({
    isOpen,
    setIsOpen,
}: {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}) {
    return (
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative flex h-9 w-9 items-center justify-center lg:hidden"
            aria-label="Toggle menu"
        >
            <div className="flex flex-col items-center justify-center gap-[8.5px]">
                {/* Garis Atas */}
                <motion.span
                    animate={isOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-foreground block h-[1.5px] w-5.5 origin-center rounded-full"
                />

                {/* Garis Bawah */}
                <motion.span
                    animate={isOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-foreground block h-[1.5px] w-5.5 origin-center rounded-full"
                />
            </div>
        </button>
    );
}
