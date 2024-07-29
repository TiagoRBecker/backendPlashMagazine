class Pagarme {
     async createOrder(items:any,totalAmount:any,id:any){
        const options = {
            method: "POST",
            headers: {
              "content-type": "application/json",
              authorization: `Basic ${process.env.SECRET_KEY}`,
            },
            body: JSON.stringify({
              customer: {
                name: "Alfredo",
                email: "teste@gmail.com",
      
              },
              items: items,
      
              payments: [
                {
                  payment_method: "checkout",
      
                  checkout: {
                    expires_in: 108000,
                    default_payment_method: "pix",
                    accepted_payment_methods: ["pix", "credit_card"],
                    success_url: "http://localhost:3001/sucess",
                    skip_checkout_success_page: false,
                    customer_editable: true,
                    billing_address_editable: true,
                    Pix: {
                      expires_in: 108000,
                    },
                    credit_card: {
                      installments: [
                        {
                          number: 1,
                          total: totalAmount + 10,
                        },
                        {
                          number: 2,
                          total: totalAmount,
                        },
                        {
                          number: 3,
                          total: totalAmount,
                        },
                        {
                          number: 4,
                          total: totalAmount,
                        },
                        {
                          number: 5,
                          total: totalAmount,
                        },
                      ],
                      statement_descriptor: "Plash",
                    },
                  },
                },
              ],
      
              closed: true,
              metadata: { id: id },
            }),
          };
          const request = await fetch("https://api.pagar.me/core/v5/orders", options);
          const response = await request.json();
           console.log(response)
     }

}
 const PagarmeHook = new Pagarme()
 export default PagarmeHook