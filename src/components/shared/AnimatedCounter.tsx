'use client';

import { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
    end: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
    className?: string;
}

export default function AnimatedCounter({
    end,
    duration = 2000,
    suffix = '',
    prefix = '',
    className = '',
}: AnimatedCounterProps) {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);

                    const startTime = performance.now();
                    const animate = (currentTime: number) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);

                        // Easing function for smooth animation
                        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                        setCount(Math.floor(easeOutQuart * end));

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        }
                    };

                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [end, duration, hasAnimated]);

    return (
        <span ref={ref} className={className}>
            {prefix}{count.toLocaleString('en-IN')}{suffix}
        </span>
    );
}
