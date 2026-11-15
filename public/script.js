// Script for handling product submission form interactions
const form = document.getElementById('submissionForm');
const products = document.getElementById('products');
const submitButton = form.querySelector('button[type="submit"]');

// Track submission state
let isSubmitting = false;

// Add Product Row
document.getElementById("addProductButton").addEventListener("click", () => {
    // Clone the first product row and clear its input values
    const row = products.querySelector(".product-row").cloneNode(true);

    // Clear input values in the cloned row
    row.querySelectorAll("input").forEach(input => input.value = "");

    // Create a button to remove this product row
    const removeButton = document.createElement("button");

    // Create Remove Product button details
    removeButton.type = "button";
    removeButton.className = "removeProduct";
    removeButton.textContent = "Remove Product";

    // Attach click event to remove this product row
    removeButton.addEventListener("click", () => row.remove());

    // Append the remove button to the cloned row
    row.appendChild(removeButton);

    // Append the cloned row to the products container
    products.appendChild(row);
});

// Clear Uploaded Image
document.getElementById("removeImageButton").addEventListener("click", () => {
    document.getElementById("image").value = "";
});

// Convert Image to Base64
function imageToBase64(file) {
    // Convert the image file to a Base64 string
    return new Promise((resolve, reject) => {
        // Create a FileReader to read the image file
        const reader = new FileReader();

        // Resolve the promise when the file is successfully read
        reader.onload = () => resolve(reader.result);

        // Reject the promise if there is an error reading the file
        reader.onerror = () => reject(new Error("Failed to read image"));

        // Read the image file as a Data URL (Base64)
        reader.readAsDataURL(file);
    });
}

// Submit Form
form.addEventListener('submit', async (event) => {
    // Prevent default form submission behavior
    event.preventDefault();

    // Prevent duplicate submissions
    if (isSubmitting) return;

    // Set submission state and disable submit button
    isSubmitting = true;
    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";

    // Collect form data and prepare for submission
    try {
        // Collect products and prices
        const items = [...products.querySelectorAll(".product-row")].map(row => ({
            product_name: row.querySelector("[name='product_name[]']").value,
            price: parseFloat(row.querySelector("[name='product_price[]']").value)
        }));

        // Get and validate image
        const file = document.getElementById("image").files[0];

        // Validate image file if it exists
        if (file && (file.size > 5 * 1024 * 1024 ||
            !["image/jpeg", "image/png", "image/webp"].includes(file.type))) {
            throw new Error("Select a JPEG, PNG or WEBP image under 5 MB.");
        }

        // Convert image to Base64 if it exists
        const image = file ? await imageToBase64(file) : null;

        // Submit data to backend
        const response = await fetch('/api/submissions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                market_name: document.getElementById('market_name').value,
                items,
                image,
                image_type: document.getElementById('image_type').value
            })
        });

        // Response from the backend after submission
        const result = await response.json().catch(() => ({}));

        // Check if the response indicates an error
        if (!response.ok) {
            throw new Error(result.error || 'Failed to submit form');
        }

        // Successful submission
        // Notify the user and reset the form
        alert("Submission successful");
        form.reset();

        // Remove additional product rows, keeping only the first one
        products.querySelectorAll(".product-row").forEach((row, index) => {
            if (index > 0) row.remove();
        });

    } catch (error) {
        // Notify the user about the error
        alert(error.message);

    } finally {
        // Re-enable Submit button
        isSubmitting = false;
        submitButton.disabled = false;
        submitButton.textContent = "Submit Prices";
    }
});

/*
Code references:
- https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode

- https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement

- https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener

- https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL

- https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
*/