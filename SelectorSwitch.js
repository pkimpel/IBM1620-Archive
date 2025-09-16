/***********************************************************************
* IBM-1620/Archive SelectorSwitch.js
************************************************************************
* Copyright (c) 2025, Paul Kimpel.
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

        this.boundStep = this.step.bind(this);
        this.boundCaptionClick = this.captionClick.bind(this);
        this.changeListener = null;     // listener function to report knob changes -- only one allowed

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

        this.set(initial);              // set to its initial position
        //this.canvas.addEventListener("click", this.boundStep, false);
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
    step(ev) {
        /* Event handler for clicks within the "cup" (this.canvas). Steps the
        tip of the knob to its next position in the direction of the click. If
        it is at the last position, steps it to the first position, and vice
        versa. This approach was suggested by Dave Babcock */
        let rect = this.canvas.getBoundingClientRect();

        // Get the click coordinates and transform to "cup" coordinates.
        let x = ev.clientX - rect.left - rect.width/2;
        let y = ev.clientY - rect.top  - rect.height/2;
        let hypotenuse = Math.sqrt(x*x + y*y);

        if (hypotenuse > 0) {           // if it's at dead center, we can't do anything
            // Compute the radial angle of the click point and adjust for its quadrant.
            let angle = Math.asin(x/hypotenuse);
            if (y > 0) {
                angle = Math.PI - angle;
            } else if (x < 0) {
                angle = Math.PI*2 + angle;
            }

            // Compute the angle between click and knob tip, check for origin crossover.
            let knobAngle = Math.PI - this.positions[this.position];
            let delta = angle - knobAngle;
            if (Math.abs(delta) > Math.PI) {
                delta = -delta;
            }

            this.set(this.position + Math.sign(delta));
            if (this.changeListener) {
                this.changeListener(this.position);
            }
        }
    }

    /**************************************/
    moveTo(position) {
        /* Steps the knob to the specified position */
        let steps = position - this.position;
        let dir = Math.sign(steps);

        const nextStep = () => {
            this.set(this.position+dir);
            if (this.position != position) {
                setTimeout(nextStep, 100);
             } else {
                this?.changeListener(this.position);
            }
        };

        if (steps) {
            if (Math.abs(steps) > this.positions.length/2) {
                dir = -dir;
            }
            nextStep();
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
                        this.moveTo(position);
                    }
                }
            }
        }
    }

} // class SelectorSwitch
