function loadRating() {
    fetch('members.json')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('rating-container');
            data.members.sort((a, b) => b.points - a.points); // Сортируем по количеству баллов

            data.members.forEach((member, index) => {
                const item = document.createElement('div');
                item.className = 'rating-item';

                if (index === 0) {
                    item.classList.add('gold');
                } else if (index === 1) {
                    item.classList.add('silver');
                } else if (index === 2) {
                    item.classList.add('bronze');
                }

                item.innerHTML = `
                    <img src="images/${member.avatar}" alt="${member.name}">
                    <div class="participant-info">
                        <p>${member.name}</p>
                    </div>
                    <div class="points">${member.points} баллов</div>
                `;
                item.onclick = () => window.location.href = `profile.html?id=${member.id}`; // Переход к профилю
                container.appendChild(item);
            });
        })
        .catch(err => console.error('Ошибка загрузки данных:', err));
}

function loadProfile() {
    const params = new URLSearchParams(window.location.search);
    const memberId = parseInt(params.get('id'));

    fetch('members.json')
        .then(response => response.json())
        .then(data => {
            const member = data.members.find(m => m.id === memberId);
            if (!member) return;

            const container = document.getElementById('profile');
            container.innerHTML = `
                <div class="profile-header">
                    <img src="images/${member.avatar}" alt="${member.name}" class="profile-avatar">
                    <div class="profile-info">
                        <h2>${member.name}</h2>
                        <p>Points: ${member.points}</p>
                    </div>
                </div>
                <div class="profile-sections">
                    <div class="profile-section">
                        <h3>Достижения</h3>
                        <div class="achievements-list">
                            ${member.achievements.map(a => `
                                <div class="achievement-item">
                                    <img src="images/${a.image}" alt="${a.title}">
                                    <p>${a.title}</p>
                                </div>`).join('')}
                        </div>
                    </div>
                    <div class="profile-section">
                        <h3>Навыки</h3>
                        <div class="skills-list">
                            ${member.skills.map(skill => `<p>${skill}</p>`).join('')}
                        </div>
                    </div>
                </div>
            `;

            // Применяем стиль в зависимости от ранга
            updateProfileRank(member.points);
        })
        .catch(err => console.error('Ошибка загрузки профиля:', err));
}

function updateProfileRank(points) {
    const profileContainer = document.getElementById('profile-container');

    profileContainer.classList.remove('gold', 'silver', 'bronze');

    if (points >= 200) { // Предположим, что 1000 баллов — это первое место
        profileContainer.classList.add('gold');
    } else if (points >= 100) { // 500 баллов — второе место
        profileContainer.classList.add('silver');
    } else if (points >= 0) { // 100 баллов — третье место
        profileContainer.classList.add('bronze');
    }
}

if (window.location.pathname.includes('rating.html')) {
    loadRating();
}

if (window.location.pathname.includes('profile.html')) {
    loadProfile();
}
