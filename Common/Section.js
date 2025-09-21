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

const overviewPosition      = 11;
const architecturePosition  =  0;
const documentsPosition     =  1;
const hardwarePosition      =  2;
const historyPosition       =  3;
const juniorPosition        =  4;
const installationsPosition =  5;
const linksPosition         =  6;
const photosPosition        =  7;
const restorationPosition   =  8;
const simulatorsPosition    =  9;
const softwarePosition      = 10;

const saveSelectorPosition = (currentPosition) => {
    const configStorageName = "IBM1620-Archive-Home-Config";
    const configVersion = 1;

    let sectionConfig = null;

    if (window.localStorage && window.JSON) {
        const s = localStorage.getItem(configStorageName) ?? "";
        try {
            sectionConfig = JSON.parse(s);
            sectionConfig.switchPos = currentPosition;
        } catch (e) {
            sectionConfig = {
                version: configVersion,
                switchPos: currentPosition
            };
        }

        localStorage.setItem(configStorageName, JSON.stringify(sectionConfig));
    }
}

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
