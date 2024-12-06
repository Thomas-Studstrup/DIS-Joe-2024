document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('editRunModal');
    const closeButtons = modal.querySelectorAll('.close, .close-modal');
    const editRunForm = document.getElementById('editRunForm');

    // Open modal and populate form
    document.querySelectorAll('.edit-run-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const runData = JSON.parse(this.dataset.run);
            
            // Set form action
            editRunForm.action = `/admin/runs/${runData.run_id}/edit`;
            
            // Populate form fields
            document.getElementById('edit_run_name').value = runData.run_name;
            document.getElementById('edit_location').value = runData.location;
            
            // Format datetime for input
            const dateTime = new Date(runData.date_time);
            const formattedDateTime = dateTime.toISOString().slice(0, 16);
            document.getElementById('edit_date_time').value = formattedDateTime;
            
            modal.style.display = 'block';
        });
    });

    // Close modal
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Discount modal
    const discountModal = document.getElementById('createDiscountModal');
    const createDiscountBtn = document.querySelector('.create-discount-btn');
    const discountCloseButtons = discountModal.querySelectorAll('.close, .close-modal');

    // Open discount modal
    if (createDiscountBtn) {
        createDiscountBtn.addEventListener('click', function() {
            discountModal.style.display = 'block';
            
            // Set minimum date to today
            const today = new Date();
            const minDateTime = today.toISOString().slice(0, 16);
            document.getElementById('expires_at').min = minDateTime;
        });
    }

    // Close discount modal
    discountCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            discountModal.style.display = 'none';
        });
    });

    // Close discount modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === discountModal) {
            discountModal.style.display = 'none';
        }
    });
}); 