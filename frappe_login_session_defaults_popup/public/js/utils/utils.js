function get_settings() {
    let promise = frappe.call({
        type: 'GET',
        method: 'frappe_login_session_defaults_popup.override.get_settings',
    });
    promise.then(function(res) {
        return res.message;
    });
    return promise;
}

function setup_socket(data) {
    let promise = frappe.require([
        'assets/frappe/js/lib/socket.io.min.js',
        'assets/frappe/js/frappe/socketio_client.js',
    ]);
    promise.then(function() {
        frappe.socketio.init(data.socketio_port);
        return true;
    });
    return promise;
}

frappe.provide('frappe.ui.toolbar');
frappe.provide('frappe.login_session_defaults_popup');

function show_popup() {
    if (frappe.login_session_defaults_popup._is_login_triggered) return;
    if (!frappe.ui.toolbar.setup_session_defaults) {
        window.setTimeout(function() {
            show_popup();
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
                fields.forEach(function(d) {
                    if (!values[d.fieldname]) values[d.fieldname] = "";
                });
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
}

function on_event() {
    frappe.realtime.on('login_event_triggered', function(res) {
        show_popup();
    });
}

export default function start_plugin() {
    get_settings()
    .then(setup_socket)
    .then(on_event);
}
