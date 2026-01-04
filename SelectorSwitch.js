/***********************************************************************
* IBM-1620/Archive SelectorSwitch.js
************************************************************************
* Copyright (c) 2025-2026, Paul Kimpel.
* Licensed under the MIT License, see
*       http://www.opensource.org/licenses/mit-license.php
************************************************************************
* JavaScript class module for the MAR Selector-like console switch.
************************************************************************
* 2025-09-05  P.Kimpel
*   Original version, from retro-1620 MARSelectorKnob.js.
* 2025-09-14  P.Kimpel
*   Reworked object sizing to scale with different window sizes.
* 2025-09-15  P.Kimpel
*   Added hover pop-ups.
* For later revisions, see the IBM1620-Archive github repository.
***********************************************************************/

export {SelectorSwitch};

class SelectorSwitch {

    // Static class properties

    static className = "selectorKnob";
    static canvasColor = "transparent";
    static cupClassName = "SelectorSwitchCup";
    static captionClassName = "SelectorSwitchCaption";
    static slideNoneClassName = "slideNone";
    static slideLeftClassName = "slideLeft";
    static degrees = Math.PI/180;
    static baseAngle = 36*SelectorSwitch.degrees/2;
    static tipAngle = 6*SelectorSwitch.degrees/2;

    constructor(parent, id, initial, positions, captions) {
        /* Constructor for the 1620 Control Panel MARS Register Selector knob.
            parent      the containing DOM element; the control will be sized to fill
                        this element
            id          the DOM id for the knob element (i.e., its canvas)
            initial     the 0-relative index indicating the default position of the switch;
            positions   an array of angles for the knob positions (in degrees, where 0 is
                            straight up)
            captions    an array of caption labels corresponding to each position.
                        Each entry has two parts, a required caption for the switch
                        position, and an optional title delimited by a "^" that will
                        be configured as a pop-up for the label.
        */

        this.parent = parent;           // the parent div
        this.position = 0;              // current knob position
        this.positions = [];            // knob position angles

        this.boundCaptionClick = this.captionClick.bind(this);
        this.changeListener = null;     // listener function to report knob changes -- only one allowed

        this.boundSelectorGrab = this.selectorGrab.bind(this);
        this.boundSelectorMove = this.selectorMove.bind(this);
        this.boundSelectorRelease = this.selectorRelease.bind(this);

        // Visible DOM element.
        this.size = parent.clientWidth;

        this.element = document.createElement("div");
        this.element.id = id;
        this.element.className = SelectorSwitch.cupClassName;
        parent.appendChild(this.element);
        this.cupSize = this.element.clientWidth;

        this.canvas = document.createElement("canvas");
        this.canvas.height = this.cupSize;
        this.canvas.width = this.cupSize;
        this.canvas.className = SelectorSwitch.className;
        this.element.appendChild(this.canvas);

        let rect = parent.getBoundingClientRect();
        this.selectorRadius = rect.width / 2;                      // radius of selector knob
        this.selectorOriginX = rect.left + this.selectorRadius;    // X offset of center of selector knob
        this.selectorOriginY = rect.top + this.selectorRadius;     // Y offset of center of selector knob
        this.selectorGrabbed = false;                              // selector knob is currently grabbed
        this.selectorMoveId = 0;                                   // move id number used to control nextStep()

        // Build the captions.
        let offset = Math.round(this.size/2);
        let radius = Math.round(this.cupSize/2*1.30) + 2;
        for (let i=0; i<positions.length; ++i) {
            let pos = positions[i];
            let angle = Math.PI - pos*SelectorSwitch.degrees;
            this.positions.push(angle);

            // Create the caption buttons.
            let caption = document.createElement("button");
            caption.id = `SelectorSwitchPos_${i}`;
            caption.type = "button";
            caption.className = SelectorSwitch.captionClassName;

            // Set the position of the upper-left corner of the caption.
            let x = Math.sin(angle)*radius + offset;
            let y = Math.cos(angle)*radius + offset;
            caption.style.left = `${x}px`;
            caption.style.top = `${y}px`;

            // Adjust the position of the upper-left corner depending on the quadrant it's in.
            if (pos < 90) {
                caption.classList.add(SelectorSwitch.slideNoneClassName);
            } else if (pos < 180) {
                caption.classList.add(SelectorSwitch.slideNoneClassName);
            } else if (pos < 270) {
                caption.classList.add(SelectorSwitch.slideLeftClassName);
            } else {
                caption.classList.add(SelectorSwitch.slideLeftClassName);
            }

            const parts = captions[i].split("^");
            caption.textContent = parts[0].trim();
            const title = parts[1].trim();
            if (title.length) {
                caption.title = title;
            }
            parent.appendChild(caption);
            caption.addEventListener("click", this.boundCaptionClick, false);
        }

        document.getElementById("SelectorSwitchDiv").addEventListener("pointerdown", this.boundSelectorGrab, false);
        document.getElementById("SelectorSwitchDiv").addEventListener("pointermove", this.boundSelectorMove, false);
        document.getElementById("HomePage").addEventListener("pointerup", this.boundSelectorRelease, false);

        this.set(initial);              // set to its initial position
    }

    /**************************************/
    dispose() {
        /* Deallocates all elements of the selector switch and unwrires all of
           its events */

        this.changeListener = null;
        while (this.parent.lastChild) {
            const child = this.parent.lastChild;
            this.canvas?.removeEventListener("click", this.boundSetp, false);
            if (child.tagName == "BUTTON") {
                child.removeEventListener("click", this.boundCaptionClick, false);
            }

            this.parent.removeChild(child);
        }

    }

    /**************************************/
    setChangeListener(listener) {
        /* Sets an event handler whenever the knob position is changed. Note
           that this is not a JavaScript event mechanism. It only sets a call-back
           function, and only one function at a time is supported. When the knob
           position is changed and has reached its destination, the listener will
           be called with the new 0-relative position as its only parameter */

        this.changeListener = listener;
    }

    /**************************************/
    removeChangeListener() {
        /* Removes any event handler for knob position changes */

        this.changeListener = null;
    }

    /**************************************/
    set(position) {
        /* Changes the visible state of the knob according to the position index
           and sets this.position to the new position */

        let dc = this.canvas.getContext("2d");
        let posTop = this.positions.length - 1;
        let radius = Math.round(this.cupSize/2);
        const fullCircle = 360*SelectorSwitch.degrees;

        if (position < 0) {
            this.position = posTop;
        } else if (position <= posTop) {
            this.position = position;
        } else {
            this.position = 0;
        }

        dc.save();
        dc.translate(radius, radius);                   // move origin to the center
        dc.fillStyle = SelectorSwitch.canvasColor;      // fill in the panel background (aids antialiasing)
        dc.clearRect(-radius, -radius, this.cupSize, this.cupSize);

        // Compute the pointer wedge verticies.
        radius -= 2;
        let angle = this.positions[this.position];
        let t0x = Math.sin(angle)*(radius-2);
        let t0y = Math.cos(angle)*(radius-2);

        let angle1 = angle + Math.PI + SelectorSwitch.baseAngle;
        let b1x = Math.sin(angle1)*radius;
        let b1y = Math.cos(angle1)*radius;
        let angle2 = angle + Math.PI - SelectorSwitch.baseAngle;
        let b2x = Math.sin(angle2)*radius;
        let b2y = Math.cos(angle2)*radius;

        let angle3 = angle - SelectorSwitch.tipAngle;
        let t1x = Math.sin(angle3)*radius;
        let t1y = Math.cos(angle3)*radius;
        let angle4 = angle + SelectorSwitch.tipAngle;
        let t2x = Math.sin(angle4)*radius;
        let t2y = Math.cos(angle4)*radius;

        // Draw the pointer wedge.
        dc.beginPath();
        dc.moveTo(t1x, t1y);
        dc.fillStyle = "#333";
        dc.shadowOffsetX = 8;
        dc.shadowOffsetY = 8;
        dc.shadowColor = "#444";
        dc.shadowBlur = 8;
        dc.lineTo(t2x, t2y);
        dc.lineTo(b2x, b2y);
        dc.lineTo(b1x, b1y);
        dc.fill();

        // Draw the pointer indicator
        dc.beginPath();
        dc.moveTo(0, 0);
        dc.fillStyle = "white";
        dc.arc(0, 0, 3, fullCircle, false);
        dc.fill();
        dc.beginPath();
        dc.moveTo(0, 0);
        dc.lineWidth = 2;
        dc.strokeStyle = "white";
        dc.lineTo(t0x, t0y);
        dc.closePath();
        dc.stroke();

        dc.restore();                   // pop the outermost save()
    }

    /**************************************/
    moveTo(position, go) {
        /* Steps the knob to the specified position */

        let moveId = ++this.selectorMoveId;
        let steps = position - this.position;
        let dir = Math.sign(steps);

        const nextStep = () => {
            if (moveId != this.selectorMoveId) return;    // make sure that only the most recent pending move is done
            if (position != this.position) {
                this.set(this.position + dir);
                setTimeout(nextStep, 100);
            } else if (go) {
                this?.changeListener(this.position);    // Go to selected website section
            }
        };

        if (steps) {
            if (Math.abs(steps) > (this.positions.length / 2)) {
                dir = -dir;
            }
            nextStep();
        } else if (go) {
            this?.changeListener(this.position);    // Go to selected website section
        }
    }

    /**************************************/
    captionClick(ev) {
        /* Handles a click event on one of the position captions to move the
           knob to the position of that caption */

        let e = ev.target;

        while (e.tagName != "BUTTON") {
            e = e.parentElement;
        }

        let id = e.id;
        let [prefix, suffix] = id.split("_");

        if (prefix == "SelectorSwitchPos") {
            if (suffix) {
                let position = parseInt(suffix, 10);
                if (!isNaN(position) && position < this.positions.length && position >= 0) {
                    if (this.position == position) {
                        this?.changeListener(this.position);
                    } else {
                        this.moveTo(position, true);
                    }
                }
            }
        }
    }

    /**************************************/
    withinSelector(ev) {
        /* Returns true if pointer is within selector cup */

        let x = ev.clientX - this.selectorOriginX;
        let y = ev.clientY - this.selectorOriginY;
        let dist = Math.sqrt(x * x + y * y);

        return (dist <= this.selectorRadius);
    }

    /**************************************/
    selectorPosition(ev) {
        /* Returns the current position of the pointer */

        let x = ev.clientX - this.selectorOriginX;
        let y = ev.clientY - this.selectorOriginY;
        let angle = Math.atan2(y, x) / SelectorSwitch.degrees;
        let position = (Math.floor((angle + 360) / 30) + 4) % 12;

        return position;
    }

    /**************************************/
    selectorGrab(ev) {
        /* Handles selector knob being grabbed and rotate knob to matching angle */

        if (!this.withinSelector(ev)) return;

        this.selectorGrabbed = true;
        this.parent.style.cursor = "grabbing";

        this.moveTo(this.selectorPosition(ev), false);
    }

    /**************************************/
    selectorMove(ev) {
        /* Handles selector knob being turned and rotate knob to new angle */

        if (!this.withinSelector(ev)) {
            this.parent.style.cursor = "default";
            return;
        } else {
            if (!this.selectorGrabbed) {
                this.parent.style.cursor = "grab";
                return;
            } else {
                this.parent.style.cursor = "grabbing";
            }
        }

        this.moveTo(this.selectorPosition(ev), false);
    }

    /**************************************/
    selectorRelease(ev) {
        /* Handles selector knob being released, rotate knob to final position,
           then go to selected section */

        if (!this.withinSelector(ev)) {
            this.selectorGrabbed = false;
            this.parent.style.cursor = "default";
            return;
        } else {
            this.parent.style.cursor = "grab";
            if (!this.selectorGrabbed) return;
        }

        this.selectorGrabbed = false;

        this.moveTo(this.selectorPosition(ev), true);
    }

} // class SelectorSwitch
