const pup = require("puppeteer");

const url = "https://www.mercadolivre.com.br";

const searchFor = "Teclado Mecânico Gamer Redragon";

count = 1;

(async () => {
    // Inicializar o navegador
    const browser = await pup.launch({ 
        // headless: false,
        // executablePath: '/usr/bin/chromium-browser',
    });
    // Cria uma nova página
    const page = await browser.newPage();
    // Redireciona para a url
    await page.goto(url);

    await page.waitForSelector("#cb1-edit");

    // Input de pesquisa do produto
    await page.type("#cb1-edit", searchFor);

    await Promise.all([
        page.waitForNavigation(),
        await page.click(".nav-search-btn")
    ]);

    const links = await page.$$eval(
        ".ui-search-result__image > a", 
        el => el.map(
            link => link.href
        )
    );

    for (const link of links) {
        await page.goto(link);

        await page.waitForSelector(".ui-pdp-title");

        const title = await page.$eval(".ui-pdp-title", el => el.innerText);
        const price = await page.$eval(".andes-money-amount__fraction", el => el.innerText);
        const seller = await page.evaluate(() => {
            const el = document.querySelector(".ui-pdp-seller__link-trigger");
            if (!el) return null;
            return el.innerText;
        });

        const obj = {};

        obj.title = title;
        obj.price = price;
        obj.seller = seller;

        console.log(obj);
        
        count++;
    }

    new Promise(r => setTimeout(r, 3000));
    // Fecha o browser
    await browser.close();
})();