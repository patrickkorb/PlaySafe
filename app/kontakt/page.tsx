import { Suspense } from "react";
import KontaktForm from "./KontaktForm";

export default function Kontakt() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <KontaktForm />
        </Suspense>
    )
}
