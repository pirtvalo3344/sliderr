// URL üzerindeki "room" parametresini otomatik oku (örn: call.html?room=ahmet_mehmet -> CHANNEL: "ahmet_mehmet")
const urlParams = new URLSearchParams(window.location.search);
const CHANNEL = urlParams.get('room') || "sliderr-genel-oda";

// Agora Console panelinden kopyaladığınız App ID değerini buraya yapıştırın
const APP_ID = "cec449a377c448b8bf81495ca346db29"; 
const TOKEN = null; 

let client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
let localAudioTrack = null;
let localVideoTrack = null;

const leaveBtn = document.getElementById("leave-btn");

// Görüşmeyi Otomatik Başlatan Fonksiyon
async function startCall() {
  try {
    // 1. URL'den gelen odaya bağlan
    await client.join(APP_ID, CHANNEL, TOKEN, null);

    // 2. Kamera ve Mikrofonu aç
    localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    localVideoTrack = await AgoraRTC.createCameraVideoTrack();

    // 3. Ekrana bas ve yayını gönder
    localVideoTrack.play("local-player");
    await client.publish([localAudioTrack, localVideoTrack]);

  } catch (error) {
    console.error("Arama başlatılırken hata oluştu:", error);
    alert("Kamera ve mikrofon erişim izni verilmedi.");
  }
}

// Sayfa yüklendiğinde aramayı otomatik başlat
window.addEventListener("DOMContentLoaded", () => {
  startCall();
});

// Karşı Taraf Bağlandığında
client.on("user-published", async (user, mediaType) => {
  await client.subscribe(user, mediaType);

  if (mediaType === "video") {
    user.videoTrack.play("remote-player");
  }

  if (mediaType === "audio") {
    user.audioTrack.play();
  }
});

// Karşı Taraf Ayrıldığında
client.on("user-unpublished", (user) => {
  const remotePlayer = document.getElementById("remote-player");
  if (remotePlayer) {
    remotePlayer.innerHTML = "";
  }
});

// Aramayı Kapat ve Sohbet (DM) Sayfasına Geri Dön
if (leaveBtn) {
  leaveBtn.onclick = async () => {
    if (localAudioTrack) {
      localAudioTrack.close();
    }
    if (localVideoTrack) {
      localVideoTrack.close();
    }

    await client.leave();

    // Aramayı sonlandırınca doğrudan sohbet ekranına yönlendirir
    window.location.href = "chat.html";
  };
}