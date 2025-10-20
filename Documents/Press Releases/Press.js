/***********************************************************************
* IBM1620.org/Documents/Press Releases/Press.js
************************************************************************
* Copyright (c) 2025, Paul Kimpel & Dave Babcock.
* Licensed under the MIT License, see
*       http://www.opensource.org/licenses/mit-license.php
************************************************************************
* IBM 1620 Archive Documents Press page routines.
************************************************************************
* 2025-10-19  D.Babcock
*   Initial version.
* For later revisions, see the IBM1620-Archive github repository.
***********************************************************************/

import {Section} from "../../Common/Section.js";
import {TableSort} from "../../Common/TableSort.js";

window.addEventListener("load", function() {
    Section.buildMenu(Section.documentsPosition, 2);
}, {once: true});

for (const item of document.querySelectorAll("#PressTable THEAD A")) {
    item.addEventListener("click", TableSort.sortAColumn);
}
