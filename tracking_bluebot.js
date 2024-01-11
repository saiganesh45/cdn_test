
(function() {
    // Function to parse UTM parameters from URL
    function getUTMParams() {
        var params = {};
        window.location.search.substring(1).split("&").forEach(function(part) {
            var item = part.split("=");
            params[item[0]] = decodeURIComponent(item[1]);
        });
        return params;
    }

    // Function to get device information
    function getDeviceInfo() {
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language
        };
    }

    // Function to get client's IP address from a third-party service
    function getClientIP(callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    var ip = JSON.parse(this.responseText).ip;
                    callback(ip);
                } else {
                    console.error("Error fetching IP address: " + this.status);
                    callback("");  // Proceed with an empty IP in case of error
                }
            }
        };
        xhr.open("GET", "https://api.ipify.org?format=json", true);
        xhr.timeout = 5000;  // Timeout in ms
        xhr.ontimeout = function() {
            console.error("Timeout fetching IP address");
            callback("");  // Proceed with an empty IP in case of timeout
        };
        xhr.send();
    }
    // Function to send data to the server
    function sendData(data) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST","https://sainic.buckbak.com/track", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.timeout = 2000;  // Timeout in ms
        xhr.onerror = function() {
            console.error("Error sending tracking data");
        };
        xhr.ontimeout = function() {
            console.error("Timeout sending tracking data");
        };
        xhr.send(JSON.stringify(data));
    }

    // Collect User Data and send
    function collectAndSendData(ipAddress) {
        var userData = {
            'timestamp': new Date().toISOString(),
            'url': window.location.href,
            'referrer': document.referrer,
            'utmParameters': getUTMParams(),
            'deviceInfo': getDeviceInfo(),
            'hostname': window.location.hostname,
            'ipAddress': ipAddress
        };
        sendData(userData);
    }

    // Get client IP and then collect and send user data
    getClientIP(function(ip) {
        collectAndSendData(ip);
    });

    // Polling for URL change every 5 seconds
    var lastUrl = window.location.href;
    setInterval(function() {
        var currentUrl = window.location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            getClientIP(function(ip) {
                collectAndSendData(ip);
            });
        }
    }, 5000); // Check every 5 seconds
})();

                                                          