// toastMessage(message) {

//     var toast = document.createElement('div');
//     toast.className = 'alert alert-danger alert-dismissible fade show';
//     toast.role = 'alert';
//     toast.innerHTML = `<strong>Holy guacamole!</strong>${message}`;
//     //button
//     var button = document.createElement('button');
//     button.className = 'close';
//     button.type = 'button';
//     button.dataDismiss = 'alert';
//     button.ariaLabel = 'Close';
//     var span = document.createElement('span');
//     span.className = 'fa fa-times';
//     button.appendChild(span);

//     toast.appendChild(button);

//     document.getElementById('toast-message').appendChild(toast);
// }