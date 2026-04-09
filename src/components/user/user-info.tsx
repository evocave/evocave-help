export default function UserInfo() {
    return (
        <div className="mb-2 flex items-center gap-3 px-2.5 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                AN
            </div>
            <div>
                <p className="text-foreground text-sm font-medium">Andrian Nugraha</p>
                <p className="text-muted-foreground text-xs">andrian@evocave.com</p>
            </div>
        </div>
    );
}
