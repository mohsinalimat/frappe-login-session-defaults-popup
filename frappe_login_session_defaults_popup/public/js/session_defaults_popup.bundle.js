frappe.provide('frappe.login_session_defaults_popup');
frappe.provide('frappe.ui.toolbar');

frappe.login_session_defaults_popup.get_settings = function() {
    let promise = frappe.call({
        type: 'GET',
        method: 'frappe_login_session_defaults_popup.override.get_settings',
    });
    promise.then(function(res) {
        return res.message;
    });
    return promise;
};

frappe.login_session_defaults_popup.setup_socket = function(data) {
    let promise = frappe.require([
        'assets/frappe/js/lib/socket.io.min.js',
        'assets/frappe/js/frappe/socketio_client.js',
    ]);
    promise.then(function() {
        frappe.socketio.init(data.socketio_port);
        return true;
    });
    return promise;
};

frappe.login_session_defaults_popup.show_popup = function() {
    if (frappe.login_session_defaults_popup._is_login_triggered) return;
    if (!frappe.ui.toolbar.setup_session_defaults) {
        window.setTimeout(function() {
            frappe.login_session_defaults_popup.show_popup();
        }, 200);
        return;
    }
    frappe.login_session_defaults_popup._is_login_triggered = true;
    let fields = [];
    frappe.call({
        method: 'frappe.core.doctype.session_default_settings.session_default_settings.get_session_default_values',
        callback: function(data) {
            fields = JSON.parse(data.message);
            var d = new frappe.ui.Dialog({
                fields: fields,
                title: __('Session Defaults'),
            });
            d.set_primary_action(__('Save'), function() {
                var values = d.get_values();
                if (!values) {
                    d.hide();
                    frappe.throw(_('An error occurred while setting Session Defaults'));
                    return;
                }
                // if default is not set for a particular field in prompt
                let count = 0;
                fields.forEach(function(d) {
                    if (!values[d.fieldname]) values[d.fieldname] = "";
                    else count++;
                });
                if (!count) {
                    frappe.show_alert({
                        'message': __('Please fill the form of Session Defaults.'),
                        'indicator': 'orange'
                    });
                    return;
                }
                frappe.call({
                    method: 'frappe.core.doctype.session_default_settings.session_default_settings.set_session_default_values',
                    args: {
                        default_values: values,
                    },
                    callback: function(data) {
                        d.hide();
                        if (data.message == "success") {
                            frappe.show_alert({
                                'message': __('Session Defaults Saved'),
                                'indicator': 'green'
                            });
                            frappe.ui.toolbar.clear_cache();
                        }    else {
                            frappe.throw(__('An error occurred while setting Session Defaults'));
                        }
                    }
                });
            });
            d.header.find('.modal-actions').remove();
            d.show();
        }
    });
};

frappe.login_session_defaults_popup.on_event = function() {
    frappe.realtime.on('login_event_triggered', function(res) {
        frappe.login_session_defaults_popup.show_popup();
    });
};

$(document).ready(function() {
    frappe.login_session_defaults_popup.get_settings()
    .then(frappe.login_session_defaults_popup.setup_socket)
    .then(frappe.login_session_defaults_popup.on_event);
});
