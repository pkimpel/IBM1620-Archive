/***********************************************************************
* IBM1620.org/Hardware/Hardware.js
************************************************************************
* Copyright (c) 2025-2026, Paul Kimpel & Dave Babcock.
* Licensed under the MIT License, see
*       http://www.opensource.org/licenses/mit-license.php
************************************************************************
* IBM 1620 Archive Hardware page routines.
************************************************************************
* 2025-09-20  D.Babcock
*   Initial version.
* For later revisions, see the IBM1620-Archive github repository.
***********************************************************************/

import {Section} from "../Common/Section.js";

window.addEventListener("load", function() {
    Section.buildMenu(Section.hardwarePosition, 1);
}, {once: true});
