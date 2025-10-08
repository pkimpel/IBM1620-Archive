/***********************************************************************
* IBM1620.org/Links/Links.js
************************************************************************
* Copyright (c) 2025, Paul Kimpel & Dave Babcock.
* Licensed under the MIT License, see
*       http://www.opensource.org/licenses/mit-license.php
************************************************************************
* IBM 1620 Archive Links page routines.
************************************************************************
* 2025-09-20  D.Babcock
*   Initial version.
* For later revisions, see the IBM1620-Archive github repository.
***********************************************************************/

import {Section} from "../Common/Section.js";

window.addEventListener("load", function() {
    Section.buildMenu(Section.linksPosition, 1);
}, {once: true});
