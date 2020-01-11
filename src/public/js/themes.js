var root; 
window.addEventListener('load', function() {
    root = document.documentElement;
});

function themeSwitcher(theme) {
    var lightThemeButton = document.getElementById('light-theme');
    var darkThemeButton = document.getElementById('dark-theme');
    var blackThemeButton = document.getElementById('black-theme');

    lightThemeButton.classList.remove('selected');
    darkThemeButton.classList.remove('selected');
    blackThemeButton.classList.remove('selected');

    switch (theme) {
        case "light":
            lightThemeButton.classList.add('selected');
            document.cookie = "theme=light";
            lightTheme();
            break;
        case "dark":
            darkThemeButton.classList.add('selected');
            document.cookie = "theme=dark";
            darkTheme();
            break;
        case "black":
            blackThemeButton.classList.add('selected');
            document.cookie = "theme=black";
            blackTheme();
            break;
        default:
            defaultTheme();
            break;
    }
}

function fastThemeSwitcher(theme) {
    switch (theme) {
        case "light":
            lightTheme();
            break;
        case "dark":
            darkTheme();
            break;
        case "black":
            blackTheme();
            break;
        default:
            defaultTheme();
            break;
    }
}

function lightTheme() {
    root.style.setProperty('--primary', '#8b4cb5');
    root.style.setProperty('--primary-variant', '#B680D1');
    root.style.setProperty('--on-primary', '#ffffff');

    root.style.setProperty('--secondary', '#00b9c7');
    root.style.setProperty('--secondary-variant', '#008084');
    root.style.setProperty('--on-secondary', '#ffffff');

    root.style.setProperty('--background', '#8b4cb5');
    root.style.setProperty('--on-background', '#ffffff');

    root.style.setProperty('--surface', '#ffffff');
    root.style.setProperty('--on-surface', '#000000');

    root.style.setProperty('--error', '#780018');
    root.style.setProperty('--on-error', '#ffffff');
}

function darkTheme() {
    root.style.setProperty('--primary', '#540078');
    root.style.setProperty('--primary-variant', '#9200d1');
    root.style.setProperty('--on-primary', '#ffffff');

    root.style.setProperty('--secondary', '#1AC5CD');
    root.style.setProperty('--secondary-variant', '#008185');
    root.style.setProperty('--on-secondary', '#ffffff');

    root.style.setProperty('--background', '#540078');
    root.style.setProperty('--on-background', '#ffffff');

    root.style.setProperty('--surface', '#674084');
    root.style.setProperty('--on-surface', '#ffffff');

    root.style.setProperty('--error', '#b53a3a');
    root.style.setProperty('--on-error', '#ffffff');
} 

function blackTheme() {
    root.style.setProperty('--primary', '#121212');
    root.style.setProperty('--primary-variant', '#373737');
    root.style.setProperty('--on-primary', '#ffffff');

    root.style.setProperty('--secondary', '#ce9fd6');
    root.style.setProperty('--secondary-variant', '#c77fd4');
    root.style.setProperty('--on-secondary', '#ffffff');

    root.style.setProperty('--background', '#121212');
    root.style.setProperty('--on-background', '#ffffff');

    root.style.setProperty('--surface', '#1d1d1d');
    root.style.setProperty('--on-surface', '#ffffff');

    root.style.setProperty('--error', '#d1524b');
    root.style.setProperty('--on-error', '#ffffff');
} 

function defaultTheme() {
    root.style.setProperty('--primary', '#8b4cb5');
    root.style.setProperty('--primary-variant', '#B680D1');
    root.style.setProperty('--on-primary', '#ffffff');

    root.style.setProperty('--secondary', '#7d0080');
    root.style.setProperty('--secondary-variant', '#b54cab');
    root.style.setProperty('--on-secondary', '#ffffff');

    root.style.setProperty('--background', '#4d4654');
    root.style.setProperty('--on-background', '#ffffff');

    root.style.setProperty('--surface', '#635870');
    root.style.setProperty('--on-surface', '#ffffff');

    root.style.setProperty('--error', '#B00020');
    root.style.setProperty('--on-error', '#ed323b');
}

function getCookie(name) {
    var cookies = document.cookie.split(';');
    name = `${name}=`
    for(var i = 0; i < cookies.length; i++) {
        if(cookies[i].indexOf(name) >= 0) {
            cookie = cookies[i].trim().replace(name, '');
        }
    }
    return cookie;
}
