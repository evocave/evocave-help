import { useEffect, useState } from "react";

export default function useItemCount(
    containerRef: React.RefObject<HTMLDivElement | null>,
    itemRef: React.RefObject<HTMLElement | null>,
    isDesktop: boolean,
    headerHeight = 40,
) {
    const [count, setCount] = useState<number | null>(null);

    useEffect(() => {
        if (!isDesktop) {
            setCount(null);
            return;
        }

        const container = containerRef.current;
        const item = itemRef.current;
        if (!container || !item) return;

        function calculate() {
            if (!container || !item) return;
            const containerH = container.getBoundingClientRect().height;
            const itemH = item.getBoundingClientRect().height;
            if (itemH === 0) return;
            const available = containerH - headerHeight;
            setCount(Math.max(1, Math.floor(available / itemH)));
        }

        calculate();

        const ro = new ResizeObserver(calculate);
        ro.observe(container);
        ro.observe(item);

        return () => ro.disconnect();
    }, [containerRef, itemRef, isDesktop, headerHeight]);

    return count;
}
