function generateShortLink() {
    const longUrl = document.getElementById('url-input').value;
    const expirationOption = document.getElementById('expiration-time').value; // Get expiration from dropdown
    const errorMessage = document.getElementById('error-message');
    
    if (!isValidUrl(longUrl)) {
        errorMessage.style.display = 'block';
        return;
    } else {
        errorMessage.style.display = 'none';
    }

    const shortLink = "https://shorturl.co/" + generateRandomString();

    let expirationTime = convertExpirationToMilliseconds(expirationOption);
    if (expirationTime === null) {
        alert('Please select a valid expiration time.');
        return;
    }

    const expirationTimestamp = new Date().getTime() + expirationTime;

    const shortUrlData = {
        shortLink: shortLink,
        longUrl: longUrl,
        expirationTimestamp: expirationTimestamp,
        expirationTime: expirationOption 
    };
    storeShortUrl(shortUrlData);
    document.getElementById('short-url').value = shortLink;

    addShortUrlToSidebar(shortLink, longUrl, expirationOption, expirationTimestamp);
}

function isValidUrl(url) {
    const pattern = /^(https?:\/\/)?([a-z0-9]+\.)+[a-z]{2,6}(\/[a-z0-9\-._~:/?#[\]@!$&'()*+,;%=]*)?$/i;
    return pattern.test(url);
}

function generateRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const length = 5; 
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function convertExpirationToMilliseconds(expirationOption) {
    switch (expirationOption) {
        case '1': return 1 * 60 * 1000; 
        case '5': return 5 * 60 * 1000; 
        case '30': return 30 * 60 * 1000; 
        case '60': return 60 * 60 * 1000; 
        case '120': return 120 * 60 * 1000; 
        default: return null; 
    }
}

function storeShortUrl(shortUrlData) {
    let allShortUrls = JSON.parse(localStorage.getItem('shortUrls')) || [];
    allShortUrls.push(shortUrlData);
    localStorage.setItem('shortUrls', JSON.stringify(allShortUrls));
}

function addShortUrlToSidebar(shortUrl, longUrl, expirationOption, expirationTimestamp) {
    const list = document.getElementById('shortened-urls-list');
    
    let expirationText = getExpirationText(expirationOption);

    const isExpired = new Date().getTime() > expirationTimestamp;
    if (isExpired) {
        expirationText = 'Expired'; 
    }

    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <a href="#" onclick="handleLinkClick('${shortUrl}', '${longUrl}', ${expirationOption}, ${expirationTimestamp})">${shortUrl}</a> 
        <span class="expiration-text">(Expires in: ${expirationText})</span> <!-- Added class here -->
        <button class="delete-btn" onclick="deleteShortUrl('${shortUrl}')">
            <i class="fas fa-trash-alt"></i> <!-- Trash icon -->
        </button>
    `;

    list.appendChild(listItem);
}


function getExpirationText(expirationOption) {
    switch (expirationOption) {
        case '1': return '1 minute';
        case '5': return '5 minutes';
        case '30': return '30 minutes';
        case '60': return '1 hour';
        case '120': return '2 hours';
        default: return 'Unknown'; 
    }
}

function handleLinkClick(shortUrl, longUrl, expirationOption, expirationTimestamp) {
    const currentTime = new Date().getTime();

    if (currentTime > expirationTimestamp) {
        alert("This link doesn't work anymore.");
    } else {
        window.open(longUrl, '_blank'); 
    }
}

function loadStoredUrls() {
    const allShortUrls = JSON.parse(localStorage.getItem('shortUrls')) || [];
    allShortUrls.forEach(urlData => {
        addShortUrlToSidebar(urlData.shortLink, urlData.longUrl, urlData.expirationTime, urlData.expirationTimestamp);
    });
}

function copyToClipboard() {
    const shortUrl = document.getElementById('short-url');
    shortUrl.select();
    document.execCommand('copy');
    alert('Short URL copied!');
}

function deleteShortUrl(shortUrl) {
    let allShortUrls = JSON.parse(localStorage.getItem('shortUrls')) || [];

    allShortUrls = allShortUrls.filter(url => url.shortLink !== shortUrl);

    localStorage.setItem('shortUrls', JSON.stringify(allShortUrls));

    document.getElementById('shortened-urls-list').innerHTML = '';
    loadStoredUrls();
}

window.onload = loadStoredUrls;
