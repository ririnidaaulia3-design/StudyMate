// StudyMate: DOM interactions, search/filter, localStorage, theme, and form validation.
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

document.addEventListener("DOMContentLoaded", () => {
  // Footer year
  $$(".year").forEach(el => el.textContent = new Date().getFullYear());

  // Responsive navigation
  const menuButton = $(".menu-toggle");
  const navLinks = $(".nav-links");
  if (menuButton && navLinks) {
    menuButton.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.textContent = isOpen ? "✕" : "☰";
    });
  }

  // Dark/light mode saved in localStorage
  const themeButton = $(".theme-toggle");
  const savedTheme = localStorage.getItem("studymate-theme");
  if (savedTheme === "dark") document.body.classList.add("dark");
  if (themeButton) {
    themeButton.textContent = document.body.classList.contains("dark") ? "☀" : "☾";
    themeButton.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      const mode = document.body.classList.contains("dark") ? "dark" : "light";
      localStorage.setItem("studymate-theme", mode);
      themeButton.textContent = mode === "dark" ? "☀" : "☾";
    });
  }

  // Partner directory: sample data for the static project
  const partners = [
    {id:1,name:"Nadia Putri",grade:"Kelas XII RPL",subject:"Matematika",style:"Diskusi & latihan soal",emoji:"👩🏻‍🎓",bio:"Suka belajar bareng dan membahas soal sampai benar-benar paham.",time:"Sore hari"},
    {id:2,name:"Rafi Akbar",grade:"Kelas XI",subject:"Informatika",style:"Praktik langsung",emoji:"👨🏽‍💻",bio:"Tertarik dengan coding, desain web, dan proyek kecil.",time:"Akhir pekan"},
    {id:3,name:"Alya Safitri",grade:"Kelas XII",subject:"Bahasa Inggris",style:"Conversation practice",emoji:"👩🏽",bio:"Ingin meningkatkan speaking dan memperkaya kosakata.",time:"Malam hari"},
    {id:4,name:"Dimas Pratama",grade:"Kelas XI",subject:"Fisika",style:"Belajar konsep",emoji:"👨🏻‍🔬",bio:"Senang membuat rangkuman dan memahami konsep dari dasar.",time:"Sore hari"},
    {id:5,name:"Salsa Maharani",grade:"Kelas XII",subject:"Biologi",style:"Mind map & kuis",emoji:"👩🏼‍🔬",bio:"Mencari teman untuk persiapan ujian dan bertukar catatan.",time:"Siang hari"},
    {id:6,name:"Fajar Ramadhan",grade:"Kelas X",subject:"Sejarah",style:"Cerita & diskusi",emoji:"🧑🏽‍🎓",bio:"Suka menghubungkan peristiwa sejarah dengan kehidupan sekarang.",time:"Akhir pekan"}
  ];

  const grid = $("#partnerGrid");
  if (grid) {
    const searchInput = $("#partnerSearch");
    const subjectFilter = $("#subjectFilter");
    const countLabel = $("#resultCount");
    const savedCount = $("#savedCount");
    const emptyState = $("#emptyState");
    const saved = new Set(JSON.parse(localStorage.getItem("studymate-saved") || "[]"));

    const render = () => {
      const keyword = searchInput.value.trim().toLowerCase();
      const subject = subjectFilter.value;
      const visible = partners.filter(person => {
        const matchesText = `${person.name} ${person.subject} ${person.grade} ${person.style}`.toLowerCase().includes(keyword);
        const matchesSubject = subject === "all" || person.subject === subject;
        return matchesText && matchesSubject;
      });
      grid.innerHTML = visible.map(person => `
        <article class="partner-card">
          <div class="partner-top">
            <div class="person-avatar" aria-hidden="true">${person.emoji}</div>
            <div class="person-info"><h3>${person.name}</h3><p>${person.grade}</p><p><span class="online-dot"></span>Siap belajar</p></div>
          </div>
          <span class="subject-tag">${person.subject}</span>
          <p>${person.bio}</p>
          <div class="partner-bottom"><small>🕒 ${person.time}</small>
            <div class="partner-actions"><button class="save-btn ${saved.has(person.id) ? "saved" : ""}" data-save="${person.id}" aria-pressed="${saved.has(person.id)}">${saved.has(person.id) ? "♥ Tersimpan" : "♡ Simpan"}</button><a class="invite-btn" href="dashboard.html">Ajak belajar ↗</a></div>
          </div>
        </article>`).join("");
      countLabel.textContent = `Menampilkan ${visible.length} dari ${partners.length} partner`;
      savedCount.textContent = saved.size;
      emptyState.classList.toggle("hidden", visible.length !== 0);
    };

    grid.addEventListener("click", event => {
      const button = event.target.closest("[data-save]");
      if (!button) return;
      const id = Number(button.dataset.save);
      saved.has(id) ? saved.delete(id) : saved.add(id);
      localStorage.setItem("studymate-saved", JSON.stringify([...saved]));
      render();
    });
    searchInput.addEventListener("input", render);
    subjectFilter.addEventListener("change", render);
    $("#resetSearch").addEventListener("click", () => {
      searchInput.value = "";
      subjectFilter.value = "all";
      render();
    });
    render();
  }

  // Dashboard: tasks and study sessions stored locally in this browser
  const taskList = $("#taskList");
  if (taskList) {
    const read = (key) => { try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; } };
    let tasks = read("studymate-tasks");
    let sessions = read("studymate-sessions");
    const save = () => { localStorage.setItem("studymate-tasks", JSON.stringify(tasks)); localStorage.setItem("studymate-sessions", JSON.stringify(sessions)); };
    const renderTasks = () => {
      taskList.innerHTML = tasks.map(t => `<li class="task-item ${t.done ? "done" : ""}"><input type="checkbox" data-task-check="${t.id}" ${t.done ? "checked" : ""} aria-label="Tandai target selesai"><span>${escapeHTML(t.text)}</span><button class="delete-item" data-task-delete="${t.id}" aria-label="Hapus target">×</button></li>`).join("");
      const done = tasks.filter(t => t.done).length, pct = tasks.length ? Math.round(done / tasks.length * 100) : 0;
      $("#taskTotal").textContent = tasks.length; $("#taskDone").textContent = done; $("#taskProgressText").textContent = `${pct}% selesai`; $("#taskProgressBar").style.width = `${pct}%`; $("#taskEmpty").classList.toggle("hidden", tasks.length > 0);
    };
    const renderSessions = () => {
      sessions.sort((a,b) => (a.date+a.time).localeCompare(b.date+b.time));
      $("#sessionList").innerHTML = sessions.map(x => { const d = new Date(x.date+"T00:00:00"); return `<div class="session-item"><div class="session-date"><small>${d.toLocaleDateString("id-ID",{month:"short"})}</small>${d.getDate()}</div><div class="session-detail"><b>${escapeHTML(x.subject)}</b><small>${x.time} · ${escapeHTML(x.note || "Sesi belajar")}</small></div><button class="delete-item" data-session-delete="${x.id}" aria-label="Hapus jadwal">×</button></div>`; }).join("");
      $("#sessionTotal").textContent = sessions.length; $("#sessionEmpty").classList.toggle("hidden", sessions.length > 0);
    };
    const favs = (() => { try { return JSON.parse(localStorage.getItem("studymate-saved") || "[]"); } catch { return []; } })(); $("#favoriteTotal").textContent = favs.length;
    $("#taskForm").addEventListener("submit", e => { e.preventDefault(); const text = $("#taskInput").value.trim(); if (!text) return; tasks.push({id:Date.now(),text,done:false}); $("#taskInput").value=""; save(); renderTasks(); });
    taskList.addEventListener("change", e => { const id=Number(e.target.dataset.taskCheck); if (!id) return; const t=tasks.find(x=>x.id===id); if(t)t.done=e.target.checked; save(); renderTasks(); });
    taskList.addEventListener("click", e => { const id=Number(e.target.dataset.taskDelete); if(!id)return; tasks=tasks.filter(x=>x.id!==id); save(); renderTasks(); });
    $("#sessionDate").min = new Date().toISOString().slice(0,10);
    $("#sessionForm").addEventListener("submit", e => { e.preventDefault(); sessions.push({id:Date.now(),subject:$("#sessionSubject").value.trim(),date:$("#sessionDate").value,time:$("#sessionTime").value,note:$("#sessionNote").value.trim()}); e.target.reset(); $("#sessionDate").min=new Date().toISOString().slice(0,10); save(); renderSessions(); });
    $("#sessionList").addEventListener("click", e => { const id=Number(e.target.dataset.sessionDelete); if(!id)return; sessions=sessions.filter(x=>x.id!==id); save(); renderSessions(); });
    renderTasks(); renderSessions();
  }
  function escapeHTML(value) { return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }

  // Contact form validation (client-side demonstration only)
  const contactForm = $("#contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", event => {
      event.preventDefault();
      const name = $("#name").value.trim();
      const email = $("#email").value.trim();
      const message = $("#message").value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      $("#nameError").textContent = name.length < 3 ? "Nama minimal 3 karakter." : "";
      $("#emailError").textContent = !emailPattern.test(email) ? "Masukkan alamat email yang valid." : "";
      $("#messageError").textContent = message.length < 10 ? "Pesan minimal 10 karakter." : "";
      const valid = name.length >= 3 && emailPattern.test(email) && message.length >= 10;
      $("#formSuccess").classList.toggle("hidden", !valid);
      if (valid) contactForm.reset();
    });
  }
});
