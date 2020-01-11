var host = window.location.hostname;
console.log(host);

window.addEventListener('load', function() { 
    foreground = document.querySelector('.foreground-content-container');
    background = document.querySelector('.background-content-container');
    title = document.querySelector('.title');
    subtitle = document.querySelector('.subtitle');
    
    foregroundRequest = new XMLHttpRequest();
    backgroundRequest = new XMLHttpRequest();
    titleRequest = new XMLHttpRequest();
    subtitleRequest = new XMLHttpRequest();
    
    foregroundRequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200)
        {
            foreground.innerHTML = this.responseText;
        }
    };

    backgroundRequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200)
        {
            background.innerHTML = this.responseText;
            themeSwitcher(getCookie("theme"));
        }
    };

    titleRequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200)
        {
            title.innerHTML = this.responseText;
        }
    };

    subtitleRequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200)
        {
            subtitle.innerHTML = this.responseText;
        }
    };

    foregroundRequest.open("GET", `/foreground`);
    backgroundRequest.open("GET", `/background`);
    titleRequest.open("GET", `/title`);
    subtitleRequest.open("GET", `/subtitle`);
    
    foregroundRequest.send();
    backgroundRequest.send();
    titleRequest.send();
    subtitleRequest.send();
});