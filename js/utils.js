function getCurrentDateString() {
    const date = new Date();
    return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function escapeHtml(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function normalizeCommand(command) {
    return command.trim().replace(/\s+/g, " ");
}

document.addEventListener("DOMContentLoaded", () => {
    const dateTarget = document.getElementById("currentDate");
    if (dateTarget) {
        dateTarget.textContent = getCurrentDateString();
    }
});
