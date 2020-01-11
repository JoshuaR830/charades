window.addEventListener('load', function() {
    fastThemeSwitcher(getCookie("theme"));
    var buttons = document.querySelectorAll('.button');
    var foreground = document.getElementById('foreground');
    var menuReveal = document.getElementById("menu-reveal");
    var menuHide = document.getElementById('menu-hide');
    var container = document.querySelector('.foreground-content-container');
    var reveal = document.querySelector('.subtitle-container');
    var foregroundButton = document.querySelector('.show-foreground-button');
    var backgroundContainer = this.document.querySelector('.background-content-container');

    menuReveal.addEventListener('click', function(event) {
        console.log("menu clicked");
        menuRevealed();
        foreground.classList.add('animated-scroll-forwards');
        foreground.classList.remove('animated-scroll-backwards');
        foregroundButton.style.display = 'inline-block';
        reveal.classList.add('reveal-foreground');
        backgroundContainer.style.overflow = "auto";
    });

    var menuHide = document.getElementById('menu-hide');
    menuHide.addEventListener('click', function(event) {
        displayForeground();
    });

    buttons.forEach(element => {
        console.log(element);
        element.addEventListener('mouseenter', function() {
            element.querySelector('.image-container').classList.add('button-enter');
            element.querySelector('.image-container').classList.remove('button-leave');
        });

        element.addEventListener('mouseleave', function() {
            element.querySelector('.image-container').classList.remove('button-enter');
            element.querySelector('.image-container').classList.add('button-leave');
        });
    });

    reveal.addEventListener('click', function() {
        if(reveal.classList.contains('reveal-foreground')){
            displayForeground();
        }
    });

    function displayForeground() {
        foregroundButton.style.display = 'none';
        reveal.classList.remove('reveal-foreground');
        foreground.classList.add('animated-scroll-backwards');
        foreground.classList.remove('animated-scroll-forwards');
        container.style.display = 'inline-block';
        backgroundContainer.style.overflow = "hidden";
        menuHidden();
    }

    function menuRevealed() {
        menuHide.style.display = 'inline-block';
        menuReveal.style.display = 'none';
    }

    function menuHidden() {
        menuHide.style.display = 'none';
        menuReveal.style.display = 'inline-block';
    }
});