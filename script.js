document.addEventListener('DOMContentLoaded', () => {
    const rechargeForm = document.getElementById('recharge-form');
    const countdownTimerEl = document.getElementById('countdown-timer');
    const timerEl = document.getElementById('timer');
    const popup = document.getElementById('popup-message');
    const popupTitle = document.getElementById('popup-title');
    const popupText = document.getElementById('popup-text');
    const popupClose = document.getElementById('popup-close');
    const paymentBtns = document.querySelectorAll('.payment-btn');
    const paymentMethodInput = document.getElementById('payment-method');

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Payment button selection logic
    paymentBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            paymentBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            paymentMethodInput.value = btn.dataset.method;
        });
    });

    // Recharge Form Submission Logic
    rechargeForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const userId = document.getElementById('user-id').value;
        const serverId = document.getElementById('server-id').value;
        const diamondAmount = document.getElementById('diamond-amount').value;
        const paymentMethod = document.getElementById('payment-method').value;
        const screenshot = document.getElementById('payment-screenshot').files[0];

        if (!userId || !serverId || !diamondAmount || !paymentMethod || !screenshot) {
            alert('Please fill out all fields.');
            return;
        }

        rechargeForm.classList.add('hidden');
        countdownTimerEl.classList.remove('hidden');

        let timeLeft = 1 * 60; // 1 minute
        const timerInterval = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            let seconds = timeLeft % 60;
            seconds = seconds < 10 ? '0' + seconds : seconds;
            timerEl.textContent = `${minutes}:${seconds}`;
            if (--timeLeft < 0) {
                clearInterval(timerInterval);
                showPopup();
            }
        }, 1000);
    });

    function showPopup() {
        const isSuccess = Math.random() > 0.3;
        if (isSuccess) {
            popupTitle.textContent = "Payment Completed Successfully";
            popupText.textContent = "Your diamonds have been credited to your account.";
        } else {
            popupTitle.textContent = "Payment Not Found";
            popupText.textContent = "We could not verify your payment. Please contact support.";
        }
        popup.classList.remove('hidden');
    }

    popupClose.addEventListener('click', () => {
        popup.classList.add('hidden');
        rechargeForm.classList.remove('hidden');
        countdownTimerEl.classList.add('hidden');
        rechargeForm.reset();
        paymentBtns.forEach(b => b.classList.remove('active'));
    });

    // ✅ Contact Form Submission (Formspree)
    const contactForm = document.getElementById('contact-form');
    const contactStatus = document.getElementById('contact-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    contactStatus.style.color = "green";
                    contactStatus.textContent = "Thank you! Your message has been sent.";
                    contactForm.reset();
                } else {
                    contactStatus.style.color = "red";
                    contactStatus.textContent = "Oops! Something went wrong. Please try again.";
                }
            } catch (error) {
                contactStatus.style.color = "red";
                contactStatus.textContent = "Error submitting form. Please check your connection.";
            }
        });
    }
});
