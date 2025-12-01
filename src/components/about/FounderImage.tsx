"use client";

import { useState } from "react";

export default function FounderImage() {
    const [hasError, setHasError] = useState(false);

    if (hasError) {
        return (
            <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 800'%3E%3Crect fill='%231A365D' width='800' height='800'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='300' fill='white' font-family='Arial'%3ERR%3C/text%3E%3C/svg%3E"
                alt="Rafael Rivas Fallback"
                className="w-full h-full object-cover"
            />
        );
    }

    return (
        <img
            src="/images/rafael-rivas.jpg"
            alt="Rafael Rivas"
            className="w-full h-full object-cover"
            onError={() => setHasError(true)}
        />
    );
}
