/**
 * @name HideSidebarPro
 * @version 1.0.0
 * @description A plugin to hide the sidebar in Discord.
 * @author atetrax
 * @authorLink https://github.com/JamesN-dev
 * @invite YourInviteCode
 * @donate https://www.buymeacoffee.com/s5mwQYovSz
 * @website https://github.com/JamesN-dev/HideSidebarPro
 * @source https://github.com/JamesN-dev/HideSidebarPro/blob/main/HideSidebarPro.plugin.js
 * @updateUrl https://raw.githubusercontent.com/JamesN-dev/HideSidebarPro/main/HideSidebarPro.plugin.js
 */

module.exports = class HideSidebarPro {
    constructor() {
        this.defaultSettings = {
            forceProvider: false,
            enableHoverArea: true,
            hoverDelay: 300,
            sidebarWidth: 240,
            buttonText: 'Hide Servers',
            buttonPosition: 'top-right',
            smallSidebar: false
        };
        this.settings = this.loadSettings();
    }

    start() {
        console.log('HideSidebarPro initializing...');

        if (this.settings.enableHoverArea) {
            this.addHoverArea();
        }
        this.addHideServersButton();
        this.applyInitialStyles();
        this.hideSidebar(); // Hide sidebar on startup

        console.log('HideSidebarPro initialized.');
    }

    stop() {
        BdApi.clearCSS('HideSidebarStyles');
        BdApi.clearCSS('SmallSidebarStyles');
        const hoverArea = document.getElementById('hover-area');
        if (hoverArea) {
            hoverArea.remove();
        }
        const hideButton = document.getElementById('hds-btn');
        if (hideButton) {
            hideButton.remove();
        }
        document.body.classList.remove('channel-hide'); // Ensure the sidebar is shown when the plugin stops
    }

    addHoverArea() {
        const hoverArea = document.createElement('div');
        hoverArea.id = 'hover-area';
        document.body.appendChild(hoverArea);

        let hoverTimer;

        hoverArea.addEventListener('mouseenter', () => {
            hoverTimer = setTimeout(() => {
                this.showSidebar();
            }, this.settings.hoverDelay); // Use hover delay from settings
        });

        hoverArea.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimer);
            this.hideSidebar();
        });

        const sidebar = document.querySelector('[class*="sidebar"]');
        sidebar.addEventListener('mouseleave', (event) => {
            if (!hoverArea.contains(event.relatedTarget)) {
                this.hideSidebar();
            }
        });
    }

    addHideServersButton() {
        const button = document.createElement('button');
        button.id = 'hds-btn';
        button.textContent = this.settings.buttonText; // Use button text from settings
        button.style.position = 'absolute';
        switch (this.settings.buttonPosition) {
            case 'top-left':
                button.style.top = '8px';
                button.style.left = '7px';
                break;
            case 'top-right':
                button.style.top = '8px';
                button.style.right = '7px';
                break;
            case 'bottom-left':
                button.style.bottom = '8px';
                button.style.left = '7px';
                break;
            case 'bottom-right':
                button.style.bottom = '8px';
                button.style.right = '7px';
                break;
        }

        button.onclick = () => {
            const guildsWrapper = document.querySelector('[class*="guilds"]');
            if (guildsWrapper) {
                if (guildsWrapper.style.display === 'none') {
                    guildsWrapper.style.display = '';
                    button.textContent = this.settings.buttonText;
                } else {
                    guildsWrapper.style.display = 'none';
                    button.textContent = 'Show Servers';
                }
            }
        };
        document.body.appendChild(button);
    }

    applyInitialStyles() {
        const style = `
            body.channel-hide div[class*="sidebar"] {
                transition: all 0.25s ease;
                width: 0 !important;
                padding-left: 3.5vmin !important;
            }
            body.channel-hide div[class*="sidebar"]:hover {
                width: ${this.settings.sidebarWidth}px !important; // Use sidebar width from settings
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

            #hover-area {
                position: absolute;
                left: 72px; /* Adjust width of the guilds bar */
                top: 0;
                bottom: 0;
                width: 10px; /* Hover area width */
                z-index: 1000;
                background: transparent; /* Ensure the hover area is invisible */
            }

            #hds-btn {
                display: block;
                background: #4f5660;
                color: white;
                padding-top: 4px;
                padding-bottom: 4px;
                z-index: 100;
                border-radius: 3px;
                width: 80px;
            }
        `;
        BdApi.injectCSS('HideSidebarStyles', style);

        if (this.settings.smallSidebar) {
            const smallSidebarStyle = `
                div[class^="sidebar"] {
                    width: 160px !important;
                }

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

                section[aria-label="User area"] div[class^="container"] {
                    height: 76px;
                    font-size: 14px;
                    font-weight: 500;
                    display: flex;
                    padding: 0 8px 1px;
                    flex-shrink: 0;
                    position: relative;
                    flex-direction: column-reverse;
                    flex-wrap: wrap;
                    align-content: flex-start;
                    align-items: flex-start;
                    justify-content: center;
                }
            `;
            BdApi.injectCSS('SmallSidebarStyles', smallSidebarStyle);
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
            console.error('Sidebar element not found.');
        }
    }

    loadSettings() {
        return Object.assign({}, this.defaultSettings, BdApi.Data.load("HideSidebarPro", "settings"));
    }

    saveSettings() {
        BdApi.Data.save("HideSidebarPro", "settings", this.settings);
    }

    getSettingsPanel() {
        const panel = document.createElement("div");

        const createSetting = (name, key, type, callback) => {
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
                    this.saveSettings();
                    if (callback) callback();
                };
            } else {
                input = document.createElement("input");
                input.type = type;
                input.value = this.settings[key];
                input.onchange = (e) => {
                    this.settings[key] = type === "number" ? parseInt(e.target.value) : e.target.value;
                    this.saveSettings();
                    if (callback) callback();
                };
            }

            settingDiv.appendChild(label);
            settingDiv.appendChild(input);
            return settingDiv;
        };

//        panel.appendChild(createSetting("Force Provider", "forceProvider", "checkbox")); // Not fully implemented yet
        panel.appendChild(createSetting("Enable Hover Area", "enableHoverArea", "checkbox", () => location.reload()));
        panel.appendChild(createSetting("Hover Delay (ms)", "hoverDelay", "number"));
//        panel.appendChild(createSetting("Sidebar Width (px)", "sidebarWidth", "number")); // Not fully implemented yet
        panel.appendChild(createSetting("Button Text", "buttonText", "text"));
//        panel.appendChild(createSetting("Button Position", "buttonPosition", "text")); // Not fully implemented yet
//        panel.appendChild(createSetting("Small Sidebar", "smallSidebar", "checkbox", () => location.reload())); // Not fully implemented yet

        return panel;
    }
};