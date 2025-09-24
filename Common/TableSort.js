/***********************************************************************
* TableSort.js
* Copyright (c) 2024, Paul Kimpel, All Rights Reserved.
************************************************************************
* Table Sorting Utility Functions object.
* Initialize by attaching one or more events to the "sortAColumn"
* function, which assumes the event target is an <a> element immediately
* contained within a <th> element.
************************************************************************
* Modification Log.
* 2024-09-13  P.Kimpel
*   Original version, cloned from UNITE Agenda TableSort.js.
***********************************************************************/

export {TableSort};

class TableSort {

    /**************************************/
    static mergeSort(a, lower, upper, desc, extract, swap) {
        /* MergeSort algorithm implemented to sort rows of a table. This is
        slower than quickSort, but it is a stable sort, preserving the
        relative original order of the rows. extract(row) must return a
        collatable value for the column in that row being sorted. swap(a, b)
        must swap the two designated rows in the table. desc specifies a
        descending sort if truthy */
        let length = upper-lower+1;
        let a1 = new Array(length); // merge work area 1
        let a2 = new Array(length); // merge work area 2
        let ax = null;              // temp for swapping work area references
        let runLength = 0;          // current run length;
        let x = 0;                  // left-hand run index
        let xLimit = 0;             // left-hand run index limit
        let y = 0;                  // right-hand run index
        let yLimit = 0;             // right-hand run index limit
        let z = 0;                  // merged run index

        // Make a special first pass to copy the indexes of sorted pairs to a1
        x = 1;
        while (x < length) {
            if (desc ? extract(a[x+lower-1]) > extract(a[x+lower])
                     : extract(a[x+lower-1]) <= extract(a[x+lower])) {
                a1[x-1] = x-1;
                a1[x] = x;
            } else {
                a1[x-1] = x;
                a1[x] = x-1;
            }
            x += 2;
        } // while x

        if (x == length) {
            a1[x-1] = x-1;          // length was odd: copy index of the last element
        }

        // Now merge pairs of runs into successively larger runs
        runLength = 2;
        while (runLength < length) {
            z = 0;

            // Merge pairs of runs at this length
            while (z < length) {
                x = z;
                xLimit = x + runLength;
                if (xLimit > length) {
                    xLimit = length;
                }
                y = x + runLength;
                yLimit = y + runLength;
                if (yLimit > length) {
                    yLimit = length;
                }

                // Merge this run pair
                while (z < yLimit) {
                    if (y >= yLimit) {
                        a2[z++] = a1[x++];
                    } else if (x >= xLimit) {
                        a2[z++] = a1[y++];
                    } else if (desc ? extract(a[a1[x]+lower]) > extract(a[a1[y]+lower])
                                    : extract(a[a1[x]+lower]) <= extract(a[a1[y]+lower])) {
                        a2[z++] = a1[x++];
                    } else {
                        a2[z++] = a1[y++];
                    }
                } // while z<yLimit
            } // while z<length

            // Swap the work areas and bump the run length
            [a1, a2] = [a2, a1];
            runLength *= 2;
        } // while

        // Finally, insert the rows into their new positions in the table body
        // Begin by building an index to the original row offsets
        ax = new Array(length);
        for (x=0; x<length; ++x) {
            a2[x] = ax[x] = x;
        }
        // Now a1[x] has the original index of the row that should be in position x,
        // a2[x] has the index where the original row x is currently located, and
        // ax[x] has the original index of the row that is currently in a[x].
        for (x=0; x<length; ++x) {
            y = a1[x];              // index of the row that belongs in this position
            if (a2[y] != x) {       // make sure it's not already where it needs to be
                swap(a[x+lower], a[a2[y]+lower]);
                z = ax[x];
                ax[x] = y;
                ax[a2[y]] = z;
                a2[z] = a2[y];
                a2[y] = x;
            }
        } // for x
    }

    /**************************************/
    static sortOnDate(body, col, desc, swap) {
        /* Sorts the table body "body" on the specified 0-relative date
        column. "swap" is an optional row-swapping function; the internal
        swapRows() will be used if it's omitted */
        let rows = body.rows;

        let extractText = ("textContent" in rows[0] ? function(e) {
            let cell = e.cells[col];
            return (cell ? cell.textContent : "");
        } : function(e) {
            let cell = e.cells[col];
            return (cell ? cell.innerText : "");
        });

        let extractDate = function(e) {
            let text = extractText(e);
            let dt = Date.parse(text);
            return (dt || 0);
        };

        if (rows.length > 1) {
            body.classList.add("gray");
            setTimeout(function() { // pause to allow the display to update
                TableSort.mergeSort(rows, 0, rows.length-1, desc, extractDate, swap||TableSort.swapRows);
                body.classList.remove("gray");
            }, 100);
        }
    }

    /**************************************/
    static sortOnNumber(body, col, desc, swap) {
        /* Sorts the table body "body" on the specified zero-relative numeric
        column. "swap" is an optional row-swapping function; the internal
        swapRows() will be used if it's omitted */
        let rows = body.rows;

        let extractText = ("textContent" in rows[0] ? function(e) {
            let cell = e.cells[col];
            return (cell ? cell.textContent : "");
        } : function(e) {
            let cell = e.cells[col];
            return (cell ? cell.innerText : "");
        });

        let extractNumber = function(e) {
            let nbr = parseFloat(extractText(e).replace(/[,$]/g, ""), 10);
            return (isNaN(nbr) ? 0 : nbr);
        };

        if (rows.length > 1) {
            body.classList.add("gray");
            setTimeout(function() { // pause to allow the display to update
                TableSort.mergeSort(rows, 0, rows.length-1, desc, extractNumber, swap||TableSort.swapRows);
                body.classList.remove("gray");
            }, 100);
        }
    }

    /**************************************/
    static sortOnText(body, col, desc, swap) {
        /* Sorts the table body "body" on the specified zero-relative text
        column. "swap" is an optional row-swapping function; the internal
        swapRows() will be used if it's omitted */
        let rows = body.rows;

        let extractText = ("textContent" in rows[0] ? function(e) {
            let cell = e.cells[col];
            return (cell ? cell.textContent : "").toLowerCase();
        } : function(e) {
            let cell = e.cells[col];
            return (cell ? cell.innerText : "").toLowerCase();
        });

        if (rows.length > 1) {
            body.classList.add("gray");
            setTimeout(function() { // pause to allow the display to update
                TableSort.mergeSort(rows, 0, rows.length-1, desc, extractText, swap||TableSort.swapRows);
                body.classList.remove("gray");
            }, 100);
        }
    }

    /**************************************/
    static sortOnInputText(body, col, desc, swap) {
        /* Sorts the table body "body" on the specified zero-relative text
        column. If the column contains INPUT elements, sorts on the concatenated
        values of all text nodes and INPUT elements in that column. "swap" is an
        optional row-swapping function; the internal swapRows() will be used if
        it's omitted */
        let rows = body.rows;

        let extractText = function(e) {
            let cell = e.cells[col];
            let child = cell.firstChild;
            let text = "";
            while (child) {
                switch (child.nodeName.toLowerCase()) {
                case "#text":
                    text += child.nodeValue;
                    break;
                case "input":
                    text += child.value.trim();
                    break;
                }

                child = child.nextSibling;
            }

            return text.toLowerCase();
        }

        if (rows.length > 1) {
            body.classList.add("gray");
            setTimeout(function() { // pause to allow the display to update
                TableSort.mergeSort(rows, 0, rows.length-1, desc, extractText, swap||TableSort.swapRows);
                body.classList.remove("gray");
            }, 100);
        }
    }

    /**************************************/
    static swapRows(e1, e2) {
        /* Swaps the location of two elements in a node list (table body), but any
        classNames are maintained in their original physical position (e.g., to
        preserve even-odd row highlighting */
        let cn = "";
        let s1 = null;
        let s2 = null;

        if (e1 != e2) {
            cn = e1.className;
            e1.className = e2.className;
            e2.className = cn;
            s1 = e1.nextSibling;
            s2 = e2.nextSibling;
            e1.parentNode.insertBefore(e1, s2);
            if (s1 != e2) { // if the nodes were adjacent, we don't need to swap the second one.
                e2.parentNode.insertBefore(e2, s1);
            }
        }
    }

    /**************************************/
    static swapRowsAndClassNames(e1, e2) {
        /* Swaps the location of two elements in a node list (table body). The row
        classNames are swapped along with the rows in this case, so that any highlighting
        will be swapped along with the rows */
        let s1 = null;
        let s2 = null;

        if (e1 != e2) {
            s1 = e1.nextSibling;
            s2 = e2.nextSibling;
            e1.parentNode.insertBefore(e1, s2);
            if (s1 != e2) { // if the nodes were adjacent, we don't need to swap the second one.
                e2.parentNode.insertBefore(e2, s1);
            }
        }
    }

    /**************************************/
    static findColumnIndex(ctl) {
        /* Finds the <tbody>-relative column index for the <th> containing
        "ctl". The routine can be confused by irregular use of colspans and
        rowspans or by a heading that does not match the body columns. Returns
        the 0-relative column index if found, -1 otherwise */

        // Back out to the enclosing <thead> node
        let thead = ctl.parentNode;
        while (thead.tagName != "THEAD") {
            thead = thead.parentNode;
            if (!thead) {
                return -1;              // no <thead> found
            }
        }

        // Find the enclosing <th> for the "ctl" node
        let th = ctl;
        while (th.tagName != "TH") {
            th = th.parentNode;
            if (!th) {
                return -1;              // no enclosing <th> found
            }
        }

        let index = 0;
        let rows = thead.rows;

        const traverse = function(th, rowx, colx, colSpan) {
            /* Recursively traverses the heading rows, looking for cell "th".
            If a cell with a colSpan>1 is encountered, searches the next lower
            heading row, maintaining an index to the leaf columns of the heading.
            Returns true if the cell is found and its column index in "index" */

            if (rowx >= rows.length) {
                index += colSpan;               // if we're out of rows, just bump by the parent cell's span
            } else {
                let row = rows[rowx];           // our row to search
                let lowerx = 0;                 // current offset into the next lower row
                const cEnd = colx + colSpan;    // offset+1 of our last cell

                for (let cx=colx; cx<cEnd; ++cx) {
                    const cell = row.cells[cx];
                    if (cell === th) {
                        return true;            // found our cell: we're done
                    } else if (cell.colSpan <= 1) {
                        ++index;                // else if no span, just bump index
                    } else if (traverse(th, rowx+1, lowerx, cell.colSpan)) {
                        return true;            // else if cell found in lower row: we're done
                    } else {
                        lowerx += cell.colSpan; // else bump the lower row's offset by the span
                    }
                }
            }

            return false;
        };

        if (traverse(th, 0, 0, rows[0].cells.length)) {
            return index;
        } else {
            return -1;                  // our <th> was not found
        }
    }

    /**************************************/
    static findBody(ctl) {
        /* Finds the first <tbody> element of a <table>, starting with any
        element contained within the <table>. Returns either the <tbody>
        element or null if one cannot be found */
        let body = ctl.parentNode;

        // Find the <table> node
        while (body.tagName != "TABLE") {
            body = body.parentNode;
            if (!body) {
                return null;            // no <table> found
            }
        }

        // Step through the <table>'s immediate children looking for a <tbody>
        body = body.firstChild;
        while (body.tagName != "TBODY") {
            body = body.nextSibling;
            if (!body) {
                return null;            // no <tbody> found
            }
        }

        return body;
    }

    /**************************************/
    static sortAColumn(ev) {
        /* Handles click events on column headings. Determines which column was
        clicked, and from that call the appropriate table sort method */
        let ctl = ev.target;
        let body = TableSort.findBody(ctl);

        ev.preventDefault();
        ev.stopPropagation();

        if (body) {
            let col = TableSort.findColumnIndex(ctl);
            if (col >= 0) {
                let sortType = ctl.getAttribute("data-tsort-type") || "text";
                let desc = (ctl.getAttribute("data-tsort-dir") || "").toLowerCase() == "desc";
                switch (sortType.toLowerCase()) {
                case "number":
                    TableSort.sortOnNumber(body, col, desc, TableSort.swapRowsAndClassNames);
                    break;
                case "date":
                    TableSort.sortOnDate(body, col, desc, TableSort.swapRowsAndClassNames);
                    break;
                case "input":
                    TableSort.sortOnInputText(body, col, desc, TableSort.swapRowsAndClassNames);
                    break;
                default:
                    TableSort.sortOnText(body, col, desc, TableSort.swapRowsAndClassNames);
                    break;
                }
            }
        }

        return false;
    }

} // end of class TableSort
