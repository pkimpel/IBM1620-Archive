/***********************************************************************
* IBM1620.org/Documents/Articles/Articles.js
************************************************************************
* Copyright (c) 2025-2026, Paul Kimpel & Dave Babcock.
* Licensed under the MIT License, see
*       http://www.opensource.org/licenses/mit-license.php
************************************************************************
* IBM 1620 Archive Documents Articles page routines.
************************************************************************
* 2025-10-17  D.Babcock
*   Initial version.
* For later revisions, see the IBM1620-Archive github repository.
***********************************************************************/

import {Section} from "../../Common/Section.js";
import {TableSort} from "../../Common/TableSort.js";

window.addEventListener("load", function() {
    Section.buildMenu(Section.documentsPosition, 2);
}, {once: true});

for (const item of document.querySelectorAll("#ArticlesTable THEAD A")) {
    item.addEventListener("click", TableSort.sortAColumn);
}
