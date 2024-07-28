/**
 * @name HideSidebarPro
 * @version 0.3.0
 * @description Hides the sidebar and reveals on hover. Toggle server list with icon in top right.
 * @author atetrax
 * @authorLink https://github.com/JamesN-dev
 * @authorid 204011638695657472
 * @donate https://www.buymeacoffee.com/s5mwQYovSz
 * @website https://github.com/JamesN-dev/HideSidebarPro
 * @source https://github.com/JamesN-dev/HideSidebarPro/blob/main/HideSidebarPro.plugin.js
 * @updateUrl https://raw.githubusercontent.com/JamesN-dev/HideSidebarPro/main/HideSidebarPro.plugin.js
 */

const PLUGIN_NAME = "HideSidebarPro";
const PLUGIN_VERSION = "0.3.0";

class Tooltip {
    constructor(node, text, options = {}) {
        const { style = "black", side = "top", preventFlip = false, isTimestamp = false, disablePointerEvents = false, disabled = false } = options;
        this.node = node;
        if (!this.node) {
            console.error(`[${PLUGIN_NAME}] Tooltip target node not found.`);
            return;
        }
        this.label = text;
        this.style = style.toLowerCase();
        this.side = side.toLowerCase();
        this.preventFlip = preventFlip;
        this.isTimestamp = isTimestamp;
        this.disablePointerEvents = disablePointerEvents;
        this.disabled = disabled;
        this.active = false;

        this.element = document.createElement('div');
        this.element.className = 'layer-v9HyYc';
        this.tooltipElement = document.createElement('div');
        this.tooltipElement.className = `tooltip-2QfLtc tooltip-${this.style}`;
        this.tooltipPointer = document.createElement('div');
        this.tooltipPointer.className = 'tooltipPointer-3ZfirK';
        this.tooltipContent = document.createElement('div');
        this.tooltipContent.className = 'tooltipContent';
        this.tooltipContent.textContent = this.label;
        this.tooltipElement.append(this.tooltipPointer, this.tooltipContent);
        this.element.append(this.tooltipElement);

        this.node.addEventListener("mouseenter", () => {
            if (this.disabled) return;
            this.show();
        });

        this.node.addEventListener("mouseleave", () => {
            this.hide();
        });
    }

    static create(node, text, options = {}) {
        return new Tooltip(node, text, options);
    }

    get container() {
        return document.querySelector('.layerContainer');
    }

    hide() {
        if (!this.active) return;
        this.active = false;
        if (this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }

    show() {
        const container = this.container;
        if (!container) {
            console.error(`[${PLUGIN_NAME}] Tooltip container not found.`);
            return;
        }

        if (this.active) return;
        this.active = true;
        container.append(this.element);

        const rect = this.node.getBoundingClientRect();
        const { offsetHeight: tooltipHeight, offsetWidth: tooltipWidth } = this.tooltipElement;

        let top, left;

        if (this.side === 'top') {
            top = rect.top - tooltipHeight - 10;
            left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        } else if (this.side === 'bottom') {
            top = rect.bottom + 10;
            left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        } else if (this.side === 'left') {
            top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
            left = rect.left - tooltipWidth - 10;
        } else if (this.side === 'right') {
            top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
            left = rect.right + 10;
        }

        this.element.style.top = `${top}px`;
        this.element.style.left = `${left}px`;

        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if ([...mutation.removedNodes].includes(this.node) || this.node.closest('[aria-hidden=true]')) {
                    this.hide();
                    observer.disconnect();
                }
            }
        });

        observer.observe(document.body, { subtree: true, childList: true });
    }
}

module.exports = class HideSidebarPro {
    constructor() {
        this.defaultSettings = {
            smallServerList: false,
            removeButton: false,
            hideServers: true
        };
        this.settings = this.loadSettings();
    }

    start() {
        console.info(`%c[${PLUGIN_NAME}]`, 'color: blue; font-weight: bold;', 'initializing...');

        this.applyInitialStyles();
        if (!this.settings.removeButton) {
            this.addHideServersButton();
        }
        if (this.settings.hideServers) {
            this.hideServerSidebar(); // Hide server list on startup if setting is enabled
        }

        // Checks for HideServersButton when changes are detected and adds it if it doesn't exist
        this.observer = new MutationObserver(() => {
            this.checkAndAddButton();
        });

        this.observer.observe(document.body, { childList: true, subtree: true });

        console.info(`%c[${PLUGIN_NAME}]`, 'color: blue; font-weight: bold;', `version ${PLUGIN_VERSION} has started.`);
    }

    stop() {
        BdApi.clearCSS('HideSidebarStyles');
        BdApi.clearCSS('SmallServerListStyles');
        const hideButton = document.getElementById('toolbar-hds-btn');
        if (hideButton) {
            hideButton.remove();
        }
        document.body.classList.remove('channel-hide'); // Ensure the sidebar is shown when the plugin stops

        // Disconnect observer
        if (this.observer) {
            this.observer.disconnect();
        }
    }

    addHideServersButton() {
        const toolbar = document.querySelector('.toolbar_e44302');
        if (toolbar && !document.getElementById('toolbar-hds-btn')) {
            const buttonWrapper = document.createElement('div');
            buttonWrapper.className = 'iconWrapper_e44302 clickable_e44302';
            buttonWrapper.setAttribute('role', 'button');
            buttonWrapper.id = 'toolbar-hds-btn';
            buttonWrapper.setAttribute('aria-label', 'Toggle Servers');
            buttonWrapper.setAttribute('aria-expanded', 'false');
            buttonWrapper.setAttribute('tabindex', '0');

            buttonWrapper.setAttribute('title', 'Hide Servers');

            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('x', '0');
            svg.setAttribute('y', '0');
            svg.setAttribute('aria-hidden', 'true');
            svg.setAttribute('role', 'img');
            svg.setAttribute('width', '24');
            svg.setAttribute('height', '24');
            svg.setAttribute('viewBox', '0 0 24 24');

            const serverPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            serverPath.setAttribute('fill', 'currentColor');
            serverPath.setAttribute('d', 'M20 7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7zM6 7h12v2H6V7zm0 4h12v2H6v-2zm0 4h12v2H6v-2z');

            const linePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            linePath.setAttribute('fill', 'currentColor');
            linePath.setAttribute('d', 'M3.707 2.293a1 1 0 0 0-1.414 1.414l18 18a1 1 0 0 0 1.414-1.414l-18-18z');

            svg.appendChild(serverPath);
            svg.appendChild(linePath);

            buttonWrapper.appendChild(svg);
            toolbar.appendChild(buttonWrapper);

            buttonWrapper.onclick = () => {
                const guildsWrapper = document.querySelector('[class*="guilds"]');
                if (guildsWrapper) {
                    const isExpanded = buttonWrapper.getAttribute('aria-expanded') === 'true';
                    buttonWrapper.setAttribute('aria-expanded', String(!isExpanded));
                    guildsWrapper.style.display = isExpanded ? '' : 'none';

                    buttonWrapper.setAttribute('title', isExpanded ? 'Show Servers' : 'Hide Servers');
                }
            };

            // Add the tooltip
            Tooltip.create(buttonWrapper, 'Hide Servers', { style: 'black', side: 'top' });
        }
    }

    checkAndAddButton() {
        const button = document.getElementById('toolbar-hds-btn');
        if (this.settings.removeButton) {
            if (button) {
                button.remove();
            }
        } else {
            if (!button) {
                this.addHideServersButton();
            }
        }
    }

    applyInitialStyles() {
        const style = `
            body.channel-hide div[class*="sidebar"] {
                transition: all 0.25s ease;
                width: 0 !important;
                padding-left: 3.5vmin !important;
            }
            body.channel-hide div[class*="sidebar"]:hover {
                width: 240px !important;
                padding-left: 0 !important;
            }

            body.channel-hide div[class*="sidebar"] > * {
                visibility: hidden;
                opacity: 0;
                transition: visibility 0s 0.25s, opacity 0.25s linear;
            }

            body.channel-hide div[class*="sidebar"]:hover > * {
                visibility: visible;
                opacity: 1;
                transition: opacity 0.25s linear;
            }

            #toolbar-hds-btn {
                display: block;
                background: none;
                color: #ffffff;
                padding-top: 5px;
                padding-bottom: 5px;
                z-index: 100;
                border-radius: 4px;
                width: 100px; // Set button width
                position: relative;
            }

            #toolbar-hds-btn svg path {
                fill: #B5BAC1; /* Unhovered icon color */
            }

            #toolbar-hds-btn:hover svg path {
                fill: #DCDEE1; /* Hovered icon color */
            }

            #toolbar-hds-btn::after {
                content: attr(title);
                position: absolute;
                background: #111214; /* Tooltip background color */
                color: #ffffff; /* Tooltip text color */
                padding: 5px 10px;
                border-radius: 4px;
                white-space: nowrap;
                top: calc(100% + 5px); /* Position the tooltip below the icon with some spacing */
                left: 50%;
                transform: translateX(-50%);
                z-index: 200;
                font-size: 12px;
                opacity: 0;
                transition: opacity 0.2s ease-in-out;
            }

            #toolbar-hds-btn:hover::after {
                opacity: 1;
            }

            body.channel-hide .noticeInfo-3_iTE1,
            .notice-2FJMB4 {
                z-index: 1000;
            }

            body.channel-hide div[class*="toolbar-"] {
                padding-right: 100px;
            }

            body.channel-hide .container-3gCOGc {
                z-index: 0;
            }

            body.channel-hide #hds-btn {
                display: block;
                background: #4f5660;
                color: white;
                padding-top: 5px;
                padding-bottom: 5px;
                position: absolute;
                top: 10px;
                right: 9px;
                z-index: 100;
                border-radius: 4px;
                width: 90px;
            }

            body.channel-hide.channel-hide div[class*="sidebar"] {
                transition: all 0.1s ease 0.1s;
                width: 0 !important;
                padding-left: 3.5vmin !important;
            }
            body.channel-hide.channel-hide div[class*="sidebar"]:hover {
                width: 240px !important;
                padding-left: 0 !important;
            }

            body.channel-hide.channel-hide div[class*="sidebar"] > * {
                visibility: hidden;
                opacity: 0;
                transition: visibility 0s 0.2s, opacity 0.2s linear;
            }

            body.channel-hide.channel-hide div[class*="sidebar"]:hover > * {
                visibility: visible;
                opacity: 1;
                transition: opacity 0.4s linear;
            }
        `;
        BdApi.injectCSS('HideSidebarStyles', style);

        if (this.settings.smallServerList) {
            const smallServerListStyle = `
                nav[aria-label="Servers sidebar"] {
                    display: flex;
                    width: 55px;
                }

                nav[aria-label="Servers sidebar"] ul[class^="tree_"] div {
                   align-self: center;
                   justify-self: center;
                }

                nav[aria-label="Servers sidebar"] div[class^="listItem"] {
                    align-self: center;
                    justify-self: center;
                }

                .svg_c5f96a,
                .wrapper_c5f96a {
                    height: 35px !important;
                    width: 35px !important;
                }
            `;
            BdApi.injectCSS('SmallServerListStyles', smallServerListStyle);
        }
    }

    hideServerSidebar() {
        const sidebar = document.querySelector('[class*="sidebar"]');
        if (sidebar) {
            sidebar.classList.remove('visible');
            document.body.classList.add('channel-hide');
        } else {
            console.error('Sidebar element not found.');
        }
    }

    showSidebar() {
        const sidebar = document.querySelector('[class*="sidebar"]');
        if (sidebar) {
            sidebar.classList.add('visible');
            document.body.classList.remove('channel-hide');
        } else {
            console.error('Sidebar element not found.');
        }
    }

    loadSettings() {
        return Object.assign({}, this.defaultSettings, BdApi.Data.load("HideSidebarPro", "settings"));
    }

    saveSettings() {
        BdApi.Data.save("HideSidebarPro", "settings", this.settings);
    }

    applySettings() {
        this.stop();
        this.start();
    }

    getSettingsPanel() {
        const panel = document.createElement("div");

        const createSetting = (name, key) => {
            const settingDiv = document.createElement("div");
            settingDiv.className = "setting";

            const label = document.createElement("label");
            label.textContent = name;

            const input = document.createElement("input");
            input.type = "checkbox";
            input.checked = this.settings[key];
            input.onchange = (e) => {
                this.settings[key] = e.target.checked;
                this.saveSettings();
                this.applySettings();
            };

            settingDiv.appendChild(input);
            settingDiv.appendChild(label);
            return settingDiv;
        };

        const removeButtonLabel = this.settings.removeButton ? "Show Hide Servers Icon" : "Remove Hide Servers Icon"; 
        panel.appendChild(createSetting(removeButtonLabel, "removeButton"));
        panel.appendChild(createSetting("Small Server List", "smallServerList"));
        panel.appendChild(createSetting("Reveal Sidebar On Hover", "hideServers"));

        return panel;
    }
};