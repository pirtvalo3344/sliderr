(function () {
  const currentUser = JSON.parse(localStorage.getItem('sliderr_user'));
  if (!currentUser) return;

  // 1. Toast HTML Elemanını Dinamik Olarak Sayfaya Ekle
  const toastEl = document.createElement('div');
  toastEl.className = 'toast-notification';
  toastEl.id = 'globalToast';
  toastEl.innerHTML = `
    <img id="toastAvatar" src="" class="toast-avatar">
    <div class="toast-content">
      <div id="toastTitle" class="toast-title"></div>
      <div id="toastText" class="toast-text"></div>
    </div>
  `;
  document.body.appendChild(toastEl);

  let toastTimeout = null;

  // 2. Canlı Firestore Bildirim Dinleyicisi
  db.collection("notifications")
    .where("targetUid", "==", currentUser.uid)
    .where("read", "==", false)
    .onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === "added") {
          const notif = change.doc.data();
          const docId = change.doc.id;

          // Eğer kullanıcı zaten tam o sohbet sayfasındaysa (chat.html?uid=X) bildirim çıkarma!
          const currentUrl = window.location.href;
          if (currentUrl.includes("chat.html") && currentUrl.includes(notif.senderUid)) {
            // Mesajı okundu olarak işaretle ve geç
            db.collection("notifications").doc(docId).update({ read: true });
            return;
          }

          // Bildirimi Göster
          showToastNotification(notif, docId);
        }
      });
    });

  function showToastNotification(notif, docId) {
    const toast = document.getElementById('globalToast');
    const avatar = document.getElementById('toastAvatar');
    const title = document.getElementById('toastTitle');
    const text = document.getElementById('toastText');

    avatar.src = notif.senderAvatar || 'https://via.placeholder.com/150';
    title.innerText = `${notif.senderName} Sana Yazdı.`;
    text.innerText = notif.messageText;

    // Tıklayınca mesaja yönlendir
    toast.onclick = () => {
      db.collection("notifications").doc(docId).update({ read: true });
      window.location.href = `chat.html?uid=${notif.senderUid}`;
    };

    // Kutucuğu Göster
    toast.classList.add('show');

    if (toastTimeout) clearTimeout(toastTimeout);

    // Tam 2 saniye sonra kapat ve okunmuş yap
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
      db.collection("notifications").doc(docId).update({ read: true });
    }, 2000);
  }
})();