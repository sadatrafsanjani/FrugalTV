
/*
* Welcome screen shows list of channels
* */
let playlistUrl = 'asset/playlist/';

window.api.onChannelNameReceive((channelName) => {

    playlistUrl += channelName;
    channelName = channelName.charAt(0).toUpperCase() + channelName.slice(1).replace('.m3u', '');
    document.getElementById('channelName').textContent = `${channelName}`;

    fetchM3UPlaylist(playlistUrl).then(channels => {
        allChannels = channels;
        displayChannels(channels);
        setupSearch();
    }).catch(err => console.error(err));
});


const video = document.getElementById('video');
const channelListEl = document.getElementById('channelList');

async function fetchM3UPlaylist(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch playlist');
    const text = await res.text();
    return parseM3U(text);
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


let currentActiveCard = null;

function displayChannels(channels) {

    channelListEl.innerHTML = '';

    channels.forEach(channel => {

        const col = document.createElement('div');
        col.className = 'col-6 col-md-4 col-lg-2';

        const card = document.createElement('div');
        card.className = 'channel-card bg-primary text-white text-center p-3 rounded shadow-sm h-100';
        card.style.cursor = 'pointer';
        card.textContent = channel.name;

        card.addEventListener('click', () => {
            playChannel(channel.url);

            if (currentActiveCard) {
                currentActiveCard.classList.remove('channel-active');
            }
            card.classList.add('channel-active');
            currentActiveCard = card;
        });

        col.appendChild(card);
        channelListEl.appendChild(col);
    });
}

function playChannel(url) {

    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
    }

    video.play();

    const nowPlayingEl = document.getElementById('nowPlaying');
    nowPlayingEl.textContent = `Channel: ${getChannelNameFromUrl(url)}`;
}

function getChannelNameFromUrl(url) {
    try {
        const parts = url.split('/');
        const name = parts[parts.length - 1].split('.')[0];
        return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    } catch {
        return 'Channel';
    }
}


let allChannels = [];

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const filtered = allChannels.filter(ch => ch.name.toLowerCase().includes(query));
        displayChannels(filtered);
    });
}
