import {Resend} from "resend";



async function test() {
    const response = await fetch('http://localhost:5678/webhook-test/ca29e765-6bfd-424c-8529-ba4f7721ce5d', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: "Patrick",
            email: "korbpatrick@web.de",
            phone: "015172508124",
            birthDate: "2002-09-13",
            gender: "männlich",
        })
    })
}

test()


