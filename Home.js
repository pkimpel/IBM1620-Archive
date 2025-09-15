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
***********************************************************************/

import {SelectorSwitch} from "./SelectorSwitch.js";

const globalLoad = (ev) => {
    const initialSwitchPosition = 11;
    let selectorSwitch = null;
    let boundResizeWindow = resizeWindow.bind(window);

    const switchCaptions = [
            "Architecture^   Architectural descriptions of the IBM 1620 and 1710",
            "Documents^      Scans of documents – ads, articles, books, manuals, papers, reports, technical notes, etc.",
            "Hardware^       Technical details on each of the devices",
            "History^        History of the IBM 1620 and 1710",
            "IBM 1620 Jr.^   Information about all of the known IBM 1620 and 1710 installations",
            "Installations^  Information about the IBM 1620 Jr. project",
            "Links^          Links to other IBM 1620 websites",
            "Photos^         Photos of IBM 1620 devices and machines in use",
            "Restoration^    Informatin about the CHM IBM1620 Restoration project",
            "Simulators^     Information about IBM 1620 simulators",
            "Software^       Software for the IBM 1620",
            "Overview^       A summary of the IBM 1620 and this site"];

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
  /*              alert(`Position ${position}, "${switchCaptions[position]}," was selected.`); */
                alert(`Position ${position}, "${switchCaptions[position]}," was selected.\nheight = ` + window.innerHeight + `, width = ` + window.innerWidth);
            }, 500);
        });
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

        if (!window.ArrayBuffer) {missing += ", ArrayBuffer"}
        if (!window.DataView) {missing += ", DataView"}
        if (!window.Blob) {missing += ", Blob"}
        if (!window.File) {missing += ", File"}
        if (!window.FileReader) {missing += ", FileReader"}
        if (!window.FileList) {missing += ", FileList"}
        if (!window.indexedDB) {missing += ", IndexedDB"}
        if (!window.JSON) {missing += ", JSON"}
        if (!window.localStorage) {missing += ", LocalStorage"}
        if (!(window.performance && "now" in performance)) {missing += ", performance.now"}
        if (!window.Promise) {missing += ", Promise"}

        if (missing.length == 0) {
            return true;
        } else {
            alert("The emulator cannot run...\n" +
                "your browser does not support the following features:\n\n" +
                missing.substring(2));
            return false;
        }
    }

    /***** globalLoad() outer block *****/

    if (checkBrowser()) {
        buildSelectorSwitch(initialSwitchPosition);
        window.addEventListener("resize", boundResizeWindow);
    }
} // globalLoad

window.addEventListener("load", globalLoad, {once: true});
