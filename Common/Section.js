/***********************************************************************
* IBM1620.org/Common/Section.js
************************************************************************
* Copyright (c) 2025, Paul Kimpel & Dave Babcock.
* Licensed under the MIT License, see
*       http://www.opensource.org/licenses/mit-license.php
************************************************************************
* IBM 1620 archive common section routines.
************************************************************************
* 2025-09-19  D.Babcock
*   Initial version.
* For later revisions, see the IBM1620-Archive github repository.
***********************************************************************/

document.addEventListener("DOMContentLoaded", function() {
    const site = document.getElementById("SectionSite");
    const selector = document.getElementById("SectionSelector");

    fetch("../Common/Menu.html")
        .then(response => response.text())
        .then(html => {
            selector.insertAdjacentHTML("beforeend", html);
            const menu = document.getElementById("SectionMenu");
            selector.addEventListener("click", function(event) {
                event.stopPropagation();
                menu.classList.toggle("show");
            });
            document.addEventListener("click", function() {
                menu.classList.remove("show");
            });
        })
        .catch(err => console.error("Menu load failed:", err));

    if (site) {
        site.addEventListener("click", function() {
            window.location.href = "../Home.html";
        });
    }

    if (selector && menu) {
        selector.addEventListener("click", function(event) {
            event.stopPropagation();
            menu.classList.toggle("show");
        });

        document.addEventListener("click", function() {
            menu.classList.remove("show");
        });
    }
})
