frappe.ui.form.on('Delivery Note', {
    setup: function (frm) {

    },
    onload: function (frm) {
        add_irsaliye_btns(frm)
    },
    refresh: function (frm) {
        add_irsaliye_btns(frm)
    },
})

var add_irsaliye_btns = function(frm) {
    if (frm.doc.docstatus != 1 || frm.doc.is_return) {
        return
    }
    frm.add_custom_button(__('Gönder E Irsaliye'), function () {
        frappe.call({
            method: 'erpnextturkish.eirsaliye.api.eirsaliye.send_eirsaliye',
            args: {
                'delivery_note_name': frm.doc.name
            },
            callback: function (data) {
                if (data.message) {
                    frm.reload_doc()
                    console.table(data.message)
                    show_msg(data)
                }
            }
        });
    });
    frm.add_custom_button(__('Vaildate E Irsaliye'), function () {
        frappe.call({
            method: 'erpnextturkish.eirsaliye.api.eirsaliye.validate_eirsaliye',
            args: {
                'delivery_note_name': frm.doc.name
            },
            callback: function (data) {
                if (data.message) {
                    frm.reload_doc()
                    console.table(data.message)
                    show_msg(data)
                }
            }
        });
    });
}

var show_msg = function(data) {
    if (data.message.belgeNo) {
        frappe.msgprint({
            title: __('Success'),
            indicator: 'green',
            message: __(`Delivery Note Registered Successfully with number "${data.message.belgeNo}"`)
        });
    }
    else if (data.message.durum == 1){
        frappe.msgprint({
            title: __('Wating'),
            indicator: 'blue',
            message: __(`Processing has not finished, please try again later`)
        });
    }
    else if (data.message.durum || data.message.aciklama){
        frappe.msgprint({
            title: __('Error'),
            indicator: 'red',
            message: data.message.aciklama || data.message.durum 
        });
    }
    else {
        frappe.msgprint({
            message: data.message 
        });
    }
}