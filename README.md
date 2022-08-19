# Frappe Login Session Defaults Popup
A small plugin for Frappe that shows the session defaults popup after login.

### Table of Contents
<ul>
    <li><a href="#requirements">Requirements</a></li>
    <li>
        <a href="#setup">Setup</a>
        <ul>
            <li><a href="#install">Install</a></li>
            <li><a href="#update">Update</a></li>
            <li><a href="#uninstall">Uninstall</a></li>
        </ul>
    </li>
    <li><a href="#license">License</a></li>
</ul>

---

### Requirements
- Frappe >= v13.0.0

---

### Setup

#### Install
1. Get the plugin from Github

*(Required only once)*

`bench get-app https://github.com/kid1194/frappe-login-session-defaults-popup`

2. Install the plugin on any instance/site you want

`bench --site [sitename] install-app frappe_login_session_defaults_popup`

3. Check the usage section below

#### Update
1. Go to the app directory (frappe-bench/apps/frappe_login_session_defaults_popup) and execute:

`git pull`

2. Go back to the frappe-bench directory and execute:

`bench --site [sitename] migrate`

3. *In case you need to restart bench, execute:*

`bench restart`

#### Uninstall
1. Uninstall the plugin from the instance/site

`bench --site [sitename] uninstall-app frappe_login_session_defaults_popup`

2. Uninstall the plugin from bench

`bench remove-app frappe_login_session_defaults_popup`

---

### License
MIT
