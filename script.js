const envelope = document.getElementById("envelope");
const btnNo = document.getElementById("btn-no");
const btnYes = document.getElementById("btn-yes");
const noHint = document.getElementById("no-hint");
const slots = document.querySelectorAll(".slot");
const noteInput = document.getElementById("note-input");
const btnConfirm = document.getElementById("btn-confirm");
const confirmedTime = document.getElementById("confirmed-time");
const confirmedNote = document.getElementById("confirmed-note");

const teasingMessages = [
  "Vraiment ?",
  "Tu es sûre...",
  "Allez, réfléchis encore un peu...",
  "Ça ne sert à rien de dire non..."
];

let noClicks = 0;
let selectedTime = "";

function goToStep(nextStepId) {
  const current = document.querySelector(".screen.active");
  const next = document.getElementById(nextStepId);
  if (!current || !next || current === next) return;

  current.classList.add("leaving");
  setTimeout(() => {
    current.classList.remove("active", "leaving");
    next.classList.add("active");
  }, 280);
}

// Screen 1 -> Screen 2: Open envelope
envelope.addEventListener("click", () => {
  if (envelope.classList.contains("opening")) return;
  envelope.classList.add("opening");

  setTimeout(() => {
    goToStep("step-2");
  }, 700);
});

// Screen 2: Shrinking "Non" button & growing "Oui" button
btnNo.addEventListener("click", () => {
  noClicks++;

  const noScale = Math.max(0.45, 1 - noClicks * 0.14);
  const yesScale = Math.min(1.2, 1 + noClicks * 0.05);

  btnNo.style.transform = `scale(${noScale})`;
  btnYes.style.transform = `scale(${yesScale})`;

  const messageIndex = Math.min(noClicks - 1, teasingMessages.length - 1);
  noHint.textContent = teasingMessages[messageIndex];
  noHint.classList.add("visible");
});

// Screen 2 -> Screen 3: Accept date
btnYes.addEventListener("click", () => {
  goToStep("step-3");
});

// Screen 3: Pick a time slot
slots.forEach((slot) => {
  slot.addEventListener("click", () => {
    slots.forEach((s) => s.classList.remove("selected"));
    slot.classList.add("selected");
    selectedTime = slot.dataset.time;
    btnConfirm.disabled = false;
  });
});

// Screen 3 -> Screen 4: Confirm choice
btnConfirm.addEventListener("click", async () => {
  if (!selectedTime) return;

  const note = noteInput.value.trim();
  confirmedTime.textContent = selectedTime;

  if (note) {
    confirmedNote.textContent = `« ${note} »`;
    confirmedNote.hidden = false;
  } else {
    confirmedNote.hidden = true;
  }

  await sendResponse(selectedTime, note);
  goToStep("step-4");
});

// Optional: receive the chosen time + note via Web3Forms (or an n8n/Discord webhook)
async function sendResponse(time, note) {
  console.log("Réponse enregistrée :", { time, note });

  /* Uncomment and paste your Web3Forms key when ready to deploy:
  try {
    await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: "YOUR_WEB3FORMS_ACCESS_KEY",
        subject: "Nouvelle réponse au date !",
        heure: time,
        note: note || "Aucune note"
      })
    });
  } catch (err) {
    console.error("Erreur d'envoi :", err);
  }
  */
}