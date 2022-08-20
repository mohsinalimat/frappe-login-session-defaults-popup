import frappe


def on_login(login_manager):
    frappe.publish_realtime(event='login_event_triggered', message={'status': True}, after_commit=True)


def on_session_creation(login_manager):
    frappe.publish_realtime(event='login_event_triggered', message={'status': True}, after_commit=True)
    

@frappe.whitelist()
def get_settings() -> dict:
    return {
        'socketio_port': frappe.conf.socketio_port,
    }
