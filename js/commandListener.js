document.addEventListener("DOMContentLoaded", () => {
    const terminalPanel = document.getElementById("terminalPanel");
    const terminalOutput = document.querySelector("[data-terminal-output]");
    const terminalForm = document.querySelector("[data-terminal-form]");
    const cursorInput = document.getElementById("cursorInput");
    const openButtons = document.querySelectorAll("[data-open-terminal]");
    const closeButton = document.querySelector("[data-close-terminal]");
    const openLabel = "Open terminal mode";
    const closeLabel = "Close terminal mode";

    if (!terminalPanel || !terminalOutput || !terminalForm || !cursorInput) {
        return;
    }

    function syncLauncherState(isOpen) {
        openButtons.forEach((button) => {
            button.setAttribute("aria-expanded", String(isOpen));
            button.textContent = isOpen ? closeLabel : openLabel;
        });
    }

    const commands = [
        "help",
        "about",
        "projects",
        "skills",
        "contact",
        "clr",
        "clear",
        "quickview",
        "echo",
    ];

    const responses = {
        help: [
            "<strong>Available commands:</strong>",
            "about - Short background about me",
            "projects - Links and project snapshots",
            "skills - My current stack",
            "contact - Email and GitHub links",
            "clear / clr - Reset this panel",
        ],
        about: [
            "<strong>About:</strong>",
            "I’m Zaden Maestas, a developer who likes practical software, backend systems, and Linux-friendly workflows.",
        ],
        projects: [
            "<strong>Projects:</strong>",
            "GitHub: https://github.com/ZadenMaestas",
        ],
        skills: [
            "<strong>Skills:</strong>",
            "Python, JavaScript, Node.js, HTML, CSS, Bash, C++, PHP, Processing",
        ],
        contact: [
            "<strong>Contact:</strong>",
            "zadenmaestasdev@gmail.com",
        ],
    };

    function openTerminal(focusInput = true) {
        terminalPanel.hidden = false;
        syncLauncherState(true);
        terminalPanel.scrollIntoView({ behavior: "smooth", block: "start" });
        if (focusInput) {
            window.setTimeout(() => cursorInput.focus(), 50);
        }
    }

    function closeTerminal() {
        terminalPanel.hidden = true;
        syncLauncherState(false);
    }

    function toggleTerminal() {
        if (terminalPanel.hidden) {
            openTerminal();
            return;
        }

        closeTerminal();
    }

    function clearOutput() {
        terminalOutput.innerHTML = "";
        renderSystemLine("Terminal reset. Type help to see available commands.");
    }

    function renderSystemLine(text, className = "") {
        const line = document.createElement("p");
        line.className = `terminal-line ${className}`.trim();
        line.innerHTML = text;
        terminalOutput.appendChild(line);
    }

    function renderPromptLine(command) {
        renderSystemLine(`<strong>zaden@zadenm.dev ~&gt;</strong> ${escapeHtml(command)}`);
    }

    function runQuickView() {
        renderResponse("about");
        renderResponse("contact");
        renderResponse("projects");
    }

    function renderResponse(command) {
        const lines = responses[command];
        if (!lines) {
            renderSystemLine(`Error: ${escapeHtml(command)} is not a valid command. Try help.`, "error");
            return;
        }

        lines.forEach((line) => renderSystemLine(line));
    }

    function handleEcho(command) {
        const text = command.slice(4).trim();
        if (!text) {
            renderSystemLine("Usage: echo your message here", "error");
            return;
        }

        if (text.toLowerCase().includes("hello there")) {
            const image = document.createElement("img");
            image.src = "/images/obiWanHelloThere.gif";
            image.alt = "Obi-Wan Kenobi saying hello there";
            image.style.maxWidth = "100%";
            image.style.borderRadius = "16px";
            terminalOutput.appendChild(image);
            return;
        }

        renderSystemLine(escapeHtml(text));
    }

    function processCommand(rawCommand) {
        const command = normalizeCommand(rawCommand).toLowerCase();

        if (!command) {
            return;
        }

        renderPromptLine(rawCommand);

        switch (command) {
            case "help":
                renderResponse("help");
                break;
            case "about":
                renderResponse("about");
                break;
            case "projects":
                renderResponse("projects");
                break;
            case "skills":
                renderResponse("skills");
                break;
            case "contact":
                renderResponse("contact");
                break;
            case "quickview":
                runQuickView();
                break;
            case "clear":
            case "clr":
                clearOutput();
                break;
            default:
                if (command.startsWith("echo")) {
                    handleEcho(rawCommand);
                } else {
                    renderSystemLine(`Error: ${escapeHtml(rawCommand)} is not a valid command. Try help.`, "error");
                }
        }
    }

    function autoCompleteCommand() {
        const current = normalizeCommand(cursorInput.value).toLowerCase();
        const match = commands.find((cmd) => cmd.startsWith(current));
        if (match) {
            cursorInput.value = match;
        }
    }

    function checkAutoExecParam() {
        const urlParams = new URLSearchParams(window.location.search);
        const autoExec = urlParams.get("autoExec");
        if (!autoExec) {
            return;
        }

        openTerminal(false);
        clearOutput();
        processCommand(autoExec);
    }

    function seedWelcome() {
        renderSystemLine("<strong>Optional terminal mode</strong>");
        renderSystemLine("Use this panel if you want the old command-driven layout.");
        renderSystemLine("Try help, quickview, or contact.");
    }

    syncLauncherState(false);

    openButtons.forEach((button) => {
        button.addEventListener("click", toggleTerminal);
    });

    if (closeButton) {
        closeButton.addEventListener("click", closeTerminal);
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !terminalPanel.hidden) {
            closeTerminal();
            openButtons[0]?.focus();
        }
    });

    terminalForm.addEventListener("submit", (event) => {
        event.preventDefault();
        processCommand(cursorInput.value);
        cursorInput.value = "";
        cursorInput.focus();
    });

    cursorInput.addEventListener("keydown", (event) => {
        if (event.key === "Tab") {
            event.preventDefault();
            autoCompleteCommand();
        }

        if (event.ctrlKey && event.key.toLowerCase() === "l") {
            event.preventDefault();
            clearOutput();
        }
    });

    seedWelcome();
    document.addEventListener("click", (event) => {
        if (!terminalPanel.hidden && !terminalPanel.contains(event.target) && !event.target.matches("[data-open-terminal]")) {
            cursorInput.focus();
        }
    });

    checkAutoExecParam();
});
