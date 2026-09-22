const fs = {
  "This PC": {
    items: [{ name: "Users", type: "folder" }]
  },
  "This PC/Users": {
    items: [{ name: "Vincent", type: "folder" }]
  },
  "This PC/Users/Vincent": {
    items: [
      { name: "projects", type: "folder" },
      { name: "about.txt", type: "file", icon: "📄", content: "Hi, I'm Vincent.\n\nI make games and websites.\n\nWelcome to my corner of the internet." },
      { name: "contact.txt", type: "file", icon: "📄", content: "Email: vincent@example.com\nTwitter: @vincent" },
      { name: "resume.pdf", type: "file", icon: "📕", content: "[PDF preview would go here]" }
    ]
  },
  "This PC/Users/Vincent/projects": {
    items: [
      { name: "game-one", type: "folder" },
      { name: "game-two", type: "folder" },
      { name: "portfolio.txt", type: "file", icon: "📄", content: "This very website :)" }
    ]
  },
  "This PC/Users/Vincent/projects/game-one": { items: [] },
  "This PC/Users/Vincent/projects/game-two": { items: [] }
};

let currentPath = "This PC/Users/Vincent";
let history = [currentPath];
let historyIndex = 0;

const filesEl = document.getElementById("files");
const breadcrumbEl = document.getElementById("breadcrumb");
const statusEl = document.getElementById("status");
const backBtn = document.getElementById("back");
const forwardBtn = document.getElementById("forward");
const upBtn = document.getElementById("up");

function render() {
  const folder = fs[currentPath] || { items: [] };

  breadcrumbEl.innerHTML = "";
  const parts = currentPath.split("/");
  parts.forEach((part, i) => {
    const crumb = document.createElement("span");
    crumb.className = "crumb";
    crumb.textContent = part;
    crumb.onclick = () => navigate(parts.slice(0, i + 1).join("/"));
    breadcrumbEl.appendChild(crumb);
    if (i < parts.length - 1) {
      const sep = document.createElement("span");
      sep.className = "crumb-sep";
      sep.textContent = "›";
      breadcrumbEl.appendChild(sep);
    }
  });

  filesEl.innerHTML = "";
  if (folder.items.length === 0) {
    const empty = document.createElement("div");
    empty.style.cssText = "color:#999; font-style:italic; padding:12px;";
    empty.textContent = "This folder is empty.";
    filesEl.appendChild(empty);
  } else {
    folder.items.forEach(item => {
      const el = document.createElement("div");
      el.className = "file";
      el.innerHTML = `<span class="file-icon">${item.icon || (item.type === "folder" ? "📁" : "📄")}</span><span>${item.name}</span>`;
      el.onclick = () => {
        document.querySelectorAll(".file").forEach(f => f.classList.remove("selected"));
        el.classList.add("selected");
      };
      el.ondblclick = () => {
        if (item.type === "folder") {
          navigate(currentPath + "/" + item.name);
        } else {
          showFile(item);
        }
      };
      filesEl.appendChild(el);
    });
  }

  statusEl.textContent = `${folder.items.length} item${folder.items.length === 1 ? "" : "s"}`;

  // Nav buttons
  backBtn.disabled = historyIndex <= 0;
  forwardBtn.disabled = historyIndex >= history.length - 1;
  upBtn.disabled = currentPath === "This PC";
}

function navigate(path) {
  if (!fs[path]) return;
  currentPath = path;
  history = history.slice(0, historyIndex + 1);
  history.push(path);
  historyIndex = history.length - 1;
  render();
}

function showFile(item) {
  filesEl.innerHTML = `
    <div style="padding:20px; font-family: Consolas, 'Cascadia Code', monospace; font-size:13px; line-height:1.7; white-space:pre-wrap; color:#1a1a1a;">
      <div style="margin-bottom:16px; color:#5c5c5c; font-family:'Segoe UI',sans-serif; font-size:12px;">
        ${currentPath}/${item.name}
      </div>
      ${item.content}
    </div>
  `;
  statusEl.textContent = item.name;
}

backBtn.onclick = () => {
  if (historyIndex > 0) {
    historyIndex--;
    currentPath = history[historyIndex];
    render();
  }
};

forwardBtn.onclick = () => {
  if (historyIndex < history.length - 1) {
    historyIndex++;
    currentPath = history[historyIndex];
    render();
  }
};

upBtn.onclick = () => {
  const parts = currentPath.split("/");
  if (parts.length > 1) navigate(parts.slice(0, -1).join("/"));
};

render();
