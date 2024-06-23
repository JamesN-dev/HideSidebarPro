/**
 * @name HideSidebarPro
 * @version 0.0.2
 * @description Hides the sidebar and reveals on hover. Toggle server list with icon in top right.
 * @author atetrax
 * @authorLink https://github.com/JamesN-dev
 * @authorid 204011638695657472
 * @donate https://www.buymeacoffee.com/s5mwQYovSz
 * @website https://github.com/JamesN-dev/HideSidebarPro
 * @source https://github.com/JamesN-dev/HideSidebarPro/blob/main/HideSidebarPro.plugin.js
 * @updateUrl https://raw.githubusercontent.com/JamesN-dev/HideSidebarPro/main/HideSidebarPro.plugin.js
 */

module.exports = class HideSidebarPro {
    constructor() {
        this.defaultSettings = {
            buttonText: 'Hide Servers',
            smallServerList: false,
            removeButton: false,
            hideServers: true
        };
        this.settings = this.loadSettings();
    }

    start() {
        console.log('HideSidebarPro initializing...');

        if (!this.settings.removeButton) {
            this.addHideServersButton();
        }
        this.applyInitialStyles();
        if (this.settings.hideServers) {
            this.hideSidebar(); // Hide sidebar on startup
        }

        console.log('HideSidebarPro initialized.');
    }

    stop() {
        BdApi.clearCSS('HideSidebarStyles');
        BdApi.clearCSS('SmallServerListStyles');
        const hideButton = document.getElementById('hds-btn');
        if (hideButton) {
            hideButton.remove();
        }
        document.body.classList.remove('channel-hide'); // Ensure the sidebar is shown when the plugin stops
    }

    addHideServersButton() {
        const toolbar = document.querySelector('.toolbar_e44302');
        if (toolbar) {
            const buttonWrapper = document.createElement('div');
            buttonWrapper.className = 'iconWrapper_e44302 clickable_e44302';
            buttonWrapper.setAttribute('role', 'button');
            buttonWrapper.id = 'toolbar-hds-btn';            
            buttonWrapper.setAttribute('aria-label', 'Toggle Servers');
            buttonWrapper.setAttribute('aria-expanded', 'false');
            buttonWrapper.setAttribute('tabindex', '0');
    
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('x', '0');
            svg.setAttribute('y', '0');
            svg.setAttribute('aria-hidden', 'true');
            svg.setAttribute('role', 'img');
            svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            svg.setAttribute('width', '24');
            svg.setAttribute('height', '24');
            svg.setAttribute('fill', 'none');
            svg.setAttribute('viewBox', '0 0 24 24');
    
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('fill', 'currentColor');
            path.setAttribute('d', 'M12 2.81a1 1 0 0 1 0-1.41l.36-.36a1 1 0 0 1 1.41 0l9.2 9.2a1 1 0 0 1 0 1.4l-.7.7a1 1 0 0 1-1.3.13l-9.54-6.72a1 1 0 0 1-.08-1.58l1-1L12 2.8ZM12 21.2a1 1 0 0 1 0 1.41l-.35.35a1 1 0 0 1-1.41 0l-9.2-9.19a1 1 0 0 1 0-1.41l.7-.7a1 1 0 0 1 1.3-.12l9.54 6.72a1 1 0 0 1 .07 1.58l-1 1 .35.36ZM15.66 16.8a1 1 0 0 1-1.38.28l-8.49-5.66A1 1 0 1 1 6.9 9.76l8.49 5.65a1 1 0 0 1 .27 1.39ZM17.1 14.25a1 1 0 1 0 1.11-1.66L9.73 6.93a1 1 0 0 0-1.11 1.66l8.49 5.66Z');
            path.setAttribute('clip-rule', 'evenodd');
            svg.appendChild(path);
    
            buttonWrapper.appendChild(svg);
            toolbar.appendChild(buttonWrapper);
    
            buttonWrapper.onclick = () => {
                const guildsWrapper = document.querySelector('[class*="guilds"]');
                if (guildsWrapper) {
                    const isExpanded = buttonWrapper.getAttribute('aria-expanded') === 'true';
                    buttonWrapper.setAttribute('aria-expanded', String(!isExpanded));
                    guildsWrapper.style.display = isExpanded ? '' : 'none';
                }
            };
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

            #hds-btn {
                display: block;
                background: #4f5660;
                color: white;
                padding-top: 5px;
                padding-bottom: 5px;
                z-index: 100;
                border-radius: 4px;
                width: 100px; // Set button width
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

    hideSidebar() {
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
            console.error('        sidebar element not found.');
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

        const createSetting = (name, key, type) => {
            const settingDiv = document.createElement("div");
            settingDiv.className = "setting";

            const label = document.createElement("span");
            label.textContent = name;

            let input;
            if (type === "checkbox") {
                input = document.createElement("input");
                input.type = type;
                input.checked = this.settings[key];
                input.onchange = (e) => {
                    this.settings[key] = e.target.checked;
                };
            } else {
                input = document.createElement("input");
                input.type = type;
                input.value = this.settings[key];
                input.onchange = (e) => {
                    this.settings[key] = type === "number" ? parseInt(e.target.value) : e.target.value;
                };
            }

            settingDiv.appendChild(label);
            settingDiv.appendChild(input);
            return settingDiv;
        };

        panel.appendChild(createSetting("Button Text", "buttonText", "text"));
        panel.appendChild(createSetting("Small Server List", "smallServerList", "checkbox"));
        panel.appendChild(createSetting("Hide Server Button", "removeButton", "checkbox"));
        panel.appendChild(createSetting("Hide Servers", "hideServers", "checkbox"));

        const reloadButton = document.createElement("button");
        reloadButton.textContent = "Reload Discord";
        reloadButton.onclick = () => {
            this.saveSettings();
            location.reload();
        };

        panel.appendChild(reloadButton);

        return panel;
    }
};