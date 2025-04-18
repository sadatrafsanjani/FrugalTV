/*
* List of channels
* */

let playlistUrl = 'asset/playlist/country/';
let allChannels = [];
let currentActiveCard = null;

window.api.onChannelNameReceive((channelName) => {

    playlistUrl += channelName;
    channelName = channelName.charAt(0).toUpperCase() + channelName.slice(1).replace('.m3u', '');
    document.getElementById('channelName').textContent = `${channelName}`;

    loadChannels(playlistUrl).catch(err => console.error(err));
});

async function loadChannels(playlistUrl) {

    const m3uData = await fetchM3UPlaylist(playlistUrl);
    allChannels = parseM3U(m3uData);
    displayChannels(allChannels);
    setupSearch();
}


const video = document.getElementById('video');
const channelListEl = document.getElementById('channelList');

async function fetchM3UPlaylist(url) {

    const res = await fetch(url);

    if (!res.ok) throw new Error('Failed to fetch playlist');

    return await res.text();
}

function parseM3U(m3uText) {

    const lines = m3uText.split('\n');
    const channels = [];

    for (let i = 0; i < lines.length; i++) {

        if (lines[i].startsWith('#EXTINF')) {

            const name = lines[i].split(',')[1]?.trim();
            const url = lines[i + 1]?.trim();

            if (name && url && url.startsWith('http')) {

                channels.push({ name, url });
            }
        }
    }

    return channels;
}


function displayChannels(channels) {

    channelListEl.innerHTML = '';

    const row = document.createElement('div');
    row.className = 'row g-4';
    channelListEl.appendChild(row);

    channels.forEach((channel, index) => {

        const col = document.createElement('div');
        col.className = 'col-12 col-sm-6 col-md-3';

        const card = document.createElement('div');
        card.className = 'card bg-primary text-white text-center h-100';
        card.style.cursor = 'pointer';

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body d-flex align-items-center justify-content-center';
        cardBody.textContent = channel.name;

        card.appendChild(cardBody);
        col.appendChild(card);
        row.appendChild(col);

        card.addEventListener('click', () => {

            playChannel(channel.url, channel.name);

            if (currentActiveCard) {
                currentActiveCard.classList.remove('border-warning', 'border', 'border-3');
            }

            card.classList.add('border', 'border-3', 'border-warning');
            currentActiveCard = card;
        });
    });
}

function playChannel(url, channel) {

    if (Hls.isSupported()) {

        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
    }
    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
    }

    video.play();

    const nowPlayingEl = document.getElementById('nowPlaying');
    nowPlayingEl.textContent = `Channel: ${channel}`;
}

function setupSearch() {

    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const filtered = allChannels.filter(ch => ch.name.toLowerCase().includes(query));
        displayChannels(filtered);
    });
}
