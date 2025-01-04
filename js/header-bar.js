var prevScrollpos = window.pageYOffset;
        
        /* Get the header element and it's position */
        var headerDiv = document.querySelector(".header-bar");
        var headerBottom = headerDiv.offsetTop + headerDiv.offsetHeight;

        window.onscroll = function() {
        var currentScrollPos = window.pageYOffset;               
            /* if we're scrolling up, or we haven't passed the header,
                show the header at the top */
        if (currentScrollPos <= 200) {
            headerDiv.classList.remove("midpage");
        }
        else if (prevScrollpos > currentScrollPos) {  
                headerDiv.style.top = "0";
                headerDiv.classList.add("midpage");
        }
        else if (currentScrollPos <  200) {
            headerDiv.style.top = "0";
            // headerDiv.style.opacity = "0";
            // headerDiv.classList.add("midpage");
        
        }
        else if (document.querySelector(".nav-content").classList.contains('active') == false){
            /* otherwise we're scrolling down & have passed the header so hide it */
            headerDiv.style.top = "-200px";
        } 

            prevScrollpos = currentScrollPos;
        }
        var st = $(this).scrollTop();
    