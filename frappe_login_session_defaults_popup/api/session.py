import frappe

def on_create(login_manager):
    frappe.publish_realtime(event='login_session_created', message={'status': True}, after_commit=True)
    

@frappe.whitelist()
def get_settings() -> dict:
    return {
        'socketio_port': frappe.conf.socketio_port,
    }
