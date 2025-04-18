
/*
* Welcome screen shows list of categories
* */
window.addEventListener('DOMContentLoaded', async () => {

    const categories = await window.api.getCategories('asset/playlist/category');
    const channelsContainer = document.getElementById('channels');

    channelsContainer.innerHTML = categories.map((category, index) => `
        <div class="col-md-4">
          <div class="card bg-success-subtle file-card text-center shadow-sm" data-file="${category}">
            <div class="card-body">
              <h5 class="card-title">${category.replace('.m3u', '').replace(/^\w/, c => c.toUpperCase())}</h5>
            </div>
          </div>
        </div>
  `).join('');

    document.querySelectorAll('.file-card').forEach(card => {
        card.addEventListener('click', () => {
            const channelName = card.getAttribute('data-file');
            window.api.sendChannelData(channelName, "asset/playlist/category/");
        });
    });



    const countries = await window.api.getCountries('asset/playlist/country');
    const countryContainer = document.getElementById('countries');

    countryContainer.innerHTML = countries.map((country, index) => `
        <div class="col-md-4">
          <div class="card bg-success-subtle file-card text-center shadow-sm" data-file="${country}">
            <div class="card-body">
              <h5 class="card-title">${country.replace('.m3u', '').replace(/^\w/, c => c.toUpperCase())}</h5>
            </div>
          </div>
        </div>
  `).join('');

    document.querySelectorAll('.file-card').forEach(card => {
        card.addEventListener('click', () => {
            const channelName = card.getAttribute('data-file');
            window.api.sendChannelData(channelName, "asset/playlist/country/");
        });
    });
});
