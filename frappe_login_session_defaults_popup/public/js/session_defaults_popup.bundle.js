async function _initLoginSessionDefaultsPopup() {
    let res = await frappe.call({
        type: 'GET',
        method: 'frappe_login_session_defaults_popup.api.session.get_settings',
    });
    let data = await res.message;
    await frappe.require([
        'assets/frappe/js/lib/socket.io.min.js',
        'assets/frappe/js/frappe/socketio_client.js',
    ], () => {
        frappe.socketio.init(data.socketio_port);
        frappe.realtime.on('login_session_created', function(res) {
            frappe.ui.toolbar.setup_session_defaults();
        });
    });
}
_initLoginSessionDefaultsPopup();
