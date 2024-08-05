const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const card = await prisma.card.create({
    data: {
      cardCode: 'SM104',
      expansion: 'Sun & Moon Promos',
      name: 'Solgaleo-GX',
      image:
        'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SMP/SMP_104_R_EN_LG.png',
      hp: 250,
      attack: 120,
      type: 'Metal',
      resist: 'Psychic',
      weak: 'Fire',
      userId: '63b982e3-be3c-4dc5-b4d0-fae44ea13b9d',
    },
  });
  console.log('Card added:', card);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

/*const puppeteer = require('puppeteer');

async function getCardData(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const cardData = await page.evaluate(() => {
    const getText = (selector) => document.querySelector(selector)?.innerText.trim() || '';
    const getImageSrc = (selector) => document.querySelector(selector)?.src || '';
    const getType = (selector) => document.querySelector(selector)?.getAttribute('title') || '';

    const getWeakness = () => {
      const weaknessElement = document.querySelector('.stat h4:contains("Weakness") + ul.card-energies li');
      return weaknessElement ? weaknessElement.getAttribute('title') : '';
    };

    const getResistance = () => {
      const resistanceElement = document.querySelector('.stat h4:contains("Resistance") + ul.card-energies li');
      return resistanceElement ? resistanceElement.getAttribute('title') : '';
    };

    return {
      cardCode: getText('.card-number'),
      expansion: 
      name: getText('.card-name'),
      image: getImageSrc('.card-image img'),
      hp: parseInt(getText('.card-hp').replace('HP', '')),
      attack: Math.max(...Array.from(document.querySelectorAll('.attack-damage')).map(e => parseInt(e.innerText))),
      type: getType('.card-type'),
      resist: getResistance(),
      weak: getWeakness(),
      userId: '63b982e3-be3c-4dc5-b4d0-fae44ea13b9d',
    };
  });

  await browser.close();
  return cardData;
}

(async () => {
  const url = 'https://www.pokemon.com/us/pokemon-tcg/pokemon-cards/series/svp/17/';
  const cardData = await getCardData(url);
  console.log(cardData);
})();*/
