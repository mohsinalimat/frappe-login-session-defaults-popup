frappe.provide('frappe.login_session_defaults_popup');
frappe.provide('frappe.ui.toolbar');

frappe.login_session_defaults_popup.init = function() {
    frappe.call({
        type: 'GET',
        method: 'frappe_login_session_defaults_popup.override.get_settings',
    }).then(function(res) {
        let data = res.message;
        if (frappe.login_session_defaults_popup.on_init) {
            frappe.login_session_defaults_popup.on_init(data);
        }
        frappe.require([
            'assets/frappe/js/lib/socket.io.min.js',
            'assets/frappe/js/frappe/socketio_client.js',
        ], function() {
            frappe.socketio.init(data.socketio_port);
            if (frappe.login_session_defaults_popup.on_waiting) {
                frappe.login_session_defaults_popup.on_waiting();
            }
            frappe.realtime.on('login_event_triggered', function(res) {
                frappe.login_session_defaults_popup.on_login_triggered(res);
            });
        });
    });
};

frappe.login_session_defaults_popup.on_login_triggered = function(res) {
    if (!frappe.ui.toolbar.setup_session_defaults) {
        frappe.timeout(1).then(function() {
            frappe.login_session_defaults_popup.on_login_triggered(res);
        });
        return;
    }
    if (frappe.login_session_defaults_popup._is_login_triggered) return;
    frappe.login_session_defaults_popup._is_login_triggered = true;
    if (frappe.login_session_defaults_popup.on_login) {
        frappe.login_session_defaults_popup.on_login(res);
    }
    frappe.ui.toolbar.setup_session_defaults();
};

frappe.timeout(1).then(function() {
    frappe.login_session_defaults_popup.init();
});