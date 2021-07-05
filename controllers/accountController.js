const stripe = require('stripe')(process.env.STRIPEPRIVATEKEY);
const fs = require('fs')
const path = require('path')




async function createBankToken () {
    const token = await stripe.tokens.create({

        bank_account: {
          country: 'IN',
          currency: 'inr',
          account_holder_name: 'shibu',
          account_holder_type: 'individual',
          routing_number: 'HDFC0000261',
          account_number: '000123456789',
        },
    });

    return token.id
    
}

async function createPii () {
    const token = await stripe.tokens.create({
        pii: {id_number: '000000000'},
    });

    return token.id
}

async function verificationDoc(filepath, fileName) {
    let filePath = path.join(__dirname , filepath)
    var fp = fs.readFileSync(filePath);
    var file = await stripe.files.create({
        purpose: 'identity_document',
        file: {
            data: fp,
            name: fileName,
            type: 'application/octet-stream',
        },
    });
    return file.id
}

exports.createAccount = async (req, res, next) => {
    try {
        const email = req.body.email
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const bankAccountToken = await createBankToken()
        const personalIdNumber = await createPii()
        
        const docFront = await verificationDoc('./files/WPVG_icon_2016.svg.png', 'WPVG_icon_2016.svg.png')
        const docBack = await verificationDoc('./files/WPVG_icon_2016.svg.png', 'WPVG_icon_2016.svg.png')

        const account = await stripe.accounts.create({
            type: 'custom', // coustom standard express
            country: 'IN',
            email: email,
            capabilities: {
            card_payments: {requested: true},
            transfers: {requested: true},
            },
            business_type: "individual",
            individual: {
                first_name: "ligi",
                last_name: 'preshiba',
                id_number: personalIdNumber,
                email: email,
                gender: 'male',
                address: {
                    city: "nagercoil",
                    country: "IN",
                    line1: "kumarapuram",
                    line2: "kotticode",
                    postal_code: 629164,
                    state: "TN"
                },
                dob: {
                    day: 01,
                    month: 01,
                    year: 1991
                },
                verification: {
                    document: {
                        back: docFront,
                        front: docBack
                    }
                },
                metadata: {
                    data: 'something needed in the future'
                }
            },
            metadata: {
                data: 'something needed in the future'
            },
            business_profile: {
                mcc: 8011, // merchent category code of doctor is 8011 in stripe
                name: "testing doctor",
                product_description: 'Online telemedicine and doctor counsulting',
                support_address: {
                    city: "nagercoil",
                    country: "IN",
                    line1: "kumarapuram",
                    line2: "kotticode",
                    postal_code: 629164,
                    state: "Tamilnadu"
                },
                support_email: email,
                support_phone: 9952384938,
                //support_url: 'https://google.com',
                //url: 'localhost:4250'
            },
            tos_acceptance: {
                date: new Date(2015, 11, 17),
                ip: ip
            },
            external_account: bankAccountToken


        });
        return res.status(200).json({
            data: {
                account
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            error: error
        })
    }
}



exports.retrieveAccount = async (req, res, next) => {
    try {
        let accoutnId = req.body.accountId
        const account = await stripe.accounts.retrieve(
            accoutnId
        );
        return res.status(200).json({
            data: {
                account
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            error: error
        })
    }
}


exports.updateAccount = async (req, res, next) => {
    try {
        const accountID = req.body.accountId
        const toUpdate = req.body.toUpdate
        const account = await stripe.accounts.update(
            accountID,
            toUpdate
          );
        return res.status(200).json({
            data: {
                account
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            error: error
        })
    }
}


// we have to create a manuval card lot of work to do in front end in this mode
exports.createPayment = async(req, res, next) => {
   try {

    const paymentIntent = await stripe.paymentIntents.create({
        payment_method_types: ['card'],
        amount: 1000 * 100,
        currency: 'INR',
        application_fee_amount: 123 * 100,
        transfer_data: {
          destination: 'acct_1J929MSF30CXUyEn',
        },
      });


    return res.status(200).json({
        clientSecret: paymentIntent.client_secret
    })

   } catch (error) {
       console.log(error)
       return res.status(400).json({
        error: error
    })
   }

}


// create payment using sessions default card is avialable
exports.createSessions = async (req, res, next) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
              name: 'issic hospital',
              amount: 500 * 100,
              currency: 'INR',
              quantity: 1,
            }],
            payment_intent_data: {
              application_fee_amount: 200 * 100,
              transfer_data: {
                destination: 'acct_1J929MSF30CXUyEn',
              },
            },
            mode: 'payment',
            success_url: 'https://example.com/success',
            cancel_url: 'https://example.com/failure',
        });
    
        return res.status(200).json({
            session
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            error
        })
    }

}