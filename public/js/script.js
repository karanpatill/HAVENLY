(function () {
  'use strict';

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation');

  // Loop over them and prevent submission if validation fails
  forms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add('was-validated');
    }, false);
  });
})();
$(document).ready(function () {
  $(".alert").alert(); // ✅ Initialize Bootstrap alerts
});