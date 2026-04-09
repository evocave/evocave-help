"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
    MessageCircle,
    X,
    BookOpen,
    Send,
    ChevronRight,
    Search,
    Loader2,
    Bot,
    User,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────
type Tab = "chat" | "docs";

interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
}

interface DocResult {
    id: number;
    title: string;
    excerpt: string;
    link: string;
}

// ─── System Prompt ────────────────────────────────────────
const SYSTEM_PROMPT = `You are a helpful support assistant for Evocave, a digital product studio that sells WordPress Elementor Template Kits, Figma UI Kits, and HTML Templates on Envato Market.

Our products:
- Solarion: Solar & Green Renewable Energy Elementor Template Kit
- Coworkly: Coworking Space Elementor Template Kit & Figma UI Kit
- Elecfix: Electronics Repair Service Elementor Template Kit
- SteelForge: Industrial & Manufacturing Elementor Template Kit

Common support topics:
- Template installation: Download from Envato > Extract zip > Import .json in Elementor > Template Kit
- Purchase code: Envato account > Downloads > License Certificate
- Elementor compatibility: We support Elementor 3.x and above
- WordPress compatibility: WordPress 6.0 and above recommended
- Refunds: Handled by Envato, not us directly — visit help.market.envato.com

Tone: Friendly, concise, helpful. Always suggest opening a support ticket at evocave.com/help if the issue cannot be resolved through chat.
Do not make up information. If unsure, direct the user to submit a support ticket.
Keep responses short and focused — this is a chat widget, not a documentation page.`;

// ─── Helpers ─────────────────────────────────────────────
function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

// Fetch relevant docs from WP JSON API based on user query
async function fetchRelevantDocs(query: string): Promise<string> {
    try {
        const res = await fetch(
            `https://docs.evocave.com/wp-json/wp/v2/posts?search=${encodeURIComponent(query)}&per_page=3&_fields=title,excerpt,link`,
        );
        if (!res.ok) return "";
        const data = await res.json();
        if (!data.length) return "";

        return data
            .map((p: any) => {
                const title = p.title?.rendered?.replace(/<[^>]+>/g, "") ?? "";
                const excerpt = p.excerpt?.rendered?.replace(/<[^>]+>/g, "").slice(0, 200) ?? "";
                const link = p.link ?? "";
                return `Article: ${title}\nSummary: ${excerpt}\nURL: ${link}`;
            })
            .join("\n\n");
    } catch {
        return "";
    }
}

// ─── Tab: Chat (AI Assistant) ─────────────────────────────
function ChatTab() {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: "welcome",
            role: "assistant",
            content:
                "Hi! I'm the Evocave Help Assistant. I can help you with template installation, license issues, and general questions about our products. How can I help you?",
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    async function handleSend() {
        if (!input.trim() || loading) return;
        const userMsg = input.trim();
        setInput("");
        setLoading(true);

        const newMessages: ChatMessage[] = [
            ...messages,
            { id: Date.now().toString(), role: "user", content: userMsg },
        ];
        setMessages(newMessages);

        try {
            // 1. Fetch relevant docs from WP JSON API
            const docsContext = await fetchRelevantDocs(userMsg);

            // 2. Build context-enriched system prompt
            const systemWithDocs = docsContext
                ? `${SYSTEM_PROMPT}\n\nRelevant documentation found:\n${docsContext}`
                : SYSTEM_PROMPT;

            // 3. Call Groq API
            const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    max_tokens: 512,
                    messages: [
                        { role: "system", content: systemWithDocs },
                        // Include last 6 messages for context
                        ...newMessages.slice(-6).map((m) => ({
                            role: m.role,
                            content: m.content,
                        })),
                    ],
                }),
            });

            const data = await res.json();
            const reply =
                data.choices?.[0]?.message?.content ??
                "Sorry, I couldn't get a response. Please try again.";

            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now().toString() + "_ai",
                    role: "assistant",
                    content: reply,
                },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now().toString() + "_err",
                    role: "assistant",
                    content: "Something went wrong. Please try again or submit a support ticket.",
                },
            ]);
        } finally {
            setLoading(false);
            inputRef.current?.focus();
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    return (
        <div className="flex h-full flex-col">
            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={cn(
                            "flex gap-2.5",
                            msg.role === "user" ? "flex-row-reverse" : "",
                        )}
                    >
                        {/* Avatar */}
                        <div
                            className={cn(
                                "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                                msg.role === "assistant" ? "bg-blue-600" : "bg-secondary/60",
                            )}
                        >
                            {msg.role === "assistant" ? (
                                <Bot className="h-3.5 w-3.5 text-white" />
                            ) : (
                                <User className="text-muted-foreground h-3.5 w-3.5" />
                            )}
                        </div>
                        {/* Bubble */}
                        <div
                            className={cn(
                                "max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                                msg.role === "assistant"
                                    ? "bg-secondary/30 text-foreground rounded-tl-sm"
                                    : "rounded-tr-sm bg-blue-600 text-white",
                            )}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}

                {/* Loading indicator */}
                {loading && (
                    <div className="flex gap-2.5">
                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600">
                            <Bot className="h-3.5 w-3.5 text-white" />
                        </div>
                        <div className="bg-secondary/30 rounded-2xl rounded-tl-sm px-3 py-2">
                            <div className="flex items-center gap-1">
                                <span className="bg-muted-foreground/40 h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:0ms]" />
                                <span className="bg-muted-foreground/40 h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:150ms]" />
                                <span className="bg-muted-foreground/40 h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:300ms]" />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Still need help */}
            <div className="border-border shrink-0 border-t px-4 py-2">
                <Link
                    href="/dashboard/tickets/new"
                    className="text-muted-foreground hover:text-foreground block text-center text-xs transition-colors"
                >
                    Still need help? Submit a ticket →
                </Link>
            </div>

            {/* Input */}
            <div className="border-border shrink-0 border-t px-3 py-3">
                <div className="border-border bg-secondary/20 focus-within:border-ring/50 flex items-center gap-2 rounded-xl border px-3 py-2 transition-colors">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Ask a question..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={loading}
                        className="text-foreground placeholder:text-muted-foreground/50 min-w-0 flex-1 bg-transparent text-sm focus:outline-none disabled:opacity-50"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || loading}
                        className={cn(
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors",
                            input.trim() && !loading
                                ? "bg-blue-600 text-white hover:bg-blue-500"
                                : "text-muted-foreground/40",
                        )}
                    >
                        {loading ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                            <Send className="h-3.5 w-3.5" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Tab: Docs ────────────────────────────────────────────
function DocsTab() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<DocResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const debouncedQuery = useDebounce(query, 400);

    useEffect(() => {
        if (!debouncedQuery.trim() || debouncedQuery.length < 2) {
            setResults([]);
            setSearched(false);
            return;
        }
        async function search() {
            setLoading(true);
            try {
                const res = await fetch(
                    `https://docs.evocave.com/wp-json/wp/v2/posts?search=${encodeURIComponent(debouncedQuery)}&per_page=6&_fields=id,title,excerpt,link`,
                );
                if (!res.ok) throw new Error();
                const data = await res.json();
                setResults(
                    data.map((p: any) => ({
                        id: p.id,
                        title: p.title?.rendered?.replace(/<[^>]+>/g, "") ?? "",
                        excerpt: p.excerpt?.rendered?.replace(/<[^>]+>/g, "").slice(0, 100) ?? "",
                        link: p.link,
                    })),
                );
            } catch {
                setResults([]);
            } finally {
                setLoading(false);
                setSearched(true);
            }
        }
        search();
    }, [debouncedQuery]);

    return (
        <div className="flex flex-col gap-3 px-4 py-4">
            {/* Search */}
            <div className="relative">
                <Search className="text-muted-foreground/50 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <input
                    type="text"
                    placeholder="Search documentation..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="bg-secondary/20 border-border text-foreground placeholder:text-muted-foreground/50 focus:border-ring/70 w-full rounded-lg border py-2 pr-4 pl-9 text-sm transition-colors focus:outline-none"
                />
                {loading && (
                    <Loader2 className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin" />
                )}
            </div>

            {/* Results */}
            {results.length > 0 ? (
                <div className="border-border divide-border/60 divide-y overflow-hidden rounded-lg border">
                    {results.map((doc) => (
                        <a
                            key={doc.id}
                            href={doc.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group hover:bg-secondary/20 flex items-start gap-2 px-3 py-2.5 transition-colors"
                        >
                            <BookOpen className="text-muted-foreground mt-0.5 h-3.5 w-3.5 shrink-0" />
                            <div className="min-w-0 flex-1">
                                <p className="text-foreground line-clamp-1 text-xs font-medium transition-colors group-hover:text-white">
                                    {doc.title}
                                </p>
                                {doc.excerpt && (
                                    <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs">
                                        {doc.excerpt}
                                    </p>
                                )}
                            </div>
                            <ChevronRight className="text-muted-foreground mt-0.5 h-3.5 w-3.5 shrink-0" />
                        </a>
                    ))}
                </div>
            ) : searched && !loading ? (
                <div className="py-6 text-center">
                    <p className="text-muted-foreground text-sm">No results for "{query}"</p>
                    <a
                        href="https://docs.evocave.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 block text-xs text-blue-400 transition-colors hover:text-blue-300"
                    >
                        Browse all docs →
                    </a>
                </div>
            ) : !query ? (
                <div className="py-4 text-center">
                    <a
                        href="https://docs.evocave.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground block text-xs transition-colors"
                    >
                        Browse docs.evocave.com →
                    </a>
                </div>
            ) : null}
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────
export function ChatBubble() {
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>("chat");

    useEffect(() => {
        function handler(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, []);

    const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
        { id: "chat", label: "Help Assistant", icon: Bot },
        { id: "docs", label: "Docs", icon: BookOpen },
    ];

    return (
        <div className="fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6">
            {/* Widget panel */}
            {open && (
                <>
                    {/* Mobile backdrop */}
                    <div
                        className="fixed inset-0 -z-10 bg-black/40 backdrop-blur-sm sm:hidden"
                        onClick={() => setOpen(false)}
                    />

                    <div
                        className={cn(
                            "bg-popover border-border flex flex-col overflow-hidden rounded-2xl border shadow-2xl",
                            // Mobile — bottom sheet
                            "fixed right-2 bottom-16 left-2 h-[75svh] rounded-b-none sm:rounded-b-2xl",
                            // Desktop — floating panel
                            "sm:absolute sm:right-0 sm:bottom-14 sm:left-auto sm:h-130 sm:w-90",
                        )}
                    >
                        {/* Handle — mobile only */}
                        <div className="flex shrink-0 justify-center pt-3 pb-1 sm:hidden">
                            <div className="bg-border h-1 w-10 rounded-full" />
                        </div>

                        {/* Header */}
                        <div className="border-border flex shrink-0 items-center justify-between border-b px-4 py-3">
                            <div className="flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600">
                                    <MessageCircle className="h-3.5 w-3.5 text-white" />
                                </div>
                                <p className="text-foreground text-sm font-semibold">
                                    Evocave Help
                                </p>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Tab bar */}
                        <div className="border-border flex shrink-0 border-b">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={cn(
                                            "flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors",
                                            activeTab === tab.id
                                                ? "text-foreground border-b-2 border-blue-500"
                                                : "text-muted-foreground hover:text-foreground",
                                        )}
                                    >
                                        <Icon className="h-3.5 w-3.5" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Tab content — flex-1 */}
                        <div className="min-h-0 flex-1 overflow-hidden">
                            {activeTab === "chat" && <ChatTab />}
                            {activeTab === "docs" && (
                                <div className="h-full overflow-y-auto">
                                    <DocsTab />
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="border-border shrink-0 border-t px-4 py-2 text-center">
                            <p className="text-muted-foreground/40 text-[10px]">
                                Powered by Evocave Help
                            </p>
                        </div>
                    </div>
                </>
            )}

            {/* Bubble button */}
            <button
                onClick={() => setOpen(!open)}
                className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all hover:scale-105 active:scale-95",
                    open ? "bg-zinc-700 text-white" : "bg-blue-600 text-white hover:bg-blue-500",
                )}
                aria-label="Help"
            >
                {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
            </button>
        </div>
    );
}
