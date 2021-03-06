window.addEventListener('load', function() {
    fastThemeSwitcher(getCookie("theme"));
    var root = document.documentElement;
    var buttons = document.querySelectorAll('.button');
    var foreground = document.getElementById('foreground');
    var menuReveal = document.getElementById("menu-reveal");
    var menuHide = document.getElementById('menu-hide');
    var menuBack = document.getElementById('menu-back');
    var scoreReveal = document.getElementById('menu-scores');
    var scoreHide = document.getElementById('score-menu-hide');
    var container = document.querySelector('.foreground-content-container');
    var reveal = document.querySelector('.subtitle-container');
    var foregroundButton = document.querySelector('.show-foreground-button');
    var backgroundContainer = document.querySelector('.background-content-container');
    var myUser = document.getElementById('my-user');

    function scrollToHide() {
        if(backgroundContainer.scrollHeight - backgroundContainer.offsetHeight === backgroundContainer.scrollTop) {
            backgroundContainer.addEventListener('scroll', endOfScroll);
            document.body.addEventListener('wheel',  respondToRoll);
            console.log('wheel listener');
        } else {
            backgroundContainer.addEventListener('scroll', endOfScroll);
            document.body.addEventListener('wheel',  respondToRoll);
            console.log('scroll listener');

        }
    }

    function endOfScroll() {
        if (backgroundContainer.scrollHeight - backgroundContainer.offsetHeight === backgroundContainer.scrollTop) {
            document.body.addEventListener('wheel',  respondToRoll);
            console.log('wheel listener');
        }
        if (backgroundContainer.scrollTop === 0) {
            document.body.addEventListener('wheel',  respondToRoll);
            console.log('wheel listener');
        }
    }

    function respondToRoll(event) {
        document.body.removeEventListener('wheel',  respondToRoll);
        
        if(event.deltaY < 0) {
            if(backgroundContainer.scrollTop === 0) {
                backgroundContainer.removeEventListener('scroll', endOfScroll);
                displayForeground();
                console.log('up');
            }
        } else if (event.deltaY > 0) {

            console.log('down');

            if ((backgroundContainer.scrollHeight - backgroundContainer.offsetHeight === backgroundContainer.scrollTop) || (backgroundContainer.scrollTop === 0)) {
                backgroundContainer.removeEventListener('scroll', endOfScroll);
                displayForeground();
                console.log('down');
            }
        }
    }

    menuReveal.addEventListener('click', function(event) {
        root.style.setProperty('--backdrop-position', '100vh');
        scoreReveal.style.display = 'none';
        console.log("menu clicked");
        menuRevealed();
        scrollToHide();
        foreground.classList.add('animated-scroll-forwards');
        foreground.classList.remove('animated-scroll-backwards');
        foregroundButton.style.display = 'inline-block';
        reveal.classList.add('reveal-foreground');
        backgroundContainer.style.overflowY = "auto";
    });

    // var menuHide = document.getElementById('menu-hide');
    menuHide.addEventListener('click', function(event) {
        displayForeground();
    });

    menuBack.addEventListener('click', function(event) {
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

    scoreReveal.addEventListener('click', function(event) {
        menuBack.style.display = 'inline-block';
        menuReveal.style.display = 'none';
        menuHide.style.display = 'none';
        scoreReveal.style.display = 'none';
        scoreHide.style.display = 'inline-block';
        scoreReveal.style.display = 'none';
        root.style.setProperty('--backdrop-position', 'calc(var(--height)*2 + 212px)');
        console.log("score reveal clicked");
        foreground.classList.add('animated-scroll-forwards');
        foreground.classList.remove('animated-scroll-backwards');


        foregroundButton.style.display = 'inline-block';
        reveal.classList.add('reveal-foreground');
        backgroundContainer.style.overflowY = "auto";
    })

    reveal.addEventListener('click', function() {
        if(reveal.classList.contains('reveal-foreground')){
            displayForeground();
        }
    });

    scoreHide.addEventListener('click', function(event) {
        displayForeground();
    })

    function displayForeground() {
        foregroundButton.style.display = 'none';
        reveal.classList.remove('reveal-foreground');
        foreground.classList.add('animated-scroll-backwards');
        foreground.classList.remove('animated-scroll-forwards');
        menuBack.style.display = 'none';
        scoreHide.style.display = 'none';
        if(document.getElementById('my-user').value != "") {
            scoreReveal.style.display = 'inline-block';
        }
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