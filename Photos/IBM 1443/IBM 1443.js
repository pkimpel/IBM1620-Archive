/***********************************************************************
* IBM1620.org/Photos/Photos/IBM 1443.js
************************************************************************
* Copyright (c) 2025, Paul Kimpel & Dave Babcock.
* Licensed under the MIT License, see
*       http://www.opensource.org/licenses/mit-license.php
************************************************************************
* IBM 1620 Archive Photos IBM 1443 page routines.
************************************************************************
* 2025-11-18  D.Babcock
*   Initial version.
* For later revisions, see the IBM1620-Archive github repository.
***********************************************************************/

import {Section} from "../../Common/Section.js";

    /**************************************/
    function $$(id) {
        return document.getElementById(id);
    }

    /**************************************/
    function zoomImageOpen(ev) {
        /* Open a zoomed image when it is clicked */

        const regex = /(?:src=["']\.\/Thumbnails\/)([^"']+)/;

        const match = ev.currentTarget.innerHTML.match(regex);

        let filename = "";
        if (match && match.length > 1) {
            filename = "./Images/" + match[1];
        }

        $$("ZoomImage").src = filename;
        $$("ZoomImageModal").style.display = "block";
    }

    /**************************************/
    function zoomImageClose(ev) {
        /* Closes the zoomed image when it or its close icon is clicked */

        $$("ZoomImageModal").style.display = "none";
    }

window.addEventListener("load", function() {
    Section.buildMenu(Section.photosPosition, 2);
}, {once: true});

$$("ZoomImage").addEventListener("click", zoomImageClose);
$$("ZoomImageClose").addEventListener("click", zoomImageClose);
const photos = document.querySelectorAll("#BodyGalleryItem");
photos.forEach(photo => {
    photo.addEventListener("click", zoomImageOpen);
});
