// Sayfa aşağı kaydırıldığında üst menüyü sabitle ve koyulaştır
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});
// Oyun Detay Modalı Mantığı
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('gameModal');
    const closeBtn = document.querySelector('.modal-close');
    const gameCards = document.querySelectorAll('.game-card');

    const gameData = {
        "coco": {
            title: "Coco Place",
            desc: "Gerilim dolu mekanlar ve keşif odaklı bağımsız deneyim. Karanlık sırları ortaya çıkarın ve hayatta kalmaya çalışın.",
            features: ["Atmosferik Ses Tasarımı", "Keşif Odaklı Bulmacalar", "Yeni Nesil Görsel Kalite"],
            demoLink: "https://dosya.co/h2cmbgvs9k9d/Yeni_WinRAR_arşivi.rar.html" // Buraya demo linkini koyabilirsin
        },
        "korku": {
            title: "Atmosferik Korku Projesi",
            desc: "Karanlık bulmacalar ve hayatta kalma mekanikleriyle dolu, korku dolu bir serüven sizi bekliyor.",
            features: ["Dinamik Gerilim Sistemi", "Derinlemesine Hikaye Anlatımı", "Özel Yapım Atmosferik Müzikler"],
            demoLink: "#"
        }
    };

    gameCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            const key = index === 0 ? 'coco' : 'korku';
            const data = gameData[key];

            document.getElementById('modalTitle').innerText = data.title;
            document.getElementById('modalDesc').innerText = data.desc;
            
            const featureList = document.getElementById('modalFeatureList');
            featureList.innerHTML = '';
            data.features.forEach(feat => {
                let li = document.createElement('li');
                li.innerText = feat;
                featureList.appendChild(li);
            });

            const demoBtn = document.getElementById('modalDemoBtn');
            if (key === 'coco') {
                demoBtn.style.display = 'inline-block';
                demoBtn.href = data.demoLink;
            } else {
                demoBtn.style.display = 'none';
            }

            modal.style.display = 'flex';
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});
// Navbar Scroll Efekti & Sinematik Giriş Animasyonları
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    
    // Sayfa kaydırılınca üst barı keskinleştir
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(5, 5, 5, 0.98)';
            header.style.padding = '15px 50px';
            header.style.borderBottom = '1px solid rgba(229, 9, 20, 0.4)';
        } else {
            header.style.background = 'rgba(10, 10, 10, 0.85)';
            header.style.padding = '20px 50px';
            header.style.borderBottom = '1px solid #1c1c1c';
        }
    });

    // Kartların ekrana geldikçe süzülerek belirmesi
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.game-card, .team-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
// 1. Daktilo (Typing) Efekti - Hero Başlığı İçin
document.addEventListener('DOMContentLoaded', function() {
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        const text = heroTitle.innerText;
        heroTitle.innerText = '';
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                heroTitle.innerText += text.charAt(i);
                i++;
                setTimeout(typeWriter, 35);
            }
        }
        setTimeout(typeWriter, 400);
    }

    // Toast Bildirim Sistemi Yaratıcısı
    window.showToast = function(message) {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<span style="color: #e50914; font-weight: bold;">◈ RUSHDEV:</span> ${message}`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 4000);
    };

    // Navigasyon linklerine tıklandığında şık bildirim tetiklemesi
    document.querySelectorAll('.pro-nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            const sectionName = link.innerText.trim();
            showToast(`${sectionName} bölümüne yönlendiriliyorsunuz...`);
        });
    });
});

// Modal Sekme Değiştirme Fonksiyonu
function switchModalTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
    });
    document.querySelectorAll('.modal-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    document.getElementById('tab-' + tabName).style.display = 'block';
    event.currentTarget.classList.add('active');
}
// Footer Yasal ve Bilgi Penceresi İçerikleri
const infoContents = {
    privacy: {
        title: "Gizlilik Politikası",
        body: "RushDev Studios olarak kullanıcı gizliliğine önem veriyoruz. Web sitemiz ve oyunlarımız üzerinden paylaştığınız başvuru bilgileri, e-posta adresleri ve teknik veriler yalnızca stüdyo içi değerlendirme ve destek süreçlerinde kullanılır; üçüncü taraflarla kesinlikle paylaşılmaz."
    },
    terms: {
        title: "Kullanım Şartları",
        body: "Bu web sitesinde yer alan tüm görseller, oyun demoları, logolar ve yazılı içerikler RushDev Studios'a aittir. İzinsiz kopyalanması, ticari amaçla dağıtılması veya tersine mühendislik işlemlerine tabi tutulması yasaktır."
    },
    cookies: {
        title: "Çerez Politikası",
        body: "Sitemizde dil tercihinizi (TR/EN) hatırlamak ve arayüz performansını optimize etmek amacıyla yalnızca zorunlu teknik çerezler kullanılmaktadır. Reklam veya takip amaçlı çerez barındırmaz."
    },
    support: {
        title: "Destek Hattı & Teknik Yardım",
        body: "Oyunlarımızla ilgili hata bildirimleri, kapalı beta erişim sorunları veya teknik destek talepleriniz için resmi Discord sunucumuzdaki destek kanalını kullanabilir veya <strong>contact@rushdev.com</strong> adresine e-posta gönderebilirsiniz."
    },
    press: {
        title: "Basın & Medya Kiti",
        body: "İçerik üreticileri, yayıncılar ve oyun basını için yüksek çözünürlüklü logolar, Coco Place ekran görüntüleri ve tanıtım fragmanları basın kitimizde yer almaktadır. Erken erişim anahtarı talepleri için bize e-posta yoluyla ulaşabilirsiniz."
    }
};

function openInfoModal(key) {
    const data = infoContents[key];
    if (!data) return;
    document.getElementById('infoModalTitle').innerText = data.title;
    document.getElementById('infoModalBody').innerHTML = data.body;
    
    const modal = document.getElementById('infoModal');
    modal.classList.add('active');
}

function closeInfoModal() {
    const modal = document.getElementById('infoModal');
    modal.classList.remove('active');
}

// Dışarı tıklayınca veya ESC'ye basınca animasyonlu kapatma
window.addEventListener('click', function(e) {
    const modal = document.getElementById('infoModal');
    if (e.target === modal) {
        closeInfoModal();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeInfoModal();
    }
});