const { Builder, By } = require('selenium-webdriver');

async function test1() {
    let driver = await new Builder().forBrowser('MicrosoftEdge').build();
    try {
        console.log('check buy')
        await driver.get('http://localhost:3000/#/broker/Чижик');
        let price = null;
        let startBalance = null;
        let endBalance = null;

        setTimeout(async () => {
            startBalance = await driver.findElement(By.xpath("//p[@id='brokerBalance']")).getText()
            startBalance = Number(startBalance.replace(/\$/g, ''));
            console.log('get start balance: ', startBalance);
        }, 3000)

        setTimeout(async () => {
            await driver.findElement(By.xpath("//input[@id='SBUX_buy_inp']")).sendKeys(1)
            console.log("input count = 1 of stocks")
        }, 8000)

        setTimeout(async () => {
            await driver.findElement(By.xpath("//button[@id='SBUX_buy_confirm_btn']")).click()
            price = await driver.findElement(By.xpath("//p[@id='SBUX_price']")).getText()
            price = Number(price.slice(0, price.length-1))
            console.log('byu', price)
        }, 13000)

        setTimeout(async () => {
            endBalance= await driver.findElement(By.xpath("//p[@id='brokerBalance']")).getText()
            endBalance = Number(endBalance.replace(/\$/g, ''))
            console.log('start balance - ', startBalance)
            console.log('price', price)
            console.log('end balance', endBalance);

            console.log(parseFloat(startBalance - price), " vs ", parseFloat(endBalance))
            if(parseFloat(endBalance)===(parseFloat(startBalance)-parseFloat(price))){
                console.log("balance right")
            }
        }, 18000)
    } finally {
        // await driver.quit();
    }
}

async function test2() {
    let driver = await new Builder().forBrowser('MicrosoftEdge').build();
    try {
        console.log('check sell')
        await driver.get('http://localhost:3000/#/broker/Чижик');
        let price = null;
        let startBalance = null;
        let endBalance = null;

        setTimeout(async () => {
            startBalance = await driver.findElement(By.xpath("//p[@id='brokerBalance']")).getText()
            startBalance = Number(startBalance.replace(/\$/g, ''));
            console.log('get start balance: ', startBalance);
        }, 3000)

        setTimeout(async () => {
            await driver.findElement(By.xpath("//input[@id='SBUX_buy_inp']")).sendKeys(3)
            console.log("input count = 3 of stocks")
        }, 8000)

        setTimeout(async () => {
            await driver.findElement(By.xpath("//button[@id='SBUX_sell_confirm_btn']")).click()
            price = await driver.findElement(By.xpath("//p[@id='SBUX_price']")).getText()
            price = Number(price.slice(0, price.length-1))
            console.log('sell', price * 3)
        }, 13000)

        setTimeout(async () => {
            endBalance= await driver.findElement(By.xpath("//p[@id='brokerBalance']")).getText()
            endBalance = Number(endBalance.replace(/\$/g, ''))
            console.log('start balance', startBalance)
            console.log('price', price * 3)
            console.log('end balance', endBalance);

            console.log(parseFloat(startBalance + price * 3), " vs ", parseFloat(endBalance))
            if(parseFloat(endBalance)===(parseFloat(startBalance) + parseFloat(price) * 3)){
                console.log("balance right")
            }
        }, 18000)
    } finally {
        //await driver.quit();
    }
}

test1()
test2()