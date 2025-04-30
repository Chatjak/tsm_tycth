
export const getAvatarColor = (name: string) => {
    const colors = [
        "#4f46e5", "#0891b2", "#7c3aed", "#be123c", "#059669",
        "#ca8a04", "#c026d3", "#0284c7", "#9333ea", "#15803d",
        "#b91c1c", "#0d9488", "#6366f1", "#ea580c", "#4338ca"
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
};


export const adjustColor = (hex: string, percent: number) => {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    r = Math.max(0, Math.min(255, Math.round(r + (percent / 100) * r)));
    g = Math.max(0, Math.min(255, Math.round(g + (percent / 100) * g)));
    b = Math.max(0, Math.min(255, Math.round(b + (percent / 100) * b)));

    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
};


export const priorityColors : {
    [key: string]: {
        badge: string;
        text: string;
    };
} = {
    "High": {
        badge: "bg-red-100 text-red-800 border-red-200",
        text: "text-red-600"
    },
    "Medium": {
        badge: "bg-orange-100 text-orange-800 border-orange-200",
        text: "text-orange-600"
    },
    "Low": {
        badge: "bg-green-100 text-green-800 border-green-200",
        text: "text-green-600"
    },
    "Normal": {
        badge: "bg-blue-100 text-blue-800 border-blue-200",
        text: "text-blue-600"
    }
};



export const getAvatarColorDetail = (name: string) => {
    const colors = [
        "bg-gradient-to-br from-blue-500 to-blue-600",
        "bg-gradient-to-br from-emerald-500 to-emerald-600",
        "bg-gradient-to-br from-purple-500 to-purple-600",
        "bg-gradient-to-br from-amber-500 to-amber-600",
        "bg-gradient-to-br from-pink-500 to-pink-600",
        "bg-gradient-to-br from-indigo-500 to-indigo-600",
        "bg-gradient-to-br from-rose-500 to-rose-600",
        "bg-gradient-to-br from-cyan-500 to-cyan-600",
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
};


export const getPriorityColor = (priority: string) => {
    const colors: Record<string, { bg: string, text: string, border: string }> = {
        "High": { bg: "bg-red-100", text: "text-red-800", border: "border-red-200" },
        "Medium": { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-200" },
        "Low": { bg: "bg-green-100", text: "text-green-800", border: "border-green-200" },
        "Normal": { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" }
    };
    return colors[priority] || colors["Normal"];
};


export const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string, text: string, border: string }> = {
        "Not start": { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-200" },
        "On Progress": { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200" },
        "In Review": { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-200" },
        "Completed": { bg: "bg-green-100", text: "text-green-800", border: "border-green-200" }
    };
    return colors[status] || colors["Not start"];
};