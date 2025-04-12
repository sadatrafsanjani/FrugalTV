
/*
* Welcome screen shows list of categories
* */
window.addEventListener('DOMContentLoaded', async () => {

    const files = await window.api.getPlaylist('asset/playlist');
    const container = document.getElementById('channels');

    container.innerHTML = files.map((file, index) => `
    <div class="col-md-4">
      <div class="card bg-success-subtle file-card text-center shadow-sm" data-file="${file}">
        <div class="card-body">
          <h5 class="card-title">${file}</h5>
        </div>
      </div>
    </div>
  `).join('');

    document.querySelectorAll('.file-card').forEach(card => {
        card.addEventListener('click', () => {
            const channelName = card.getAttribute('data-file');
            window.api.openChannelWindow(channelName);
        });
    });
});
