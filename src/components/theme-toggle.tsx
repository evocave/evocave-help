'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    const options = [
        { value: 'light', icon: Sun },
        { value: 'system', icon: Monitor },
        { value: 'dark', icon: Moon }
    ]

    if (!mounted) {
        return (
            <div className="flex items-center gap-0.5 bg-secondary rounded-full p-1">
                {options.map(({ value, icon: Icon }) => (
                    <div
                        key={value}
                        className="p-1.5 rounded-full text-muted-foreground"
                    >
                        <Icon className="size-3.5" />
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="flex items-center gap-0.5 bg-secondary rounded-full p-1">
            {options.map(({ value, icon: Icon }) => (
                <button
                    key={value}
                    onClick={() => setTheme(value)}
                    className={cn(
                        'p-1.5 rounded-full transition-colors',
                        theme === value
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                    )}
                >
                    <Icon className="size-3.5" />
                </button>
            ))}
        </div>
    )
}
