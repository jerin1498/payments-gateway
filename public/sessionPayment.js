const stripe = Stripe('pk_test_51J8iJxSBy7HPSC8RkLzH4UD8hnHnbOfpGHJ1MmVCwSt9gNCDlIBt0t4JjrA4ggk9W5aCmuCHVErTiYaJZ5zfFIur00Rb0mwfzx');
let btn = document.getElementById('btn-pay')

btn.addEventListener('click', async(e) => {
    e.preventDefault()
    try {
        const session = await axios(`/stripe/cerateSessions`);
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    } catch (error) {
        console.log(error)
    }
})