import Swal, { SweetAlertOptions } from 'sweetalert2'
enum type { error, success, info, warning, question };

export class AlertaSwal {

    loading(title: string = "OBTENIENDO DATOS...") {
        Swal.fire({
            title: title,
            allowOutsideClick: false,
            allowEscapeKey: false,
            timerProgressBar: true,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading(Swal.getDenyButton());
            },
        });
    }

    close() {
        Swal.close();
    }

    showMessage(tipo: SweetAlertOptions) {
        Swal.fire(tipo);
    }
}