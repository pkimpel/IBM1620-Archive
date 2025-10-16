/***********************************************************************
* IBM1620.org/Home.js
************************************************************************
* Copyright (c) 2025, Paul Kimpel & Dave Babcock.
* Licensed under the MIT License, see
*       http://www.opensource.org/licenses/mit-license.php
************************************************************************
* IBM 1620 archive top page routines.
************************************************************************
* 2025-09-05  P.Kimpel
*   Original version, from retro-1620 1620.js.
* 2025-09-12  D.Babcock
*   Modified layout, added CHM logo, text, and IBM 1620 system photo.
* 2025-09-14  P.Kimpel
*   Reworked object sizing to scale with different window sizes.
* 2025-09-15  P.Kimpel
*   Add hover pop-ups.
* 2025-09-15  D.Babcock
*   Minor layout and text changes.
* For later revisions, see the IBM1620-Archive github repository.
***********************************************************************/

import {SelectorSwitch} from "./SelectorSwitch.js";

const globalLoad = (ev) => {
    const initialSwitchPosition = 11;
    const configStorageName = "IBM1620-Archive-Site-Config";

    const switchCaptions = [
            "Architecture^   Architectural descriptions of the IBM 1620.",
            "Documents^      Ads, articles, books, manuals, papers, reports, technical notes, etc.",
            "Hardware^       Technical details on the IBM 1620.",
            "History^        History of the IBM 1620.",
            "IBM 1620 Jr.^   Information about the CHM IBM 1620 Jr. project.",
            "Installations^  Information about all of the known IBM 1620 installations.",
            "Links^          Links to other IBM 1620 websites.",
            "Photos^         Photos of IBM 1620 systems and peripherals.",
            "Restoration^    Information about the CHM IBM 1620 Restoration project.",
            "Simulators^     Information about IBM 1620 simulators.",
            "Software^       Software for the IBM 1620.",
            "Introduction^   An introduction to the IBM 1620 and this website."];

    const switchURLs = [
            "./Architecture/Architecture.html",
            "./Documents/Documents.html",
            "./Hardware/Hardware.html",
            "./History/History.html",
            "./Junior/Junior.html",
            "./Installations/Installations.html",
            "./Links/Links.html",
            "./Photos/Photos.html",
            "./Restoration/Restoration.html",
            "./Simulators/Simulators.html",
            "./Software/Software.html",
            "./Introduction/Introduction.html"];

    let selectorSwitch = null;          // modeled after the 1620 MAR Selector Switch
    let lastPosition = -1;              // last selector position


    /**************************************/
    function $$(id) {
        return document.getElementById(id);
    }

    /**************************************/
    function buildSelectorSwitch(position) {
        /* Build the selector switch a-la the 1620 MAR Selector Switch */
        const angle = 360/switchCaptions.length;
        let switchPositions = [];
        for (let a=0; a<360; a+=angle) {
            switchPositions.push((a+(360-angle/2))%360);
        }

        selectorSwitch = new SelectorSwitch($$("SelectorSwitchDiv"),
                "SelectorSwitchCupDiv", position, switchPositions, switchCaptions);

        selectorSwitch.setChangeListener((position) => {
            setTimeout(() => {
                window.open(`${switchURLs[position].trim()}`, "_self");
            }, lastPosition == position ? 20 : 500);
            lastPosition = position;
        });
    }

    /**************************************/
    function zoomImageOpen(ev) {
        /* Open an image as zoomed when it is clicked */

        $$("ZoomImageModal").style.display = "block";
    }

    /**************************************/
    function zoomImageClose(ev) {
        /* Closes the zoomed image when it or its close icon is clicked */

        $$("ZoomImageModal").style.display = "none";
    }

    /**************************************/
    function resizeWindow(ev) {
        /* Handles resizing of the window and recreation of the selector switch */
        const position = selectorSwitch?.position ?? initialSwitchPosition;

        selectorSwitch?.setChangeListener(null);
        selectorSwitch?.dispose();
        buildSelectorSwitch(position);
    }

    /**************************************/
    function checkBrowser() {
        /* Checks whether this browser can support the necessary stuff */
        let missing = "";

        //if (!window.ArrayBuffer) {missing += ", ArrayBuffer"}
        //if (!window.DataView) {missing += ", DataView"}
        //if (!window.Blob) {missing += ", Blob"}
        //if (!window.File) {missing += ", File"}
        //if (!window.FileReader) {missing += ", FileReader"}
        //if (!window.FileList) {missing += ", FileList"}
        //if (!window.indexedDB) {missing += ", IndexedDB"}
        if (!window.JSON) {missing += ", JSON"}
        if (!window.localStorage) {missing += ", LocalStorage"}
        //if (!(window.performance && "now" in performance)) {missing += ", performance.now"}
        //if (!window.Promise) {missing += ", Promise"}

        if (missing.length == 0) {
            return true;
        } else {
            alert("This website cannot operate properly...\n" +
                "your browser does not support the following features:\n\n" +
                missing.substring(2));
            return false;
        }
    }

    /***** globalLoad() outer block *****/

    if (checkBrowser()) {
        /* Load the site configuration data to get the last selector switch
        position. If it doesn't exist, we just go to the initial position.
        We don't need to save a configuration, because each section will do so */

        const s = localStorage.getItem(configStorageName) ?? "";
        lastPosition = initialSwitchPosition;

        try {
            const siteConfig = JSON.parse(s);
            lastPosition = siteConfig.switchPos ?? initialSwitchPosition;
        } catch (e) {
            // do nothing
        } finally {
            buildSelectorSwitch(lastPosition);
        }

        document.body.style.visibility = "visible";
        window.addEventListener("resize", resizeWindow);

        $$("HomeSystemImage").addEventListener("click", zoomImageOpen);
        $$("ZoomImage").addEventListener("click", zoomImageClose);
        $$("ZoomImageModal").addEventListener("click", zoomImageClose);
        $$("ZoomImageClose").addEventListener("click", zoomImageClose);
    }
} // globalLoad

window.addEventListener("load", globalLoad, {once: true});
