class SingleSelectDropdown extends HTMLElement {
    // Initialize some private variables here if needed, or inside the constructor.
    readonly _selectContainer: HTMLElement;
    readonly _selectedDisplay: HTMLElement;

    constructor() {
        // This is always needed to pull everything from the HTMLElement class.
        super();

        // Create shadowRoot element, CSS, and HTML, in that order.
        const template = document.createElement('template');
        template.innerHTML += `
        <style>
        *, *::before, *::after {
            box-sizing:border-box;
            color: #232526;
        }

        [select-container] {
            position:relative;
            width:300px;
        }

        [selected-display] {
            background-color:var(--white);
            border:1px solid #8d9599;
            height:2.5rem;
            line-height:2.5;
            padding-left:1rem;
            font-family:monospace;
            background-image:url('https://websolutionscdn.blob.core.windows.net/orchid/icons/arrows/chevron-down.svg'); /* Potential Problem - Make the variable here or use it from the global scope? */
            background-repeat:no-repeat;
            background-position:right 0.75rem center;
            background-size:1rem 1rem;
            cursor:pointer;
        }

        [select-container][is--open] [selected-display] {
            background-image:url('https://websolutionscdn.blob.core.windows.net/orchid/icons/arrows/chevron-up.svg');
        }

        [selected-display]:focus,
        [select-options]:focus {
            border-color:#b82c97;
            outline:1px solid #b82c97;
        }

        [select-options] {
            background-color:#fff;
            border:1px solid #8d9599;
            border-top:0;
            display:none;
            max-height:300px;
            overflow-y:auto;
            position: absolute;
            top:calc(100% + 1px);
            left:0;
            right:0;
            z-index:1;
        }

        [select-container][is--open] [select-options] {
            display:block;
            font-family:monospace;
        }

        ::slotted(single-select-option) {
            display:block;
            padding:0.5rem 1rem;
        }

        ::slotted(single-select-option:hover) {
            background-color:#edcce5;
        }

        :host([disabled=true]) {
            pointer-events:none;
            user-select:none;
        }

        :host([disabled=true]) [selected-display] {
            background-color:#dee1e3;
            box-shadow:0 0 0 1px #8d9599 inset;
            color:#8d9599;
            background-image:url('https://websolutionscdn.blob.core.windows.net/orchid/icons/arrows/chevron-down-light.svg');
            cursor:not-allowed;
        }
        </style>`;
        template.innerHTML += `
        <div select-container>
        <div selected-display aria-autocomplete="none" aria-owns="listbox" aria-expanded="false" aria-haspopup="listbox" role="combobox" tabindex="0"></div>
        <div select-options role="listbox" id="listbox">
            <slot name="option"></slot>
        </div>
        </div>`;

        // Create the shadowRoot and append the template.
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // Get specific elements from the shadowRoot.
        // Do these attributes need set or get?
        this._selectContainer = this.shadowRoot.querySelector('[select-container]');
        this._selectedDisplay = this.shadowRoot.querySelector('[selected-display]');

        // For skeleton display.
        this._selectedDisplay.innerText = 'Select...';

        // Bind functions necessary for the custom element to the class.
        this._click = this._click.bind(this);
        this._getAllOptions = this._getAllOptions.bind(this);
    }

    connectedCallback() {
        // Current label check, subject to change.
        if (!document.getElementById(this.getAttribute('label'))) {
            this._selectedDisplay.setAttribute('aria-label', this.getAttribute('label'));
        } else {
            this._selectedDisplay.setAttribute('aria-labelledby', this.getAttribute('label'));
        }

        // Close the dropdown if clicked anywhere outside the dropdown.
        document.addEventListener('click', (e) => {
            if (e.target !== this) {
                this._selectContainer.removeAttribute('is--open');
                this._selectedDisplay.setAttribute('aria-expanded', 'false');
            }
        });

        // Add a listener to the first child of the select dropdown.
        this._selectContainer.addEventListener('click', (e) => this._click(e));
    }

    private _click(e) {
        if (e.target === this._selectedDisplay) {
            // Do these attributes need set or get?
            this._selectContainer.toggleAttribute('is--open');
            this._selectedDisplay.setAttribute('aria-expanded', this._selectedDisplay.getAttribute('aria-expanded') === 'false' ? 'true' : 'false');
        } else {
            // Must be an option clicked.
            this._selectedDisplay.setAttribute('aria-activedescendant', e.target.id);
            this._selectedDisplay.innerText = e.target.textContent;
            this._getAllOptions().map(option => option.setAttribute('aria-selected', 'false'));
            e.target.setAttribute('aria-selected', 'true');
        }
    }

    private _getAllOptions() {
        return Array.from(this.querySelectorAll('single-select-option'));
    }

    get disabled() {
        return this.getAttribute('disabled');
    }

    set disabled(v) {
        this.setAttribute('disabled', v);
    }

    get value() {
        return this.getAttribute('value');
    }

    set value(v) {
        this.setAttribute('value', v);
    }

    static get observedAttributes() {
        return ['disabled', 'value'];
    }

    attributeChangedCallback(attributeName, oldValue, newValue) {
        // Handle a form control value change from the framework when an option is selected or preselected.
        if (attributeName === 'value') {
            const options = this._getAllOptions();

            if (!newValue) {
                // Reset button if no preselected option. Value is blank here.
                options.forEach((el: SingleSelectOption) => {
                    this._selectedDisplay.removeAttribute('aria-activedescendant');
                    this._selectedDisplay.innerText = 'Select...';
                    el.setAttribute('aria-selected', 'false');
                });
            } else {
                // Bind value on regular option click or bind preselected value on form reset.
                // Framework is changing the value property through the (change) function, thus this is fired when an
                // option is clicked and changes the value property of the form.
                options.forEach((el: SingleSelectOption) => {
                    if (newValue === el.value) {
                        this._selectedDisplay.setAttribute('aria-activedescendant', el.id);
                        this._selectedDisplay.innerText = el.name;
                        el.setAttribute('aria-selected', 'true');
                    } else {
                        // Reset non-preselect options to not be the preselect option.
                        el.setAttribute('aria-selected', 'false');
                    }
                });
            }
        }
    }

    disconnectedCallback() {
        document.removeEventListener('click', () => { });
        this._selectContainer.removeEventListener('click', this._click);
    }
}
window.customElements.define('single-select-dropdown', SingleSelectDropdown);

class SingleSelectOption extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.setAttribute('slot', 'option');
        this.setAttribute('role', 'option');
        this.setAttribute('aria-selected', 'false');
        this.setAttribute('id', `sso-${Math.random().toString(32).substring(2, 4) + Math.random().toString(32).substring(2, 4)}`);

        // If values are inline HTML, we have to set the display text of the option.
        this.innerText = this.name;

        // Click is already delegated in the parent, so this event bubbles to its delegation, also on the parent.
        this.addEventListener('click', () => this.dispatchEvent(new Event('change', { bubbles: true })));
    }

    get value() {
        return this.getAttribute('value');
    }

    set value(v) {
        this.setAttribute('value', v);
    }

    get name() {
        return this.getAttribute('name');
    }

    set name(v) {
        this.setAttribute('name', v);
    }

    static get observedAttributes() {
        return ['value', 'name'];
    }

    attributeChangedCallback(attributeName, oldValue, newValue) {
        // Can't assume an order of when the props will fire.
        if (attributeName === 'name') {
            this.innerText = newValue;
        }

        if (attributeName === 'value') {
            // These two classes are not tied together with inheritance. An option isn't an extended
            // dropdown. We are casting the class in TS to access the defined properties.
            const parent = <SingleSelectDropdown>this.parentElement;
            if (parent && parent.value === newValue) {
                parent._selectedDisplay.setAttribute('aria-activedescendant', this.id);
                parent._selectedDisplay.innerText = this.name;
                this.setAttribute('aria-selected', 'true');
            }
        }
    }
}
window.customElements.define('single-select-option', SingleSelectOption);

// From Google.
// Talking Point: Stops a property from conflicting with an already existing or set default property.
/* this._upgradeProperty = this._upgradeProperty.bind(this);
_upgradeProperty(prop) {
    if (this.hasOwnProperty(prop)) {
        let value = this[prop];
        delete this[prop];
        this[prop] = value;
    }
}  */
