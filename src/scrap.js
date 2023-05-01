const pup = require("puppeteer");

const url = "https://www.mercadolivre.com.br";

const searchFor = "Teclado Mecânico Redragon";

let countPage = 1;

const products = [];

(async () => {
    const browser = await pup.launch({

    });

    const page = await browser.newPage();

    console.log(`-------------------- Iniciando scrap em ${url} --------------------`);

    await page.goto(url);

    // Acessando a barra de pesquisa e realizando a busca pelo produto
    await page.waitForSelector("#cb1-edit");
    await page.type("#cb1-edit", searchFor);
    await Promise.all([
        page.waitForNavigation(),
        page.click(".nav-search-btn")
    ]);

    const links = await page.$$eval(
        ".ui-search-result__image > a",
        el => el.map(
            link => link.href
        )
    );

    // Caminhando pelas por todas as páginas do site do Mercado Livre
    for (const link of links) {
        console.log();
        console.log("Página", countPage);
        console.log();

        await page.goto(link);

        await page.waitForSelector(".ui-pdp-title");

        // Faz scrap das propriedades do produto buscado (título, preço, vendedor e link do produto)
        const title = await page.$eval(
            ".ui-pdp-title",
            el => el.innerText
        );

        const price = await page.$eval(
            ".andes-money-amount__fraction",
            el => el.innerText
        );

        const seller = await page.evaluate(() => {
            const element = document.querySelector(".ui-pdp-seller__link-trigger");
            if (!element) return null;
            return element.innerText;
        });

        const item = {};
        item.title = title;
        item.price = price;
        (seller ? item.seller = seller : "");
        item.link = link;

        products.push(item);

        console.log(products);
        console.log();

        countPage++;
    }

    await new Promise(
        r => setTimeout(r, 3000)
    );

    await browser.close();

    console.log(`------------------------------- Scrap finalizado com sucesso -------------------------------`);
})();