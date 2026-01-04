/***********************************************************************
* IBM1620.org/Common/Section.js
************************************************************************
* Copyright (c) 2025-2026, Paul Kimpel & Dave Babcock.
* Licensed under the MIT License, see
*       http://www.opensource.org/licenses/mit-license.php
************************************************************************
* IBM 1620 Archive common section routines.
************************************************************************
* 2025-09-19  D.Babcock
*   Initial version.
* For later revisions, see the IBM1620-Archive github repository.
***********************************************************************/

export {Section};

class Section {

    static configStorageName            = "IBM1620-Archive-Site-Config";
    static configVersion                = 1;

    static introductionPosition         = 11;
    static architecturePosition         =  0;
    static documentsPosition            =  1;
    static hardwarePosition             =  2;
    static historyPosition              =  3;
    static juniorPosition               =  4;
    static installationsPosition        =  5;
    static linksPosition                =  6;
    static photosPosition               =  7;
    static restorationPosition          =  8;
    static simulatorsPosition           =  9;
    static softwarePosition             = 10;

    static urlLevels = [
        {path: "./"},
        {path: "../"},
        {path: "../../"},
        {path: "../../../"},
        {path: "../../../../"}
    ]

    static menuEntries = [
        {pos: -1, text: "Home",          href: "Home.html",                        icon: ""},
        {pos: 11, text: "Introduction",  href: "Introduction/Introduction.html",   icon: "Section_introduction.png"},
        {pos:  0, text: "Architecture",  href: "Architecture/Architecture.html",   icon: "Section_architecture.png"},
        {pos:  1, text: "Documents",     href: "Documents/Documents.html",         icon: "Section_documents.png"},
        {pos:  2, text: "Hardware",      href: "Hardware/Hardware.html",           icon: "Section_hardware.png"},
        {pos:  3, text: "History",       href: "History/History.html",             icon: "Section_history.png"},
        {pos:  4, text: "IBM 1620 Jr.",  href: "Junior/Junior.html",               icon: "Section_junior.png"},
        {pos:  5, text: "Installations", href: "Installations/Installations.html", icon: "Section_installations.png"},
        {pos:  6, text: "Links",         href: "Links/Links.html",                 icon: "Section_links.png"},
        {pos:  7, text: "Photos",        href: "Photos/Photos.html",               icon: "Section_photos.png"},
        {pos:  8, text: "Restoration",   href: "Restoration/Restoration.html",     icon: "Section_restoration.png"},
        {pos:  9, text: "Simulators",    href: "Simulators/Simulators.html",       icon: "Section_simulators.png"},
        {pos: 10, text: "Software",      href: "Software/Software.html",           icon: "Section_software.png"}
    ];


    /**************************************/
    static $$(id) {
        return document.getElementById(id);
    }

    /**************************************/
    static openMenu(ev) {
        /* Opens the menu */

        if (!(ev.target.tagName == "A" && ev.target.parentElement.id == "SectionSite")) {
            Section.$$("MenuContent").classList.toggle("show");
            ev.stopPropagation();
        }
    }

    /**************************************/
    static closeMenu(ev) {
        /* Closes the menu */

        Section.$$("MenuContent").classList.remove("show");
        ev.stopPropagation();
    }

    /**************************************/
    static saveSelectorPosition(currentPosition) {
        /* Updates the selector position in the site config to the current page */
        let siteConfig = null;

        if (window.localStorage && window.JSON) {
            const s = localStorage.getItem(Section.configStorageName) ?? "";
            try {
                siteConfig = JSON.parse(s);
                siteConfig.switchPos = currentPosition;
            } catch (e) {
                siteConfig = {
                    version: Section.configVersion,
                    switchPos: currentPosition
                };
            }

            localStorage.setItem(Section.configStorageName, JSON.stringify(siteConfig));
        }
    }

    /**************************************/
    static buildMenu(position, level) {
        /* Constructs the drop-down menu and inserts it into the DOM */
        let menuButton = Section.$$("MenuBtn");
        const sectionHeader = Section.$$("SectionHeader");

        // Unwire and delete any existing menu button.
        window.removeEventListener("click", Section.closeMenu);
        if (menuButton) {
            sectionHeader.removeEventListener("click", Section.openMenu);
            menuButton.parentChild.removeChild(menuButton);
        }

        // Empty any Selector contents and create the menu container.
        const selector = Section.$$("SectionSelector");
        selector.textContent = "";      // delete any content in the Selector

        const container = document.createElement("nav");
        container.id = "MenuContainer";
        selector.appendChild(container);

        // Create the menu button with appropriate image and append to container.
        menuButton = document.createElement("img");
        menuButton.id = "MenuBtn";
        menuButton.title = "Open a menu of pages to which you can navigate";
        menuButton.style.cursor = "pointer";
        sectionHeader.addEventListener("click", Section.openMenu);
        container.appendChild(menuButton);

        // Build the menu drop-down list.
        const content = document.createElement("div");
        content.id = "MenuContent";
        container.appendChild(content);
        for (const entry of Section.menuEntries) {
            const link = document.createElement("a");
            link.href = Section.urlLevels[level].path + entry.href;
            link.textContent = entry.text;
            content.appendChild(link);
            if (entry.pos == position) {
                menuButton.src = Section.urlLevels[level].path + `Images/${entry.icon}`;
            }
        }

        // Wire up any click event on the window to close the menu.
        window.addEventListener("click", Section.closeMenu);

        // Save the current selector position in site config.
        Section.saveSelectorPosition(position);
    }

} // class Section
