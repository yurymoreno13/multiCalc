// frontend/multicalc-next/components/ui/Card.tsx
import { PropsWithChildren } from "react";


export function Card({ children }: PropsWithChildren) {
return (
<div className="rounded-2xl border border-gray-200/70 bg-white shadow-sm p-5">
{children}
</div>
);
}


export function CardTitle({ children }: PropsWithChildren) {
return <h3 className="text-lg font-semibold mb-3">{children}</h3>;
}


export function CardFooter({ children }: PropsWithChildren) {
return <div className="mt-4 text-sm text-gray-500">{children}</div>;
}